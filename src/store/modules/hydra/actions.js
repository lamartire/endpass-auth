import get from 'lodash/get';
import Wallet from '@/class/Wallet';
import hydraService from '@/service/hydra';
import { queryParamsToObject, objectToQueryParams } from '@/util/url';

export default {
  getHydraParams({ state, commit }) {
    const challengeId = get(state.params, 'challengeId');

    if (challengeId) {
      return;
    }

    const params = queryParamsToObject(window.location.search);

    if (!params.challengeId) {
      throw new Error('Missing challenge_id parameter!');
    }

    commit('setHydraParams', params);
  },

  redirectToLogin({ state }, router) {
    if (state.params) {
      router.replace(`/login?${objectToQueryParams(state.params)}`);
    } else {
      router.replace('/login');
    }
  },

  async hydraLogin({ state, dispatch, commit, rootState }, password) {
    commit('changeLoadingStatus', true);

    try {
      await dispatch('defineSettings');

      const { challengeId } = state.params;
      const { lastActiveAccount, email } = get(rootState, 'accounts.settings');
      const v3Keystore = await dispatch('getAccount', lastActiveAccount);
      const wallet = new Wallet(v3Keystore);
      const { signature } = await wallet.sign(email, password);

      await hydraService.login({
        challengeId,
        signature,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Password is incorrect');
    } finally {
      commit('changeLoadingStatus', false);
    }
  },
};
