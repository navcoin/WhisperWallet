import * as events from 'events';
import * as crypto from 'crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite, {encodeName} from 'react-native-sqlcipher-2';

import Realm from 'realm';

export enum AddressTypes {
  NAV = 1,
  XNAV = 2,
}

const KeySchema = {
  name: 'Key',
  primaryKey: 'hash',
  properties: {
    hash: 'string',
    value: 'string',
    type: 'int',
    address: 'string',
    used: 'int',
    change: 'int',
    path: 'string',
  },
};

const EncryptedSettingSchema = {
  name: 'EncryptedSetting',
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: 'string',
  },
};

const SettingSchema = {
  name: 'Setting',
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: 'string',
  },
};

const TxKeysSchema = {
  name: 'TxKeys',
  primaryKey: 'hash',
  properties: {
    vin: 'string',
    vout: 'string',
    hash: 'string',
  },
};

const StakingAddressSchema = {
  name: 'StakingAddress',
  primaryKey: 'id',
  properties: {
    id: 'string',
    address: 'string',
    addressVoting: 'string',
    hash: 'string',
    hashVoting: 'string?',
  },
};

const LabelSchema = {
  name: 'Label',
  primaryKey: 'address',
  properties: {
    address: 'string',
    name: 'string',
  },
};

const CandidateSchema = {
  name: 'Candidate',
  primaryKey: 'input',
  properties: {
    network: 'string',
    tx: 'string',
    input: 'string',
    fee: 'int',
  },
};

const OutPointSchema = {
  name: 'OutPoint',
  primaryKey: 'id',
  properties: {
    id: 'string',
    out: 'string',
    spentIn: 'string?',
    amount: 'int',
    label: 'string?',
    type: 'int',
    spendingPk: 'string',
    stakingPk: 'string?',
    votingPk: 'string?',
    hashId: 'string',
  },
};

const ScriptHistorySchema = {
  name: 'ScriptHistory',
  primaryKey: 'id',
  properties: {
    id: 'string',
    scriptHash: 'string',
    tx_hash: 'string',
    height: 'int',
    fetched: 'int?',
  },
};

const TxSchema = {
  name: 'Tx',
  primaryKey: 'hash',
  properties: {
    hash: 'string',
    txid: 'string',
    hex: 'string',
    height: 'int',
    pos: 'int',
  },
};

const StatusSchema = {
  name: 'Status',
  primaryKey: 'scriptHash',
  properties: {
    scriptHash: 'string',
    status: 'string',
  },
};

const TokenSchema = {
  name: 'Token',
  primaryKey: 'id',
  properties: {
    id: 'string',
    metadata: 'string?',
  },
};

const NftSchema = {
  name: 'Nft',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    code: 'string',
    supply: 'int',
    version: 'int',
    key: 'string',
  },
};

const NameSchema = {
  name: 'Name',
  primaryKey: 'name',
  properties: {
    name: 'string',
    height: 'int',
    data: 'string',
  },
};

const WalletTxSchema = {
  name: 'WalletTx',
  primaryKey: 'id',
  properties: {
    id: 'string',
    hash: 'string',
    amount: 'int',
    type: 'string',
    confirmed: 'int',
    height: 'int',
    pos: 'int',
    timestamp: 'int',
    memos: 'string?',
    strdzeel: 'string?',
    addresses_in: 'string?',
    addresses_out: 'string?',
    token_name: 'string?',
    token_code: 'string?',
    token_id: 'string?',
    nft_id: 'string?',
  },
};

const algorithm = 'aes-256-cbc';

/*
      this.db.version(5).stores({
        walletTxs: '&id, hash, amount, type, confirmed, height, pos, timestamp',

      });
 */

export default class Db extends events.EventEmitter {
  db?: Realm;
  dbTx?: Realm;
  open: boolean;

  constructor() {
    super();
    this.open = false;
  }

