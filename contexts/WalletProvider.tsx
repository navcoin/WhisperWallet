import WebSQLite from 'react-native-quick-websql';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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

import setGlobalVars from 'indexeddbshim/dist/indexeddbshim-noninvasive';
import {Platform} from 'react-native';
import useTraceUpdates from '../hooks/useTraceUpdates';

const win = {};

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

  useEffect(() => {
    if (walletLibLoaded) {
      RNBootSplash.hide({fade: true});
      njs.wallet.WalletFile.ListWallets().then(setWalletsList);
    }
  }, [walletLibLoaded]);

  useEffect(() => {
    njs.wallet.Init().then(async () => {
      setGlobalVars(win, {checkOrigin: false, win: WebSQLite});
      win.indexedDB.__useShim();
      njs.wallet.WalletFile.SetBackend(win.indexedDB, win.IDBKeyRange);
      setWalletLibLoaded(true);
    });
  }, []);

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

      for (let tokenId in balances.nfts) {
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

      setAccounts(accs);
      setTokens(toks);
      setNfts(nft);
    }
  }, [balances, addresses]);

  const updateAccounts = useCallback(async () => {
    if (wallet) {
      setBalances(await wallet.GetBalance());
      setHistory(await wallet.GetHistory());
      setAddresses(await wallet.GetAllAddresses());
    }
    parseAccounts();
  }, []);

  useEffect(() => {
    parseAccounts();
  }, [balances, addresses]);

  const connectP2P = useCallback(() => {
    let pool = new P2pPool({
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
    });
    console.log('connecting to p2p');
    pool.on('candidate', newCandidate);
    pool.on('peerready', (_: string, server: number) => {
      let sessionId = p2pPool.startSession();
      console.log('started session', sessionId);
    });
    pool.connect();
    setP2pPool(pool);
  }, [server, network]);

  const createWallet = useCallback(
    async (
      name: string,
      mnemonic_: string,
      type: string,
      password: string,
      spendingPassword: string,
      zapwallettxes: boolean,
      log: boolean,
      network_: string,
      onLoaded: any,
    ) => {
      if (wallet) {
        wallet.Disconnect();
      }

      if (p2pPool) {
        p2pPool.disconnect();
        setP2pPool(undefined);
      }

      const walletFile = new njs.wallet.WalletFile({
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
        queueSize: Platform.OS == 'android' ? 1 : 4,
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
        njs.wallet.WalletFile.ListWallets().then(setWalletsList);
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
        setServer(serverName);
        if ((await walletFile.GetCandidates()).length < 100) {
          connectP2P();
        } else {
          setP2pPool(undefined);
        }
        setConnected(Connection_Stats_Enum.Connected);
      });

      walletFile.on('new_tx', async () => {
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
      });
    },
    [njs, wallet, win],
  );

  const createTransaction = async (
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
  };

  const sendTransaction = async (tx: any) => {
    if (!wallet) {
      throw new Error('Wallet not loaded');
    }
    let hash = await wallet.SendTransaction(tx);
    return hash;
  };

  const refreshWallet = useCallback(async () => {
    if (
      wallet &&
      !(
        connected == Connection_Stats_Enum.Connecting ||
        connected == Connection_Stats_Enum.Bootstrapping ||
        connected == Connection_Stats_Enum.Syncing
      )
    ) {
      await wallet.Sync();
      setBalances(await wallet.GetBalance());
      setHistory(await wallet.GetHistory());
      setAddresses(await wallet.GetAllAddresses());
    }
  }, [wallet, connected]);

  const removeWallet = useCallback(
    async (name: string) => {
      if (njs) {
        await njs.wallet.WalletFile.RemoveWallet(name);
        njs.wallet.WalletFile.ListWallets().then(setWalletsList);
      }
    },
    [njs],
  );

  const walletContext: WalletContextValue = useMemo(
    () => ({
      bitcore: njs?.wallet.bitcore,
      wallet: wallet,
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
      njs,
      walletLibLoaded,
    }),
    [
      win,
      njs,
      wallet,
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
      njs,
      walletLibLoaded,
      refreshWallet,
    ],
  );

  useTraceUpdates('walletprovider', {
    win,
    njs,
    wallet,
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
    njs,
    walletLibLoaded,
    refreshWallet,
    p2pPool,
  });

  return (
    <WalletContext.Provider value={walletContext}>
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
