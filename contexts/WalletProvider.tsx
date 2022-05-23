import React, {useCallback, useEffect, useRef, useMemo, useState} from 'react';
import {WalletContext, WalletContextValue} from './WalletContext';
import {
  AddressFragment,
  Balance_Types_Enum,
  BalanceFragment,
  Connection_Stats_Enum,
  Destination_Types_Enum,
} from '../constants/Type';
import Identicon from '../components/Identicon';
import RNBootSplash from 'react-native-bootsplash';
import WebView from 'react-native-webview';
import {Platform} from 'react-native';
import useTraceUpdate from '../hooks/useTraceUpdates';
const njs = require('navcoin-js');
const P2pPool = require('@aguycalled/bitcore-p2p').Pool;

export const WalletProvider = (props: any) => {
  const [p2pPool, setP2pPool] = useState<any>(undefined);
  const [wallet, setWallet] = useState<any>(undefined);
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

  const ExecWrapper = useCallback((func: string, params?: string[], cb?: any) => {
    callbacks[func] = cb;
    setCallbacks(callbacks);
    InjectJavascript(
      `wallet.${func}(${
        params ? params.join(',') : ''
      }).then((a) => sendToRN("${func}", a));`,
    );
  }, []);

  const ExecWrapperSync = useCallback((func: string, params?: string[], cb?: any) => {
    callbacks[func] = cb;
    setCallbacks(callbacks);
    InjectJavascript(
      `sendToRN("${func}", wallet.${func}(${
        params ? params.join(',') : ''
      }));`,
    );
  }, []);

  const RequestWallets = useCallback(() => {
    InjectJavascript(
      `njs.wallet.WalletFile.ListWallets().then(l => sendToRN('WalletsList', l));`,
    );
  }, [InjectJavascript]);

  const RemoveWallet = useCallback((name: string) => {
    InjectJavascript(
      `njs.wallet.WalletFile.RemoveWallet("${name}").then(l => sendToRN('RemoveWallet', l));`,
    );
  }, [InjectJavascript]);

  useEffect(() => {
    if (walletLibLoaded) {
      RNBootSplash.hide({fade: true});
      RequestWallets();
    }
  }, [walletLibLoaded]);

  useEffect(() => {
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
        address: njs.wallet.bitcore.Address.fromBuffers(
          [
            new Buffer([njs.wallet.bitcore.Networks[network].coldstaking]),
            njs.wallet.bitcore.Address(address).toBuffer().slice(1),
            njs.wallet.bitcore
              .Address(
                parsed.filter(
                  el => el.type_id == Destination_Types_Enum.PublicWallet,
                )[0]?.address,
              )
              .toBuffer()
              .slice(1),
          ],
          network,
          'coldstaking',
        ).toString(),
        stakingAddress: address,
        type_id: Destination_Types_Enum.StakingWallet,
        used: false,
      });
    }
    setParsedAddresses(parsed);
  }, [njs, network, addresses]);

  const newCandidate = useCallback(
    async function (session: string, candidate: any) {
      if (wallet && p2pPool) {
        await wallet.AddCandidate(
          candidate,
          p2pPool.network.name == 'livenet' ? 'mainnet' : 'testnet',
        );
      }
    },
    [wallet, p2pPool],
  );

  useEffect(() => {
    if (p2pPool) {
      console.log('connecting to p2p');
      p2pPool.on('candidate', newCandidate);
      p2pPool.on('peerready', (_: string, server: number) => {
        let sessionId = p2pPool.startSession();
        console.log('started session', sessionId);
      });
      p2pPool.connect();
    }
  }, [p2pPool]);

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
          leftElement: <Identicon value={tokenId} />,
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
          leftElement: <Identicon value={tokenId} />,
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
            leftElement: <Identicon value={token.id}></Identicon>,
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
    if (wallet) {
      setBalances(await wallet.GetBalance());
      setHistory(await wallet.GetHistory());
      setAddresses(await wallet.GetAllAddresses());
    }
    parseAccounts();
  }, [wallet]);

  useEffect(() => {
    parseAccounts();
  }, [balances, addresses]);

  const connectP2P = useCallback(() => {
    setP2pPool(
      new P2pPool({
        dnsSeed: false, // prevent seeding with DNS discovered known peers upon connecting
        listenAddr: false, // prevent new peers being added from addr messages
        network: network,
        maxSize: 1,
        addrs: [
          // initial peers to connect to
          {
            ip: {
              v4: server.split(':')[0],
            },
          },
        ],
      }),
    );
  }, [server, network]);

  const [onLoaded, setOnLoaded] = useState(() => () => {});
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
      if (p2pPool) {
        p2pPool.disconnect();
        setP2pPool(undefined);
      }

      setOnLoaded(onLoaded_);
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
    [njs, wallet],
  );

  const createNftCollection = useCallback(
    async (
      name: string,
      scheme: string,
      amount: number,
      spendingPassword: string,
    ) => {
      if (!wallet) {
        throw new Error('Wallet not loaded');
      }

      let candidates = (await wallet.GetCandidates())
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      let fee = 0;

      for (let c of candidates) {
        //fee += parseInt(BigInt(c.fee.words).toString());
      }

      let obj = await wallet.CreateNft(name, scheme, amount, spendingPassword);

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
        ret.tx = [
          await njs.wallet.bitcore.Transaction.Blsct.CombineTransactions(
            toCombine,
          ),
        ];
        if (ret.tx.length == 1) {
          ret.tx[0].version |= 0x10;
          ret.tx[0] = ret.tx[0].toString();
        } else {
          throw new Error('Could not create transaction');
        }
      }

      return ret;
    },
    [njs, wallet],
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
        if (!wallet) {
          rej('Wallet not loaded');
          return;
        }
        try {
          if (from == 'xnav' || from == 'token' || from == 'nft') {
            let candidates = (await wallet.GetCandidates())
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);

            let fee = 0;

            for (let c of candidates) {
              fee += parseInt(BigInt(c.fee.words).toString());
            }

            let obj =
              from == 'token' || from == 'nft'
                ? await wallet.tokenCreateTransaction(
                    to,
                    Math.floor(amount * 1e8),
                    memo,
                    password,
                    tokenId,
                    tokenNftId,
                    new Buffer([]),
                    undefined,
                    false,
                    false,
                    fee,
                  )
                : await wallet.xNavCreateTransaction(
                    to,
                    Math.floor(amount * 1e8),
                    memo,
                    password,
                    subtractFee,
                    new Buffer(new Uint8Array(32)),
                    -1,
                    new Buffer([]),
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
                ret.tx = [
                  await njs.wallet.bitcore.Transaction.Blsct.CombineTransactions(
                    toCombine,
                  ),
                ];
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
            let ret = await wallet.NavCreateTransaction(
              to,
              Math.floor(amount * 1e8),
              memo,
              password,
              subtractFee,
              100000,
              0x1,
              fromAddress,
            );
            res(ret);
          } else if (from == 'cold_staking') {
            let ret = await wallet.NavCreateTransaction(
              to,
              Math.floor(amount * 1e8),
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
          console.log(e.stack);
          rej(e);
        }
      });
    },
    [],
  );

  const sendTransaction = useCallback(
    async (tx: any) => {
      if (!wallet) {
        throw new Error('Wallet not loaded');
      }
      let hash = await wallet.SendTransaction(tx);
      return hash;
    },
    [wallet],
  );

  const refreshWallet = useCallback(async () => {
    if (
      !(
        connected == Connection_Stats_Enum.Connecting ||
        connected == Connection_Stats_Enum.Bootstrapping ||
        connected == Connection_Stats_Enum.Syncing
      )
    ) {
      ExecWrapper('Sync');
    }
  }, [wallet, connected]);

  const removeWallet = useCallback(
    async (name: string) => {
      RemoveWallet(name);
    },
    [RemoveWallet],
  );

  const closeWallet = useCallback(
    async () => {
      await new Promise((res, _) => {
        ExecWrapperSync('Disconnect', undefined, () => {
          ExecWrapperSync('CloseDb', undefined, () => {
            res(true);
          })
        })
      });
    }, [ExecWrapperSync]
  )

  const walletContext: WalletContextValue = useMemo(
    () => ({
      bitcore: njs?.wallet.bitcore,
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
      closeWallet
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
      closeWallet
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

  const debugging = `
  try {
  console.log('hallo');
  njs.wallet.Init().then(async () => {
  console.log('ready');
    sendToRN('WalletInit');
  });
  } catch(e) { console.log(e.toString()); }
`;

  const [callbacks, setCallbacks] = useState({});

  const onMessage = payload => {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {}
    if (dataPayload) {
      if (callbacks[dataPayload.type]) {
        callbacks[dataPayload.type](dataPayload.data);
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
      } else if (dataPayload.type === 'GetBalance') {
        setBalances(dataPayload.data);
      } else if (dataPayload.type === 'GetAllAddresses') {
        setAddresses(dataPayload.data);
      } else if (dataPayload.type === 'GetHistory') {
        setHistory(dataPayload.data);
      } else if (dataPayload.type === 'GetMyTokens') {
        setMyTokens(dataPayload.data);
      } else if (dataPayload.type === 'Sync') {
        ExecWrapper('GetBalance');
        ExecWrapper('GetHistory');
        ExecWrapper('GetAllAddresses');
      } else if (dataPayload.type === 'RemoveWallet') {
        RequestWallets();
      } else if (dataPayload.type === 'loaded') {
        ExecWrapper('GetBalance');
        ExecWrapper('GetHistory');
        ExecWrapper('GetMyTokens', [`"${spendingPassword}"`]);
        ExecWrapper('Connect');
        ExecWrapper('GetAllAddresses');
        if (onLoaded !== undefined) onLoaded();
        setSpendingPassword('');
        setFirstSyncCompleted(false);
        setConnected(Connection_Stats_Enum.Connecting);
        setSyncProgress(0);
        setNetwork(dataPayload.data.network);
      } else if (dataPayload.type === 'new_token') {
        ExecWrapper('GetMyTokens', [`"${spendingPassword}"`]);
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
          ExecWrapper('GetBalance');
          ExecWrapper('GetHistory');
          ExecWrapper('GetAllAddresses');
        }
      } else if (dataPayload.type === 'sync_started') {
        setConnected(Connection_Stats_Enum.Syncing);
      } else if (dataPayload.type === 'bootstrap_started') {
        setConnected(Connection_Stats_Enum.Bootstrapping);
      } else if (dataPayload.type === 'bootstrap_progress') {
        setBootstrapProgress(dataPayload.data.count);
      } else if (dataPayload.type === 'sync_finished') {
        console.log('sync_finished');
        setSyncProgress(100);
        setFirstSyncCompleted(true);
        setConnected(Connection_Stats_Enum.Synced);
        ExecWrapper('GetBalance');
        ExecWrapper('GetHistory');
        ExecWrapper('GetMyTokens', [`"${spendingPassword}"`]);
        ExecWrapper('GetAllAddresses');
      } else if (dataPayload.type === 'new_staking_address') {
        updateAccounts();
      } else {
        console.log(dataPayload.type, dataPayload.data);
      }
    }
  };

  return (
    <WalletContext.Provider value={walletContext}>
      <WebView
        containerStyle={{position: 'absolute', width: 0, height: 0}} // <=== your prop
        ref={walletWebView}
        originWhitelist={['*']}
        injectedJavaScript={debugging}
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