  async Open(filename: string, secret: string) {
    let key = new Buffer(
      crypto
        .createHash('sha512')
        .update(String(secret))
        .digest('hex')
        .substring(0, 128),
      'hex',
    );

    this.db = undefined;
    let self = this;

    if (!Realm.exists({path: filename})) {
      AsyncStorage.getItem('walletList').then(value => {
        let prevList = [];
        if (value !== null) {
          try {
            prevList = JSON.parse(value);
          } catch (e) {
            prevList = [];
          }
        }
        prevList.push({
          name: filename,
          creation: Math.floor(new Date().getTime() / 1000),
        });
        AsyncStorage.setItem('walletList', JSON.stringify(prevList));
      });
    }

    await new Promise((res, rej) => {
      Realm.open({
        path: filename,
        schema: [
          KeySchema,
          EncryptedSettingSchema,
          SettingSchema,
          StakingAddressSchema,
          OutPointSchema,
          ScriptHistorySchema,
          StatusSchema,
          TokenSchema,
          NftSchema,
          NameSchema,
          WalletTxSchema,
          LabelSchema,
        ],
        encryptionKey: key,
      })
        .progress(console.log)
        .then(db => {
          self.db = db;
          Realm.open({
            path: 'txDb',
            schema: [TxKeysSchema, TxSchema, CandidateSchema],
          }).then(dbTx => {
            self.dbTx = dbTx;
            res(true);
            this.open = true;
            this.emit('db_open');
          });
        })
        .catch(e => {
          console.log(e);
          rej(e);
          this.emit('db_load_error', e);
        });
    })

  }

  static SetBackend(indexedDB: any, IDBKeyRange: any) {}

  Close() {
    if (this.db) this.db.close();
    if (this.dbTx) this.dbTx.close();
    this.db = undefined;
    this.dbTx = undefined;
    this.open = false;

    this.emit('db_closed');
  }

  Encrypt(plain: string, key: string) {
    const iv = crypto.randomBytes(16);
    const aes = crypto.createCipheriv(algorithm, key, iv);
    let ciphertext = aes.update(plain);
    ciphertext = Buffer.concat([iv, ciphertext, aes.final()]);
    return ciphertext.toString('base64');
  }

