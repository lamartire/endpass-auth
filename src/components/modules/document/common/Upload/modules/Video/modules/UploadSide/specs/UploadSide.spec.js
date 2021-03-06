import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import { document } from '@unitFixtures/documents';
import setupI18n from '@/locales/i18nSetup';

import UploadSide from '../UploadSide';
import documentsService from '@/service/documents';
import riskScoringService from '@/service/riskScoring';
import { DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('UploadVideo > UploadSide', () => {
  let wrapper;

  const file = new File([''], 'filename');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  const createWrapper = options => {
    return shallowMount(UploadSide, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        documentType: DOC_TYPES.SELFIE,
      },
      ...options,
    });
  };

  const emitUpload = async () => {
    wrapper.find('drop-area-stub').vm.$emit('change', [file]);
    wrapper.find('[data-test=upload-button]').vm.$emit('click');
    await global.flushPromises();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('UploadSide');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should upload recorded file and confirm document', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper = createWrapper({
        propsData: {
          documentType: DOC_TYPES.SELFIE,
          recordedFile: file,
        },
      });

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should upload front side of document and recognize', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      await emitUpload();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should send fingerprint after upload', async () => {
      expect.assertions(2);

      expect(riskScoringService.sendUserMetrics).not.toBeCalled();

      await emitUpload();

      expect(riskScoringService.sendUserMetrics).toBeCalledTimes(1);
    });

    it('should not emit confirm, if error in recognize', async () => {
      expect.assertions(2);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      expect(wrapper.emitted().confirm).toBeUndefined();

      await emitUpload();
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should not emit confirm, if error in upload', async () => {
      expect.assertions(1);

      documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

      await emitUpload();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should show error when upload', async () => {
      expect.assertions(2);

      documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

      expect(
        wrapper.find('document-upload-front-stub').attributes().error,
      ).toBeUndefined();

      await emitUpload();

      expect(
        wrapper.find('document-upload-front-stub').attributes().error,
      ).toBe(i18n.t('store.error.uploadDocument.default'));
    });

    it('should emit confirm after recognize', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      await emitUpload();
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should confirm after upload', async () => {
      expect.assertions(2);

      expect(documentsService.confirmDocument).not.toBeCalled();

      await emitUpload();
      await global.flushPromises();

      expect(documentsService.confirmDocument).toBeCalledTimes(1);
    });
  });
});
