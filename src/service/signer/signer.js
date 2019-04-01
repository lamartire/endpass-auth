import Web3 from 'web3';
import Bip39 from 'bip39';
import HDKey from 'ethereumjs-wallet/hdkey';
import Network from '@endpass/class/Network';
import Wallet from '@/service/signer/Wallet';
import web3 from './web3';

function setWeb3Network(net = Network.NET_ID.MAIN) {
  const netUrl = Network.NETWORK_URL_HTTP[net][0];
  const provider = new web3.providers.HttpProvider(netUrl);

  web3.setProvider(provider);
}

export default {
  async recover({ seedPhrase, recoveryIdentifier }) {
    const seed = Bip39.mnemonicToSeed(seedPhrase);
    const hdKey = HDKey.fromMasterSeed(seed);
    const hdWallet = hdKey.derivePath(ENV.hdKeyMnemonic.path);
    const wallet = hdWallet.deriveChild(0).getWallet();
    const privateKey = Web3.utils.bytesToHex(wallet.getPrivateKey());
    const web3Recover = new Web3(
      Network.NETWORK_URL_HTTP[Network.NET_ID.MAIN][0],
    );
    const { signature } = await web3Recover.eth.accounts.sign(
      recoveryIdentifier,
      privateKey,
    );
    return signature;
  },
  async recoverMessage({ account, request, net }) {
    setWeb3Network(net);

    const wallet = new Wallet(account);
    const res = await wallet.recover(request.params[0], request.params[1]);
    return res;
  },
  async getSignedRequest({ v3KeyStore, request, password, net }) {
    setWeb3Network(net);

    const wallet = new Wallet(v3KeyStore);

    switch (request.method) {
      case 'eth_sendTransaction':
        return wallet.sendSignedTransaction(request.transaction, password);

      case 'eth_signTypedData':
        // const wallet = rootGetters['accounts/wallet'];
        // const request = getters.currentRequest;
        throw new Error('Sign typed data not supported yet!');

      default:
        // eslint-disable-next-line
        const { signature } = await wallet.sign(request.params[0], password);
        return signature;
    }
  },
};
