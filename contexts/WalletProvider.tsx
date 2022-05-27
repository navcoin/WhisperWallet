import React, {useCallback, useEffect, useRef, useMemo, useState} from 'react';
import {WalletContext, WalletContextValue} from './WalletContext';
import {
  AddressFragment,
  Balance_Types_Enum,
  BalanceFragment,
  Connection_Stats_Enum,
  Destination_Types_Enum,
} from '../constants/Type';
import RNBootSplash from 'react-native-bootsplash';
import WebView from 'react-native-webview';
import {Platform} from 'react-native';
import useTraceUpdate from '../hooks/useTraceUpdates';

export const WalletProvider = (props: any) => {
  const [server, setServer] = useState('');
  const [walletName, setWalletName] = useState('');
  const [walletsList, setWalletsList] = useState([]);
  const [myTokens, setMyTokens] = useState([]);
  const [walletLibLoaded, setWalletLibLoaded] = useState(false);
  const [network, setNetwork] = useState('livenet');
  const [mnemonic, setMnemonic] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [bootstrapProgress, setBootstrapProgress] = useState(0);
  const [firstSyncCompleted, setFirstSyncCompleted] = useState(false);
  const [balances, setBalances] = useState({
    nav: {confirmed: 0, pending: 0},
    xnav: {confirmed: 0, pending: 0},
    staked: {confirmed: 0, pending: 0},
  });
  const [addresses, setAddresses] = useState({
    spending: {public: {}, private: {}},
    staking: {},
  });
  const [parsedAddresses, setParsedAddresses] = useState<AddressFragment[]>([]);
  const [connected, setConnected] = useState<Connection_Stats_Enum>(
    Connection_Stats_Enum.Disconnected,
  );
  const [history, setHistory] = useState([]);
  const [tokens, setTokens] = useState<BalanceFragment[]>([]);
  const [nfts, setNfts] = useState<BalanceFragment[]>([]);
  const [accounts, setAccounts] = useState<BalanceFragment[]>([
    {
      name: 'Public',
      amount: 0,
      pending_amount: 0,
      spendable_amount: 0,
      type_id: Balance_Types_Enum.Nav,
      destination_id: Destination_Types_Enum.PublicWallet,
      currency: 'NAV',
    },
    {
      name: 'Private',
      amount: 0,
      pending_amount: 0,
      spendable_amount: 0,
      type_id: Balance_Types_Enum.xNav,
      destination_id: Destination_Types_Enum.PrivateWallet,
      currency: 'xNAV',
    },
    {
      name: 'Staking',
      amount: 0,
      pending_amount: 0,
      spendable_amount: 0,
      type_id: Balance_Types_Enum.Staking,
      destination_id: Destination_Types_Enum.StakingWallet,
      currency: 'NAV',
    },
  ]);

  const walletWebView = useRef();

  const InjectJavascript = useCallback(
    (code: string) => {
      let codeCatch = `
  try { 
    ${code}
  } catch(e) { 
    console.log('error' + e.toString());
  }
  true;`;
      console.log(codeCatch);
      if (walletWebView.current !== undefined) {
        walletWebView.current.injectJavaScript(codeCatch);
      } else {
        console.log('missing walletWebView ref');
      }
    },
    [walletWebView.current],
  );

  const [callbacks, setCallbacks] = useState({});

  const ExecWrapper = useCallback(
    (func: string, params?: string[], cb?: any, cb2?: any) => {
      callbacks[func] = [cb, cb2];
      setCallbacks(callbacks);
      InjectJavascript(
        `${func}(${
          params ? params.join(',') : ''
        }).then((a) => sendToRN("${func}", a))${
          cb2 !== undefined ? '' : '.catch(e => sendToRN("E-' + func + '", e))'
        };`,
      );
    },
    [callbacks, InjectJavascript],
  );

  const ExecWrapperSyncPromise = useCallback(
    (func: string, params?: string[]) => {
      const parsedFunc = func.replace(/[ \n"]/g, '');
      console.log(parsedFunc);
      return new Promise((res, rej) => {
        callbacks[parsedFunc] = [res, rej];
        setCallbacks(callbacks);
        InjectJavascript(`
try {
  let res = ${func}(${params ? params.join(',') : ''});
  sendToRN("${parsedFunc}", res);
} catch(e) {
  sendToRN("${parsedFunc}", false);
}`);
      });
    },
    [callbacks, InjectJavascript],
  );

  const ExecWrapperPromise = useCallback(
    (func: string, params?: string[]) => {
      return new Promise((res, rej) => {
        let parsedFunc = func.replace(/"/g, '');
        callbacks[parsedFunc] = [res, rej];
        setCallbacks(callbacks);
        InjectJavascript(
          `${func}(${
            params ? params.join(',') : ''
          }).then((a) => sendToRN("${parsedFunc}", a)).catch(e => sendToRN("E-${parsedFunc}", e))`,
        );
      });
    },
    [callbacks, InjectJavascript],
  );

  const ExecWrapperSync = useCallback(
    (func: string, params?: string[], cb?: any, cb2?: any) => {
      callbacks[func] = [cb, cb2];
      setCallbacks(callbacks);
      InjectJavascript(`
try {
  let res = ${func}(${params ? params.join(',') : ''});
  sendToRN("${func}", res);
} catch(e) {
  sendToRN("E-${func}", e);
}`);
    },
    [callbacks, InjectJavascript],
  );

  const IsValidMnemonic = useCallback(
    async (mnemonic: string, type: string) => {
      return type == 'navcash'
        ? await ExecWrapperSyncPromise(`electrumMnemonic.validateMnemonic`, [
            `"${mnemonic}"`,
            'electrumMnemonic.PREFIXES.standard',
          ])
        : await ExecWrapperSyncPromise(`Mnemonic.isValid`, [`"${mnemonic}"`]);
    },
    [ExecWrapperSyncPromise],
  );

  const RequestWallets = useCallback(() => {
    InjectJavascript(
      `njs.wallet.WalletFile.ListWallets().then(l => sendToRN('WalletsList', l));`,
    );
  }, [InjectJavascript]);

  const RemoveWallet = useCallback(
    (name: string) => {
      InjectJavascript(
        `njs.wallet.WalletFile.RemoveWallet("${name}").then(l => sendToRN('RemoveWallet', l));`,
      );
    },
    [InjectJavascript],
  );

  useEffect(() => {
    if (walletLibLoaded) {
      RNBootSplash.hide({fade: true});
      RequestWallets();
    }
  }, [walletLibLoaded]);

  useEffect(() => {
    if (firstSyncCompleted) {
      const updateAddress = async () => {
        let parsed: AddressFragment[] = [];
        for (let type in addresses.spending) {
          for (let address in addresses.spending[type]) {
            parsed.push({
              address: address,
              type_id:
                type == 'public'
                  ? Destination_Types_Enum.PublicWallet
                  : Destination_Types_Enum.PrivateWallet,
              used: addresses.spending[type][address].used,
            });
          }
        }
        parsed.sort((a, b) => (a.used > b.used && 1) || -1);
        for (let address in addresses.staking) {
          parsed.push({
            address: await ExecWrapperSyncPromise(`
            njs.wallet.bitcore.Address.fromAddresses(
            [
            "${address}","${parsed.filter(
              el => el.type_id == Destination_Types_Enum.PublicWallet,
            )[0]?.address}"
            ],"${network}").toString`),
            stakingAddress: address,
            type_id: Destination_Types_Enum.StakingWallet,
            used: false,
          });
        }
        return parsed;
      }

      updateAddress().then(setParsedAddresses)
    }
  }, [network, addresses, firstSyncCompleted]);

  const parseAccounts = useCallback(() => {
    if (balances?.nav) {
      let accs = [
        {
          name: 'Public',
          amount: (balances.nav.confirmed || 0) / 1e8,
          pending_amount: (balances.nav.pending || 0) / 1e8,
          spendable_amount:
            (balances.nav.confirmed + balances.nav.pending || 0) / 1e8,
          type_id: Balance_Types_Enum.Nav,
          destination_id: Destination_Types_Enum.PublicWallet,
          currency: 'NAV',
          icon: 'nav',
        },
        {
          name: 'Private',
          amount: (balances.xnav.confirmed || 0) / 1e8,
          pending_amount: (balances.xnav.pending || 0) / 1e8,
          spendable_amount: (balances.xnav.confirmed || 0) / 1e8,
          type_id: Balance_Types_Enum.xNav,
          destination_id: Destination_Types_Enum.PrivateWallet,
          currency: 'xNAV',
          icon: 'xnav',
        },
      ];

      for (let address in addresses.staking) {
        let label = addresses.staking[address].label?.name;
        if (!label) {
          label = address.substring(0, 8) + '...';
        }
        accs.push({
          name: label + ' staking',
          amount: (addresses.staking[address].staking.confirmed || 0) / 1e8,
          pending_amount:
            (addresses.staking[address].staking.pending || 0) / 1e8,
          spendable_amount:
            (addresses.staking[address].staking.confirmed +
              addresses.staking[address].staking.pending || 0) / 1e8,
          type_id: Balance_Types_Enum.Staking,
          destination_id: Destination_Types_Enum.StakingWallet,
          address: address,
          currency: 'NAV',
          icon: 'factory',
        });
      }

      let toks = [];

      for (let tokenId in balances.tokens) {
        toks.push({
          name: balances.tokens[tokenId].name,
          amount: (balances.tokens[tokenId].confirmed || 0) / 1e8,
          pending_amount: (balances.tokens[tokenId].pending || 0) / 1e8,
          spendable_amount: (balances.tokens[tokenId].confirmed || 0) / 1e8,
          type_id: Balance_Types_Enum.PrivateToken,
          destination_id: Destination_Types_Enum.PrivateWallet,
          tokenId: tokenId,
          currency: balances.tokens[tokenId].code,
          identicon: tokenId,
        });
      }

      let nft = [];
      let alreadyAdded = {};

      for (let tokenId in balances.nfts) {
        alreadyAdded[tokenId] = true;
        nft.push({
          name: balances.nfts[tokenId].name,
          amount: Object.keys(balances.nfts[tokenId].confirmed).length || 0,
          pending_amount:
            Object.keys(balances.nfts[tokenId].pending).length || 0,
          spendable_amount:
            Object.keys(balances.nfts[tokenId].confirmed).length || 0,
          type_id: Balance_Types_Enum.Nft,
          destination_id: Destination_Types_Enum.PrivateWallet,
          tokenId: tokenId,
          identicon: tokenId,
          items: {
            confirmed: balances.nfts[tokenId].confirmed,
            pending: balances.nfts[tokenId].pending,
          },
          mine: myTokens.filter(el => el.id == tokenId).length != 0,
          currency: 'NFT',
        });
      }

      for (let token of myTokens) {
        if (token.version == 1 && !alreadyAdded[token.id]) {
          nft.push({
            name: token.name,
            amount: 0,
            pending_amount: 0,
            spendable_amount: 0,
            type_id: Balance_Types_Enum.Nft,
            destination_id: Destination_Types_Enum.PrivateWallet,
            tokenId: token.id,
            identicon: token.id,
            items: {confirmed: [], pending: []},
            mine: true,
            currency: 'NFT',
          });
        }
      }

      setAccounts(accs);
      setTokens(toks);
      setNfts(nft);
    }
  }, [balances, addresses, myTokens]);

  const updateAccounts = useCallback(async () => {
    ExecWrapper('wallet.GetBalance');
    ExecWrapper('wallet.GetHistory');
    ExecWrapper('wallet.GetAllAddresses');
    parseAccounts();
  }, []);

  useEffect(() => {
    parseAccounts();
  }, [balances, addresses]);

  const [spendingPassword, setSpendingPassword] = useState('');

  const createWallet = useCallback(
    async (
      name: string,
      mnemonic_: string,
      type: string,
      password: string,
      spendingPassword_: string,
      zapwallettxes: boolean,
      log: boolean,
      network_: string,
      onLoaded_: any,
    ) => {
      callbacks['loaded'] = [
        onLoaded_,
        e => {
          throw e;
        },
      ];
      setCallbacks(callbacks);
      setSpendingPassword(spendingPassword_);
      setWalletName(name);

      InjectJavascript(`
if (wallet) {
  wallet.Disconnect();
}

wallet = new njs.wallet.WalletFile({
 file: "${name}",
 mnemonic: ${mnemonic_ ? `"${mnemonic_}"` : 'undefined'},
 type: "${type}",
 password: "${password}",
 spendingPassword: "${spendingPassword_}",
 zapwallettxes: ${zapwallettxes ? 'true' : 'false'},
 log: ${log ? 'true' : 'false'},
 network: "${network_}"
});

wallet.on('loaded', async () => {
  sendToRN('loaded', {network: wallet.network});
});

wallet.on('new_token', async () => {
  sendToRN('new_token');
});

wallet.on('sync_status', (progress) => {
  sendToRN('sync_status', {progress: progress});
});

wallet.on('disconnected', () => {
  sendToRN('disconnected');
});

wallet.on('connection_failed', () => {
  sendToRN('connection_failed');
});

wallet.on('connected', async (serverName) => {
  sendToRN('connected', {serverName: serverName});
});

wallet.on('new_tx', async () => {
  sendToRN('new_tx');
});

wallet.on('sync_started', async () => {
  sendToRN('sync_started');
});

wallet.on('bootstrap_started', async () => {
  sendToRN('bootstrap_started');
});

wallet.on('bootstrap_progress', async count => {
  sendToRN('bootstrap_progress', {count: count});
});

wallet.on('sync_finished', async () => {
  sendToRN('sync_finished');
});

wallet.on('new_staking_address', async () => {
  sendToRN('new_staking_address');
});

wallet.on('new_mnemonic', (m) => {
  sendToRN('new_mnemonic', m);
});

wallet.Load({
  bootstrap: njs.wallet.xNavBootstrap,
});
`);

      /*   const walletFile = new njs.wallet.WalletFile({
        file: name,
        mnemonic: mnemonic_,
        type: type,
        password: password,
        spendingPassword: spendingPassword,
        zapwallettxes: zapwallettxes,
        log: log,
        network: network_,
        indexedDB: win.indexedDB,
        IDBKeyRange: win.IDBKeyRange,
      });

      setFirstSyncCompleted(false);
      setConnected(Connection_Stats_Enum.Connecting);
      setWalletName(name);

      setWallet(walletFile);
      setSyncProgress(0);

      walletFile.on('new_mnemonic', (m: string) => {
        setMnemonic(m);
      });

      walletFile.on('loaded', async () => {
        console.log('loaded');
        walletFile.GetBalance().then(setBalances);
        walletFile.GetHistory().then(setHistory);
        walletFile.GetMyTokens(spendingPassword).then(setMyTokens);
        walletFile.GetMyTokens(spendingPassword).then(console.log);
        //njs.wallet.WalletFile.ListWallets().then(setWalletsList);
        walletFile.Connect();
        onLoaded();
        setNetwork(walletFile.network);
        setAddresses(await walletFile.GetAllAddresses());
      });

      walletFile.on('new_token', async () => {
        walletFile.GetMyTokens(spendingPassword).then(setMyTokens);
      });

      walletFile.on('sync_status', (progress: number) => {
        setSyncProgress(progress);
      });

      walletFile.on('disconnected', () => {
        setConnected(Connection_Stats_Enum.Disconnected);
      });

      walletFile.on('connection_failed', () => {
        setConnected(Connection_Stats_Enum.Disconnected);
      });

      walletFile.on('connected', async (serverName: string) => {
        console.log('connected to ', serverName);
        setServer(serverName);
        if ((await walletFile.GetCandidates()).length < 100) {
          connectP2P();
        } else {
          setP2pPool(undefined);
        }
        setConnected(Connection_Stats_Enum.Connected);
      });

      walletFile.on('new_tx', async () => {
        //if (!p2pPool && (await walletFile.GetCandidates()).length < 100) {
        //  connectP2P();
        //}
        setBalances(await walletFile.GetBalance());
        setHistory(await walletFile.GetHistory());
        setAddresses(await walletFile.GetAllAddresses());
      });

      walletFile.on('sync_started', async () => {
        setConnected(Connection_Stats_Enum.Syncing);
      });

      walletFile.on('bootstrap_started', async () => {
        setConnected(Connection_Stats_Enum.Bootstrapping);
      });

      walletFile.on('bootstrap_progress', async count => {
        setBootstrapProgress(count);
      });

      walletFile.on('sync_finished', async () => {
        console.log('sync_finished');
        setSyncProgress(100);
        setFirstSyncCompleted(true);
        setConnected(Connection_Stats_Enum.Synced);
        setBalances(await walletFile.GetBalance());
        setHistory(await walletFile.GetHistory());
        setAddresses(await walletFile.GetAllAddresses());
      });

      walletFile.on('new_staking_address', async () => {
        updateAccounts();
      });

      walletFile.Load({
        //bootstrap: njs.wallet.xNavBootstrap,
      });*/
    },
    [],
  );

  const CreateNft = useCallback(
    async (
      name: string,
      scheme: string,
      amount: number,
      spendingPassword: string,
    ) => {
      return new Promise((res, rej) => {
        ExecWrapper(
          'wallet.CreateNft',
          [
            JSON.stringify(name),
            JSON.stringify(scheme),
            amount.toString(10),
            JSON.stringify(spendingPassword),
          ],
          res,
          rej,
        );
      });
    },
    [ExecWrapper],
  );

  const GetCandidates = useCallback(async (): Promise<any> => {
    return new Promise((res, rej) => {
      ExecWrapper('wallet.GetCandidates', undefined, res, rej);
    });
  }, [ExecWrapper]);

  const TokenCreateTransaction = useCallback(
    async (
      to: string,
      amount: number,
      memo: string,
      password: string,
      tokenId: Buffer | string,
      tokenNftId: number,
      vData: Buffer | undefined,
      extraKey: Buffer | undefined,
      ignoreInputs: boolean,
      ignoreFee: boolean,
      fee: number,
    ) => {
      return new Promise((res, rej) => {
        ExecWrapper(
          'wallet.tokenCreateTransaction',
          [
            JSON.stringify(to),
            Math.floor(amount * 1e8).toString(10),
            JSON.stringify(memo),
            JSON.stringify(password),
            JSON.stringify(
              tokenId
                ? tokenId.toString('hex')
                : Buffer.alloc(32).toString('hex'),
            ),
            JSON.stringify(tokenNftId),
            'undefined',
            'undefined',
            ignoreInputs ? 'true' : 'false',
            ignoreFee ? 'true' : 'false',
            fee ? JSON.stringify(fee) : '0',
          ],
          res,
          rej,
        );
      });
    },
    [ExecWrapper],
  );

  const XNavCreateTransaction = useCallback(
    async (
      to: string,
      amount: number,
      memo: string,
      password: string,
      subtractFee: boolean,
      tokenId: Buffer | string,
      tokenNftId: number,
      vData: Buffer | undefined,
      extraKey: Buffer | undefined,
      extraIn: number,
      fee: number,
    ) => {
      return new Promise((res, rej) => {
        ExecWrapper(
          'wallet.xNavCreateTransaction',
          [
            JSON.stringify(to),
            Math.floor(amount * 1e8).toString(10),
            JSON.stringify(memo),
            JSON.stringify(password),
            subtractFee ? 'true' : 'false',
            JSON.stringify(
              tokenId
                ? tokenId.toString('hex')
                : Buffer.alloc(32).toString('hex'),
            ),
            JSON.stringify(tokenNftId),
            'undefined',
            'undefined',
            extraIn ? extraIn.toString(10) : '0',
            fee ? fee.toString(10) : '0',
          ],
          res,
          rej,
        );
      });
    },
    [ExecWrapper],
  );

  const NavCreateTransaction = useCallback(
    (
      dest: string,
      amount: number,
      memo: string,
      spendingPassword: string,
      subtractFee: boolean,
      fee: number,
      type: number,
      fromAddress: string,
    ) => {
      return new Promise((res, rej) => {
        ExecWrapper(
          'wallet.NavCreateTransaction',
          [
            JSON.stringify(dest),
            Math.floor(amount * 1e8).toString(10),
            JSON.stringify(memo),
            JSON.stringify(spendingPassword),
            subtractFee ? 'true' : 'false',
            fee ? fee.toString(10) : '0',
            type ? type.toString(10) : '0',
            JSON.stringify(fromAddress),
          ],
          res,
          rej,
        );
      });
    },
    [ExecWrapper],
  );

  const CombineTransactions = useCallback(
    (txs: string | string[]) => {
      return new Promise((res, rej) => {
        ExecWrapper(
          'njs.wallet.bitcore.Transaction.Blsct.CombineTransactions',
          [JSON.stringify(txs)],
          res,
          rej,
        );
      });
    },
    [ExecWrapper],
  );

  const SendTransaction = useCallback(
    (txs: string | string[]) => {
      return new Promise((res, rej) => {
        ExecWrapper('wallet.SendTransaction', [JSON.stringify(txs)], res, rej);
      });
    },
    [ExecWrapper],
  );

  const createTransaction = useCallback(
    async (
      from: string,
      to: string,
      amount: number,
      password: string,
      memo = '',
      subtractFee = false,
      fromAddress = undefined,
      tokenId = undefined,
      tokenNftId = undefined,
    ) => {
      return new Promise(async (res, rej) => {
        try {
          if (from == 'xnav' || from == 'token' || from == 'nft') {
            let candidates = (await GetCandidates())
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);

            let fee = 0;

            for (let c of candidates) {
              fee += parseInt(BigInt(c.fee.words).toString());
            }

            let obj =
              from == 'token' || from == 'nft'
                ? await TokenCreateTransaction(
                    to,
                    amount,
                    memo,
                    password,
                    tokenId,
                    tokenNftId,
                    undefined,
                    undefined,
                    false,
                    false,
                    fee,
                  )
                : await XNavCreateTransaction(
                    to,
                    amount,
                    memo,
                    password,
                    subtractFee,
                    new Buffer(new Uint8Array(32)),
                    -1,
                    undefined,
                    undefined,
                    0,
                    fee,
                  );

            if (!obj) {
              rej("Can't access you wallet keys");
            } else {
              let ret = {fee: obj.fee + fee, tx: undefined};
              let toCombine = [obj.tx[0]];
              for (let c of candidates) {
                toCombine.push(c.tx);
              }
              ret.tx = toCombine;

              if (toCombine.length > 1) {
                ret.tx = [await CombineTransactions(toCombine)];
                if (ret.tx.length == 1) {
                  ret.tx[0].version |= 0x10;
                  ret.tx[0] = ret.tx[0].toString();
                } else {
                  throw new Error('Could not create transaction');
                }
              }

              res(ret);
            }
          } else if (from == 'nav') {
            let ret = await NavCreateTransaction(
              to,
              amount,
              memo,
              password,
              subtractFee,
              100000,
              0x1,
              fromAddress,
            );
            res(ret);
          } else if (from == 'cold_staking') {
            let ret = await NavCreateTransaction(
              to,
              amount,
              memo,
              password,
              subtractFee,
              100000,
              0x2,
              fromAddress,
            );
            res(ret);
          } else {
            console.log('unknown wallet type', from);
          }
        } catch (e) {
          console.log(e.toString());
          console.log(e.stack);
          rej(e);
        }
      });
    },
    [],
  );

  const createNftCollection = useCallback(
    async (
      name: string,
      scheme: string,
      amount: number,
      spendingPassword: string,
    ) => {
      let candidates = (await GetCandidates())
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      let fee = 0;

      for (let c of candidates) {
        //fee += parseInt(BigInt(c.fee.words).toString());
      }

      let obj = await CreateNft(name, scheme, amount, spendingPassword);

      if (!obj) {
        throw new Error("Can't access you wallet keys");
      }
      let ret = {fee: obj.fee + fee, tx: undefined};
      let toCombine = [obj.tx[0]];
      for (let c of candidates) {
        //toCombine.push(c.tx);
      }
      ret.tx = toCombine;

      if (false && toCombine.length > 1) {
        ret.tx = [await CombineTransactions(toCombine)];
        if (ret.tx.length == 1) {
          ret.tx[0].version |= 0x10;
          ret.tx[0] = ret.tx[0].toString();
        } else {
          throw new Error('Could not create transaction');
        }
      }

      return ret;
    },
    [CreateNft, CombineTransactions, GetCandidates],
  );

  const sendTransaction = useCallback(async (tx: any) => {
    let hash = await SendTransaction(tx);
    return hash;
  }, []);

  const refreshWallet = useCallback(async () => {
    if (
      !(
        connected == Connection_Stats_Enum.Connecting ||
        connected == Connection_Stats_Enum.Bootstrapping ||
        connected == Connection_Stats_Enum.Syncing
      )
    ) {
      return new Promise((res, rej) =>
        ExecWrapper('wallet.Sync', undefined, res, rej),
      );
    }
  }, [connected]);

  const removeWallet = useCallback(
    async (name: string) => {
      RemoveWallet(name);
    },
    [RemoveWallet],
  );

  const closeWallet = useCallback(async () => {
    await new Promise((res, _) => {
      ExecWrapperSync('wallet.Disconnect', undefined, () => {
        ExecWrapperSync('wallet.CloseDb', undefined, () => {
          res(true);
        });
      });
    });
  }, [ExecWrapperSync]);

  const walletContext: WalletContextValue = useMemo(
    () => ({
      walletName,
      mnemonic,
      createWallet: createWallet,
      clearMnemonic: () => {
        setMnemonic('');
      },
      refreshWallet,
      syncProgress,
      balances,
      connected,
      addresses,
      walletsList,
      history,
      accounts,
      parsedAddresses,
      createTransaction: createTransaction,
      sendTransaction: sendTransaction,
      network,
      firstSyncCompleted,
      tokens,
      nfts,
      updateAccounts,
      bootstrapProgress,
      removeWallet,
      walletLibLoaded,
      createNftCollection,
      closeWallet,
      ExecWrapperPromise,
      ExecWrapperSyncPromise,
      IsValidMnemonic
    }),
    [
      walletName,
      mnemonic,
      syncProgress,
      network,
      balances,
      connected,
      addresses,
      walletsList,
      history,
      accounts,
      parsedAddresses,
      firstSyncCompleted,
      tokens,
      nfts,
      updateAccounts,
      bootstrapProgress,
      removeWallet,
      walletLibLoaded,
      refreshWallet,
      createNftCollection,
      closeWallet,
      ExecWrapperPromise,
      ExecWrapperSyncPromise,
      IsValidMnemonic
    ],
  );

  useTraceUpdate('wp', {
    walletContext,
    walletName,
    mnemonic,
    createWallet,
    refreshWallet,
    syncProgress,
    balances,
    connected,
    addresses,
    walletsList,
    history,
    accounts,
    parsedAddresses,
    createTransaction: createTransaction,
    sendTransaction: sendTransaction,
    network,
    firstSyncCompleted,
    tokens,
    nfts,
    updateAccounts,
    bootstrapProgress,
    removeWallet,
    walletLibLoaded,
    createNftCollection,
  });

  const onMessage = useCallback(
    payload => {
      let dataPayload;
      try {
        dataPayload = JSON.parse(payload.nativeEvent.data);
      } catch (e) {}
      if (dataPayload) {
        if (
          dataPayload.type.substring(0, 2) == 'E-' &&
          callbacks[dataPayload.type.substring(2)] &&
          callbacks[dataPayload.type.substring(2)][1]
        ) {
          callbacks[dataPayload.type.substring(2)][1](dataPayload.data);
          delete callbacks[dataPayload.type.substring(2)];
          setCallbacks(callbacks);
        } else if (
          callbacks[dataPayload.type] &&
          callbacks[dataPayload.type][0]
        ) {
          callbacks[dataPayload.type][0](dataPayload.data);
          delete callbacks[dataPayload.type];
          setCallbacks(callbacks);
        }
        if (dataPayload.type === 'Console') {
          console.info(
            `[navcoin-js:${dataPayload.data.type}] ${dataPayload.data.log}`,
          );
        } else if (dataPayload.type === 'WalletInit') {
          setWalletLibLoaded(true);
        } else if (dataPayload.type === 'WalletsList') {
          setWalletsList(dataPayload.data);
        } else if (dataPayload.type === 'wallet.GetBalance') {
          setBalances(dataPayload.data);
        } else if (dataPayload.type === 'wallet.GetAllAddresses') {
          setAddresses(dataPayload.data);
        } else if (dataPayload.type === 'wallet.GetHistory') {
          setHistory(dataPayload.data);
        } else if (dataPayload.type === 'wallet.GetMyTokens') {
          setMyTokens(dataPayload.data);
        } else if (dataPayload.type === 'wallet.Sync') {
          ExecWrapper('wallet.GetBalance');
          ExecWrapper('wallet.GetHistory');
          ExecWrapper('wallet.GetAllAddresses');
        } else if (dataPayload.type === 'RemoveWallet') {
          RequestWallets();
        } else if (dataPayload.type === 'loaded') {
          ExecWrapper('wallet.GetBalance');
          ExecWrapper('wallet.GetHistory');
          ExecWrapper('wallet.GetMyTokens', [`"${spendingPassword}"`]);
          ExecWrapper('wallet.Connect');
          ExecWrapper('wallet.GetAllAddresses');
          setFirstSyncCompleted(false);
          setConnected(Connection_Stats_Enum.Connecting);
          setSyncProgress(0);
          setNetwork(dataPayload.data.network);
        } else if (dataPayload.type === 'new_token') {
          ExecWrapper('wallet.GetMyTokens', [`"${spendingPassword}"`]);
        } else if (dataPayload.type === 'sync_status') {
          setSyncProgress(dataPayload.data.progress);
        } else if (dataPayload.type === 'disconnected') {
          setConnected(Connection_Stats_Enum.Disconnected);
        } else if (dataPayload.type === 'connection_failed') {
          setConnected(Connection_Stats_Enum.Disconnected);
        } else if (dataPayload.type === 'connected') {
          console.log('connected to ', dataPayload.data.serverName);
          setServer(dataPayload.data.serverName);
          setConnected(Connection_Stats_Enum.Connected);
        } else if (dataPayload.type === 'new_tx') {
          if (firstSyncCompleted) {
            ExecWrapper('wallet.GetBalance');
            ExecWrapper('wallet.GetHistory');
            ExecWrapper('wallet.GetAllAddresses');
          }
        } else if (dataPayload.type === 'sync_started') {
          setConnected(Connection_Stats_Enum.Syncing);
        } else if (dataPayload.type === 'bootstrap_started') {
          setConnected(Connection_Stats_Enum.Bootstrapping);
        } else if (dataPayload.type === 'bootstrap_progress') {
          setBootstrapProgress(dataPayload.data.count);
        } else if (dataPayload.type === 'new_mnemonic') {
          setMnemonic(dataPayload.data);
        } else if (dataPayload.type === 'sync_finished') {
          console.log('sync_finished');
          setSyncProgress(100);
          setFirstSyncCompleted(true);
          setConnected(Connection_Stats_Enum.Synced);
          ExecWrapper('wallet.GetBalance');
          ExecWrapper('wallet.GetHistory');
          ExecWrapper('wallet.GetMyTokens', [`"${spendingPassword}"`]);
          ExecWrapper('wallet.GetAllAddresses');
          setSpendingPassword('');
        } else if (dataPayload.type === 'new_staking_address') {
          updateAccounts();
        } else {
          console.log(dataPayload.type, dataPayload.data);
        }
      }
    },
    [firstSyncCompleted, updateAccounts, ExecWrapper, callbacks],
  );

  return (
    <WalletContext.Provider value={walletContext}>
      <WebView
        containerStyle={{position: 'absolute', width: 0, height: 0}} // <=== your prop
        ref={walletWebView}
        originWhitelist={['*']}
        injectedJavaScript={`
  try {
  njs.wallet.Init().then(async () => {
    sendToRN('WalletInit');
  });
  } catch(e) { console.log(e.toString()); }
`}
        onMessage={onMessage}
        onError={console.log}
        source={{
          uri:
            Platform.OS == 'ios'
              ? './www/index.html'
              : 'file:///android_asset/www/index.html',
        }}></WebView>
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
