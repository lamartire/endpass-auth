// @ts-check
import get from 'lodash/get';
import request from '@/class/singleton/request';
import { AUTH_STATUS_CODE } from '@/constants';
import authAdapter from '@/service/auth/authAdapter';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const TIMEOUT_DEFAULT = 1500;

const CODE_TO_STATUS = {
  200: AUTH_STATUS_CODE.LOGGED_IN,
  401: AUTH_STATUS_CODE.NOT_LOGGED,
  403: AUTH_STATUS_CODE.NEED_PERMISSION,
};

/**
 * @param {Promise<any>} promise
 * @return {Promise<any>}
 */
const withSuccess = promise => {
  return promise.then(res => {
    if (res && !res.success) throw new Error(res.message);

    return res;
  });
};

/**
 * @param {Function} handler
 * @return {number}
 */
const createTimeout = handler => setTimeout(handler, TIMEOUT_DEFAULT);

/**
 * @param {string} email
 * @return {Promise<*>}
 */
const getAuthChallenge = async email => {
  const data = await withSuccess(
    request.post(`${identityBaseUrl}/auth`, {
      email,
    }),
  );
  return authAdapter(data);
};

/**
 * @param {string} password
 * @param {string} originHost
 * @return {Promise<any>}
 */
const setAuthPermission = async (password, originHost) => {
  const res = await request.post(`${identityBaseUrl}/auth/permission`, {
    password,
    originHost,
  });
  return res;
};

/**
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.code
 * @param {string} params.password
 * @param {boolean} params.isSignUp
 * @param {boolean} params.isRemember
 * @return {Promise<any>}
 */
const authWithCode = async ({
  email,
  code,
  password,
  isSignUp,
  isRemember,
}) => {
  const url = isSignUp
    ? `${identityBaseUrl}/auth/signup`
    : `${identityBaseUrl}/auth/token`;

  return withSuccess(
    request.post(url, {
      challengeType: 'otp',
      email,
      code,
      password,
      remember: isRemember,
    }),
  );
};

/**
 * @param {string} idToken
 * @return {Promise<*>}
 */
const authWithGoogle = async idToken => {
  const data = await request
    .post(`${identityBaseUrl}/auth/google`, {
      token: idToken,
    })
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    });

  return authAdapter(data);
};

const logout = () => request.post(`${identityBaseUrl}/logout`);

/**
 * @return {Promise<{expiresAt: number, status: string, hash: string}>}
 */
const getAuthStatus = async () => {
  try {
    const { expiresAt, hash } = await request.get(
      `${identityBaseUrl}/auth/check`,
    );

    return {
      status: AUTH_STATUS_CODE.LOGGED_IN,
      hash,
      expiresAt,
    };
  } catch (e) {
    /** @type {keyof typeof CODE_TO_STATUS} */
    const statusCode = get(e, 'response.status');
    const status = CODE_TO_STATUS[statusCode] || AUTH_STATUS_CODE.NOT_LOGGED;
    const hash = get(e, 'response.data.hash', '');
    const expiresAt = get(e, 'response.data.expiresAt', 0);

    return {
      status,
      hash,
      expiresAt,
    };
  }
};

/**
 * @return {Promise<number>}
 */
const waitLogin = () =>
  new Promise((resolve, reject) => {
    /* eslint-disable-next-line */
    const handler = async function() {
      try {
        const { status } = await getAuthStatus();

        if (
          status === AUTH_STATUS_CODE.LOGGED_IN ||
          status === AUTH_STATUS_CODE.NEED_PERMISSION
        ) {
          return resolve();
        }

        createTimeout(handler);
      } catch (err) {
        return reject(err);
      }
    };

    return handler();
  });

/**
 * @param {string} email
 * @return {Promise<string>}
 */
const getRecoveryIdentifier = email =>
  request
    .get(`${identityBaseUrl}/auth/recover?email=${encodeURIComponent(email)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res.message;
    });

/**
 * @param {string} email
 * @return {Promise<number>}
 */
const sendEmailCode = async email => {
  const { timeout } = await request.post(`${identityBaseUrl}/auth/code`, {
    email,
  });

  return timeout;
};

/**
 * Send sms with code for disabling otp
 * @param {string} email
 * @returns {Promise<any>}
 */
const sendOtpRecoverSms = async email => {
  try {
    return withSuccess(
      request.get(
        `${identityBaseUrl}/auth/recover?email=${encodeURIComponent(email)}`,
      ),
    );
  } catch (error) {
    const { response = {} } = error;
    const { status } = response;
    error.code = status;

    throw error;
  }
};

/**
 * Disable otp setting
 * @param {object} param
 * @param {string} param.email
 * @param {string} param.code
 * @returns {Promise<any>}
 */
const disableOtpViaSms = async ({ email, code }) => {
  return withSuccess(
    request.post(`${identityBaseUrl}/auth/recover`, {
      email,
      code,
    }),
  );
};

/**
 * @return {string}
 */
const getSeedTemplateUrl = () => `${identityBaseUrl}/auth/recover/template`;

export default {
  getAuthStatus,
  setAuthPermission,
  getAuthChallenge,
  authWithCode,
  authWithGoogle,
  sendEmailCode,
  logout,
  waitLogin,
  getRecoveryIdentifier,
  sendOtpRecoverSms,
  disableOtpViaSms,
  getSeedTemplateUrl,
};
