import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import NoChallengeView from '@/components/screens/public/LoginProvider/modules/Provider/modules/NoChallenge/NoChallenge.view';
import Error from '@/components/modules/Error';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('NoChallengeView', () => {
  let wrapper;
  const createWrapper = () =>
    shallowMount(NoChallengeView, {
      provide: {
        theme: 'default',
      },
      localVue,
      sync: false,
      i18n,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('NoChallengeView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render message', () => {
      expect(wrapper.find(Error).attributes().error).toBe(
        i18n.t('components.loginProviderPassword.loginChallenge'),
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