  static async ListWallets() {
    try {
      let value = JSON.parse(
        (await AsyncStorage.getItem('walletList')) || '[]',
      );
      return value.map(el => el.name);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async RemoveWallet(filename: string) {
    try {
      Realm.deleteFile({
        path: filename,
      });
      let value = await AsyncStorage.getItem('walletList');
      let prevList = [];
      if (value !== null) {
        try {
          prevList = JSON.parse(value);
        } catch (e) {}
      }
      await AsyncStorage.setItem(
        'walletList',
        JSON.stringify(prevList.filter(el => el.name != filename)),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async GetPoolSize(type: AddressTypes, change?: number) {
    if (!this.db) return;

    const keys = this.db
      .objects('Key')
      .filtered(
        change
          ? `type == ${type} && used == 0 && change == ${change}`
          : `type == ${type} && used == 0`,
      );
    return keys.length;
  }

  async GetMasterKey(key, password) {
    if (!this.db) return;

    let dbFind = this.db.objectForPrimaryKey(
      'EncryptedSetting',
      'masterKey_' + key,
    );

    if (!dbFind) return undefined;

    password = this.HashPassword(password);

    let ret = dbFind.value;

    try {
      const ciphertextBytes = Buffer.from(ret, 'base64');
      const iv = ciphertextBytes.slice(0, 16);
      const data = ciphertextBytes.slice(16);
      const aes = crypto.createDecipheriv(algorithm, password, iv);
      let plaintextBytes = Buffer.from(aes.update(data));
      plaintextBytes = Buffer.concat([plaintextBytes, aes.final()]);
      ret = plaintextBytes.toString();
    } catch (e) {
      return undefined;
    }

    return ret;
  }

  async AddMasterKey(type: string, value: string, password: string) {
    if (!this.db) return;

    password = this.HashPassword(password);
    value = this.Encrypt(value, password);

    let key;
    let self = this;

    try {
      this.db.write(() => {
        key = self.db?.create(
          'EncryptedSetting',
          {
            key: 'masterKey_' + type,
            value: value,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!key;
  }

  async UpdateCounter(index: string, value: number) {
    if (!this.db) return;

    let key;
    let self = this;

    try {
      this.db.write(() => {
        key = self.db?.create(
          'Setting',
          {
            key: 'counter_' + index,
            value: value.toString(),
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!key;
  }

  async GetCounter(index: string) {
    if (!this.db) return;

    let ret = this.db.objectForPrimaryKey('Setting', 'counter_' + index);

    if (ret) return parseInt(ret.value);

    return undefined;
  }

  HashPassword(password) {
    password = password || 'masterkey navcoinjs';
    password = crypto
      .createHash('sha256')
      .update(String(password))
      .digest('base64')
      .substr(0, 32);
    return password;
  }

  async AddKey(
    hashId: string,
    value: string,
    type: number,
    address: string,
    used: number,
    change: number,
    path: string,
    password: string,
  ) {
    if (!this.db) return;

    if (type != AddressTypes.XNAV) {
      password = this.HashPassword(password);
      value = this.Encrypt(value, password);
    }

    let key;
    let self = this;

    try {
      this.db.write(() => {
        key = self.db?.create(
          'Key',
          {
            hash: hashId,
            value: value.toString(),
            type: type,
            address: address,
            used: 0,
            change: change ? 1 : 0,
            path: path,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!key;
  }

  async GetKey(key: string, password: string) {
    if (!this.db) return;

    let dbFind = this.db.objectForPrimaryKey('EncryptedSetting', key);

    if (!dbFind) return undefined;

    password = this.HashPassword(password);

    let ret = dbFind.value;

    if (dbFind.type != AddressTypes.XNAV) {
      try {
        const ciphertextBytes = Buffer.from(ret, 'base64');
        const iv = ciphertextBytes.slice(0, 16);
        const data = ciphertextBytes.slice(16);
        const aes = crypto.createDecipheriv(algorithm, password, iv);
        let plaintextBytes = Buffer.from(aes.update(data));
        plaintextBytes = Buffer.concat([plaintextBytes, aes.final()]);
        ret = plaintextBytes.toString();
      } catch (e) {
        return ret;
      }
    }

    if (ret?.substring(0, 1) == '[') {
      return JSON.parse(ret);
    }

    return ret;
  }

  async SetValue(key: string, value: string) {
    if (!this.db) return;

    let setting;
    let self = this;

    try {
      this.db.write(() => {
        setting = self.db?.create(
          'Setting',
          {
            key: key,
            value: value.toString(),
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!setting;
  }

  async GetValue(key: string) {
    if (!this.db) return;

    let ret = this.db.objectForPrimaryKey('Setting', key);

    if (ret) return ret.value;

    return undefined;
  }

  async GetNavAddresses() {
    if (!this.db) return [];

    let ret = this.db.objects('Key').filtered(`type == ${AddressTypes.NAV}`);

    return Object.keys(ret).map(key => ret[key]);
  }

  async GetStakingAddresses() {
    if (!this.db) return [];

    let ret = this.db.objects('StakingAddress');
    return Object.keys(ret).map(key => ret[key]);
  }

  async AddStakingAddress(
    address: string,
    address2: string,
    hash: string,
    pk2: string,
  ) {
    if (!this.db) return;

    let item;
    let self = this;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'StakingAddress',
          {
            id: address + '_' + address2,
            address: address,
            addressVoting: address2,
            hash: hash,
            hashVoting: pk2,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async GetStakingAddress(address: string, address2: string) {
    if (!this.db) return;

    let ret = this.db
      .objects('StakingAddress')
      .filtered(`address == '${address}' && addressVoting == '${address2}'`);

    return Object.keys(ret).map(key => ret[key])[0];
  }

  async GetStatusForScriptHash(s: string) {
    if (!this.db) return;

    let ret = this.db.objects('Status').filtered(`scriptHash == '${s}'`);

    return Object.keys(ret).map(key => ret[key])[0]?.status;
  }

  async SetStatusForScriptHash(s: string, st: string) {
    if (!this.db) return;

    let item;
    let self = this;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'Status',
          {
            scriptHash: s,
            status: st,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async BulkRawInsert(documents: any) {
    if (!this.dbTx) return;

    let item;
    let self = this;

    documents = documents.map(el => {
      return {
        hash: el.hash ? el.hash : el.txidkeys,
        vin: JSON.stringify(el.vin),
        vout: JSON.stringify(el.vout),
      };
    });

    try {
      this.dbTx.write(() => {
        for (let d of documents) {
          item = self.dbTx?.create('TxKeys', d);
        }
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async BulkRawInsertHistory(documents: any) {
    if (!this.db) return;

    let item;
    let self = this;

    this.db.write(() => {
      for (let d of documents) {
        try {
          item = self.db?.create('ScriptHistory', d, 'all');
        } catch (e) {
          console.log(e);
        }
      }
    });

    return !!item;
  }

  async ZapWalletTxes() {
    if (!this.db) return;

    let types = ['Status', 'ScriptHistory', 'OutPoint', 'WalletTx', 'Name'];

    let self = this;

    try {
      for (var i in types) {
        let type = types[i];
        this.db.write(() => {
          self.db?.delete(self.db?.objects(type));
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async GetXNavReceivingAddresses(all: boolean) {
    if (!this.db) return [];

    let ret = this.db.objects('Key').filtered(`type == ${AddressTypes.XNAV}`);
    return Object.keys(ret).map(key => ret[key]);
  }

  async GetNavReceivingAddresses(all: boolean) {
    if (!this.db) return [];

    let ret = this.db.objects('Key').filtered(`type == ${AddressTypes.NAV}`);
    return Object.keys(ret).map(key => ret[key]);
  }

  async GetNavAddress(address) {
    if (!this.db) return;

    let ret = this.db.objects('Key').filtered(`address == '${address}'`);
    ret = Object.keys(ret).map(key => ret[key]);

    return ret[0];
  }

  async GetPendingTxs(downloaded = 0) {
    if (!this.db) return [];

    let ret = this.db
      .objects('ScriptHistory')
      .filtered(`fetched == ${downloaded}`);

    return Object.keys(ret).map(key => ret[key]);
  }

  async CleanScriptHashHistory(
    scriptHash: string,
    lowerLimit: number,
    upperLimit: number,
  ) {
    if (!this.db) return;

    let self = this;

    try {
      this.db.write(() => {
        self.db?.delete(
          self.db
            ?.objects('ScriptHistory')
            .filtered(
              `(height >= ${upperLimit} || height <= ${lowerLimit}) && scriptHash == '${scriptHash}'`,
            ),
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  async AddScriptHashHistory(
    scriptHash: string,
    hash: string,
    height: number,
    fetched: number | boolean,
  ) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'ScriptHistory',
          {
            id: scriptHash + '_' + hash,
            scriptHash: scriptHash,
            tx_hash: hash,
            height: height,
            fetched: fetched ? 1 : 0,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async AddLabel(address: string, name: string) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'Label',
          {
            address: address,
            name: name,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async AddName(name: string, height: number, data = {}) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'Name',
          {
            name: name,
            height: height,
            data: data ? JSON.stringify(data) : '',
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async GetName(name: string) {
    if (!this.db) return;

    let ret = this.db.objectForPrimaryKey('Name', name);

    if (!ret) return;

    return {
      ...ret,
      data: ret?.data ? JSON.parse(ret?.data) : {},
    };
  }

  async AddTokenInfo(
    id: string,
    name: string,
    code: string,
    supply: number,
    version: number,
    key: string,
  ) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'Token',
          {
            id: id,
            name: name,
            code: code,
            supply: supply,
            version: version,
            key: key,
          },
          'all',
        );
      });
    } catch (e) {
      console.log('AddTokenInfo', e);
    }

    return !!item;
  }

  async GetTokenInfo(id: string) {
    if (!this.db) return;

    return this.db.objectForPrimaryKey('Token', id);
  }

  async AddNftInfo(id: string, nftid: string, metadata: string) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'Nft',
          {
            id: id + '-' + nftid,
            metadata: metadata,
          },
          'all',
        );
      });
    } catch (e) {
      console.log('AddTokenInfo', e);
    }

    return !!item;
  }

  async GetNftInfo(id: string, nftid: string) {
    if (!this.db) return;

    return this.db.objectForPrimaryKey('Nft', id + '-' + nftid);
  }

  async GetMyNames() {
    if (!this.db) return;

    let ret = this.db.objects('Name');
    return Object.keys(ret).map(key => ret[key]);
  }

  async GetMyTokens() {
    if (!this.db) return;

    let ret = this.db.objects('Token');
    return Object.keys(ret).map(key => ret[key]);
  }

  async GetLabel(address: string) {
    if (!this.db) return;

    let ret = this.db.objectForPrimaryKey('Label', address);
    return ret ? ret.toJSON() : address;
  }

  async GetScriptHashHistory(scriptHash: string) {
    if (!this.db) return [];

    let ret = this.db
      .objects('ScriptHistory')
      .filtered(`scriptHash == '${scriptHash}'`);
    return Object.keys(ret).map(key => ret[key]);
  }

  async MarkAsFetched(hash: string) {
    if (!this.db) return;

    let self = this;

    try {
      let objs = self.db.objects('ScriptHistory');
      objs = objs.filtered(`tx_hash == '${hash}'`);
      let array = [];
      for (let i = 0; i < objs.length; i++) {
        array.push(objs[i]);
      }
      this.db.write(() => {
        for (let el of array) {
          el.fetched = 1;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async GetWalletHistory() {
    if (!this.db) return [];

    let history = this.db.objects('WalletTx');

    let confirmed = history.filtered('height > 0');
    let unconfirmed = history.filtered('confirmed == 0 || height <= 0');

    let ret = unconfirmed.concat(confirmed.sorted('height', true));

    ret.sort((a, b) => {
      if (a.height == b.height) {
        if (a.pos == b.pos) return a.amount > 0 && b.amount < 0 ? -1 : 1;
        else return a.pos - b.pos;
      }
      return b.height - a.height;
    });

    if (ret.length == 0) return [];

    ret = ret.map(el => {
      return {
        ...el,
        memos: el?.memos ? JSON.parse(el?.memos) : [],
        strdzeel: el?.strdzeel ? JSON.parse(el?.strdzeel) : {},
        addresses_in: el?.addresses_in ? JSON.parse(el?.addresses_in) : {},
        addresses_out: el?.addresses_out ? JSON.parse(el?.addresses_out) : {},
      };
    });

    return Object.keys(ret).map(key => ret[key]);
  }

  async AddWalletTx(
    hash: string,
    type: number,
    amount: number,
    confirmed: number,
    height: number,
    pos: number,
    timestamp: number,
    memos: any,
    strdzeel: any,
    addresses_in: any,
    addresses_out: any,
    name: string | null,
    code: string | null,
    tokenId: string | null,
    tokenNftId: number | null,
  ) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'WalletTx',
          {
            id: hash + '_' + type,
            hash: hash,
            amount: amount,
            type: type,
            confirmed: confirmed ? 1 : 0,
            height: height,
            pos: pos,
            timestamp: timestamp,
            memos: JSON.stringify(memos),
            strdzeel: JSON.stringify(strdzeel),
            addresses_in: JSON.stringify(addresses_in),
            addresses_out: JSON.stringify(addresses_out),
            token_name: name,
            token_code: code,
            token_id: tokenId,
            nft_id: tokenNftId,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async GetUtxos(forBalance = false) {
    if (!this.db) return [];

    let ret = this.db
      .objects('OutPoint')
      .filtered(`spentIn == ''` + (forBalance ? ` || spentIn == '0:0'` : ''));

    return Object.keys(ret).map(key => ret[key]);
  }

  async GetCandidates(network: string) {
    if (!this.dbTx) return;

    let ret = this.dbTx
      .objects('Candidate')
      .filtered(`network == '${network}'`);
    return Object.keys(ret).map(key => ret[key]);
  }

  async GetTxs() {
    if (!this.dbTx) return;

    let ret = this.dbTx.objects('Tx');
    return Object.keys(ret).map(key => ret[key]);
  }

  async GetTx(hash) {
    if (!this.dbTx) return;

    return this.dbTx?.objectForPrimaryKey('Tx', hash);
  }

  async AddUtxo(
    outPoint: string,
    out: string,
    spentIn: string,
    amount: number,
    label: string,
    type: number,
    spendingPk = '',
    stakingPk = '',
    votingPk = '',
    hashId = '',
  ) {
    if (!this.db) return;

    let self = this;
    let item;

    try {
      this.db.write(() => {
        item = self.db?.create(
          'OutPoint',
          {
            id: outPoint,
            out: out,
            spentIn: spentIn,
            amount: amount,
            label: label,
            type: type,
            spendingPk: spendingPk,
            stakingPk: stakingPk,
            votingPk: votingPk,
            hashId: hashId,
          },
          'all',
        );
      });
    } catch (e) {
      console.log(e);
    }

    return !!item;
  }

  async GetUtxo(outPoint: string) {
    if (!this.db) return {};

    return this.db.objectForPrimaryKey('OutPoint', outPoint);
  }

  async SpendUtxo(outPoint: string, spentIn: string) {
    if (!this.db) return;

    let self = this;

    try {
      this.db.write(() => {
        self?.db
          ?.objects('OutPoint')
          .filtered(`id == '${outPoint}'`)
          .forEach(el => {
            el.spentIn = spentIn;
          });
      });
    } catch (e) {
      console.log(e);
    }
  }

  async SetTxHeight(hash: string, height: number, pos: number) {
    if (!this.db) return;

    let self = this;

    try {
      this.db.write(() => {
        let el = self?.db?.objectForPrimaryKey('Tx', hash);

        el.height = height;
        el.pos = pos;
      });
    } catch (e) {
      console.log(e);
    }
  }

  async UseNavAddress(address: string) {
    if (!this.db) return;

    let self = this;

    try {
      this.db.write(() => {
        self?.db
          ?.objects('Key')
          .filtered(`address == '${address}'`)
          .forEach(el => {
            el.used = 1;
          });
      });
    } catch (e) {
      console.log(e);
    }
  }

  async UseXNavAddress(hashId: string) {
    if (!this.db) return;

    let self = this;

    try {
      this.db.write(() => {
        let el = self?.db?.objectForPrimaryKey('Key', hashId);

        el.used = 1;
      });
    } catch (e) {
      console.log(e);
    }
  }

  async AddTx(tx) {
    if (!this.dbTx) return;

    tx.hash = tx.txid;
    delete tx.tx;
    let self = this;

    try {
      self.dbTx?.write(() => {
        self.dbTx?.create('Tx', tx, 'all');
      });
    } catch (e) {
      console.log(e);
    }
  }

  async AddTxKeys(tx) {
    if (!this.dbTx) return;

    if (!tx.hash) tx.hash = tx.txidkeys;
    let self = this;

    try {
      let ret = this.dbTx.objectForPrimaryKey('TxKeys', tx.hash);

      if (!ret) {
        self.dbTx?.write(() => {
          self.dbTx?.create('TxKeys', {
            ...tx,
            vin: JSON.stringify(tx.vin),
            vout: JSON.stringify(tx.vout),
          });
        });
      }
    } catch (e) {}
  }

  async AddTxCandidate(candidate: any, network: string) {
    if (!this.dbTx) return;

    let self = this;

    try {
      let ret = this.dbTx.objectForPrimaryKey(
        'Candidate',
        candidate.tx.inputs[0].prevTxId.toString('hex') +
          ':' +
          candidate.tx.inputs[0].outputIndex,
      );

      if (!ret) {
        self.dbTx?.write(() => {
          self.dbTx?.create(
            'Candidate',
            {
              network: network,
              tx: candidate.tx.toString(),
              fee: candidate.fee,
              input:
                candidate.tx.inputs[0].prevTxId.toString('hex') +
                ':' +
                candidate.tx.inputs[0].outputIndex,
            },
            'all',
          );
        });
      }
    } catch (e) {}
  }

  async RemoveTxCandidate(input: string) {
    if (!this.dbTx) return;

    let self = this;

    try {
      this.dbTx.write(() => {
        self.dbTx?.delete(self.dbTx.objectForPrimaryKey('Candidate', input));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async GetTxKeys(hash: string) {
    if (!this.dbTx) return;

    let ret = this.dbTx.objectForPrimaryKey('TxKeys', hash);

    if (!ret) return;

    return {
      ...ret,
      vin: ret?.vin ? JSON.parse(ret?.vin) : [],
      vout: ret?.vout ? JSON.parse(ret?.vout) : [],
    };
  }
}

export const ListWallets = Db.ListWallets;
export const RemoveWallet = Db.RemoveWallet;
export const SetBackend = Db.SetBackend;
