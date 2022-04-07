import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useNjs from '../hooks/useNjs';
import useWin from '../hooks/useWin';
import {WalletContext, WalletContextValue} from './WalletContext';
import {
  AddressFragment,
  Balance_Types_Enum,
  BalanceFragment,
  Connection_Stats_Enum,
  Destination_Types_Enum,
} from '../constants/Type';
import useTraceUpdate from '../hooks/useTraceUpdates';

export const WalletProvider = (props: any) => {
  const {njs, p2pPool} = useNjs();
  const {win} = useWin();
  const [wallet, setWallet] = useState<any>(undefined);
  const [walletName, setWalletName] = useState('');
  const [walletsList, setWalletsList] = useState([]);
  const [network, setNetwork] = useState('livenet');
  const [mnemonic, setMnemonic] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncing, setSyncing] = useState(false);
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
  const [accounts, setAccounts] = useState<BalanceFragment[]>([
    {
      name: 'Public',
      amount: 0,
      pending_amount: 0,
      type_id: Balance_Types_Enum.Nav,
      destination_id: Destination_Types_Enum.PublicWallet,
      currency: 'NAV',
    },
    {
      name: 'Private',
      amount: 0,
      pending_amount: 0,
      type_id: Balance_Types_Enum.xNav,
      destination_id: Destination_Types_Enum.PrivateWallet,
      currency: 'xNAV',
    },
    {
      name: 'Staking',
      amount: 0,
      pending_amount: 0,
      type_id: Balance_Types_Enum.Staking,
      destination_id: Destination_Types_Enum.StakingWallet,
      currency: 'NAV',
    },
  ]);

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

  useEffect(() => {
    if (njs && win) {
      njs.wallet.WalletFile.ListWallets().then(setWalletsList);
    }
  }, [njs, win]);

  const newCandidate = useCallback(
    function (session: string, candidate: any) {
      if (wallet && p2pPool) {
        wallet.AddCandidate(
          candidate,
          p2pPool.network.name == 'livenet' ? 'mainnet' : 'testnet',
        );
        //wallet.GetCandidates().then((l: any) => console.log(l.length));
      }
    },
    [wallet, p2pPool],
  );

  useEffect(() => {
    if (p2pPool && wallet) {
      p2pPool.on('candidate', newCandidate);

      p2pPool.connect().then(() => {
        let sessionId = p2pPool.startSession();
        console.log('started session', sessionId);
      });
    }
  }, [p2pPool, wallet]);

  useEffect(() => {
    if (balances?.nav) {
      setAccounts([
        {
          name: 'Public',
          amount: balances.nav.confirmed / 1e8,
          pending_amount: balances.nav.pending / 1e8,
          type_id: Balance_Types_Enum.Nav,
          destination_id: Destination_Types_Enum.PublicWallet,
          currency: 'NAV',
        },
        {
          name: 'Private',
          amount: balances.xnav.confirmed / 1e8,
          pending_amount: balances.xnav.pending / 1e8,
          type_id: Balance_Types_Enum.xNav,
          destination_id: Destination_Types_Enum.PrivateWallet,
          currency: 'xNAV',
        },
        {
          name: 'Staking',
          amount: balances.staked.confirmed / 1e8,
          pending_amount: balances.staked.pending / 1e8,
          type_id: Balance_Types_Enum.Staking,
          destination_id: Destination_Types_Enum.StakingWallet,
          currency: 'NAV',
        },
      ]);
    }
  }, [balances]);

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

      console.log('walletfile', name, password, spendingPassword);

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
        njs.wallet.WalletFile.ListWallets().then(setWalletsList);
        walletFile.Connect();
        onLoaded();
        setNetwork(walletFile.network);
        setAddresses(await walletFile.GetAllAddresses());
      });

      walletFile.on('sync_status', (progress: number) => {
        setSyncProgress(progress);
        if (progress == 100) {
          setSyncing(false);
        } else {
          setSyncing(true);
        }
      });

      walletFile.on('disconnected', () => {
        setConnected(Connection_Stats_Enum.Disconnected);
      });

      walletFile.on('connection_failed', () => {
        setConnected(Connection_Stats_Enum.Disconnected);
      });

      walletFile.on('connected', () => {
        setConnected(Connection_Stats_Enum.Connected);
      });

      walletFile.on('new_tx', async () => {
        console.log('new_tx');
        setBalances(await walletFile.GetBalance());
        setHistory(await walletFile.GetHistory());
        setAddresses(await walletFile.GetAllAddresses());
      });

      walletFile.on('sync_started', async () => {
        setConnected(Connection_Stats_Enum.Syncing);
      });

      walletFile.on('sync_finished', async () => {
        console.log('sync_finished');
        setFirstSyncCompleted(true);
        setConnected(Connection_Stats_Enum.Connected);
        setBalances(await walletFile.GetBalance());
        setHistory(await walletFile.GetHistory());
        setAddresses(await walletFile.GetAllAddresses());
      });

      walletFile.Load({
        bootstrap: njs.wallet.xNavBootstrap,
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
  ) => {
    return new Promise(async (res, rej) => {
      if (!wallet) {
        rej('Wallet not loaded');
        return;
      }
      try {
        if (from == 'xnav') {
          let candidates = (await wallet.GetCandidates())
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

          let fee = 0;

          for (let c of candidates) {
            console.log(
              'candidate fee',
              parseInt(BigInt(c.fee.words).toString()),
            );
            fee += parseInt(BigInt(c.fee.words).toString());
          }

          console.log('using', fee);

          let obj = await wallet.xNavCreateTransaction(
            to,
            amount * 1e8,
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
        } else {
          let ret = await wallet.NavCreateTransaction(
            to,
            amount * 1e8,
            memo,
            password,
            subtractFee,
            100000,
            from == 'staking' ? 0x2 : 0x1,
          );
          console.log(ret);
          res(ret);
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
    if (wallet) {
      await wallet.Sync();
    }
  }, [wallet]);

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
      syncing,
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
    }),
    [
      win,
      njs,
      wallet,
      walletName,
      mnemonic,
      syncProgress,
      network,
      syncing,
      balances,
      connected,
      addresses,
      walletsList,
      history,
      accounts,
      parsedAddresses,
      firstSyncCompleted,
    ],
  );

  return (
    <WalletContext.Provider value={walletContext}>
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
