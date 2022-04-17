import * as events from 'events';
import * as crypto from 'crypto';

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

const TxKeysInputSchema = {
  name: 'TxKeysInput',
  properties: {
    txid: 'string',
    vout: 'int',
    outputKey: 'string?',
    spendingKey: 'string?',
    script: 'string?',
  },
};

const TxKeysOutputSchema = {
  name: 'TxKeysOutput',
  properties: {
    outputKey: 'string?',
    spendingKey: 'string?',
    script: 'string?',
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
    hashVoting: 'string',
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
    spentIn: 'string',
    amount: 'int',
    label: 'string',
    type: 'int',
    spendingPk: 'string',
    stakingPk: 'string',
    votingPk: 'string',
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
    fetched: 'int',
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
    metadata: 'string',
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
    //data: 'object',
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

  constructor(filename: string, secret: string) {
    super();

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
          this.emit('db_open');
        });
      })
      .catch(e => {
        console.log(e);
        this.emit('db_load_error', e);
      });
  }

  static SetBackend(indexedDB: any, IDBKeyRange: any) {}

  Close() {
    if (this.db) this.db.close();
    if (this.dbTx) this.dbTx.close();
    this.db = undefined;
    this.dbTx = undefined;

    this.emit('db_closed');
  }

  Encrypt(plain: string, key: string) {
    const iv = crypto.randomBytes(16);
    const aes = crypto.createCipheriv(algorithm, key, iv);
    let ciphertext = aes.update(plain);
    ciphertext = Buffer.concat([iv, ciphertext, aes.final()]);
    return ciphertext.toString('base64');
  }

  static async ListWallets(): Promise<string[]> {
    return ['dada'];
  }

  static async RemoveWallet(filename: string) {
    try {
      Realm.deleteFile({
        path: filename,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async GetPoolSize(type: AddressTypes) {
    if (!this.db) return;

    const keys = this.db
      .objects('Key')
      .filtered(`type == ${type} && used == 0`);
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

    this.db.write(() => {
      key = self.db?.create(
        'EncryptedSetting',
        {
          key: 'masterKey_' + type,
          value: value,
        },
        'modified',
      );
    });

    return !!key;
  }

  async UpdateCounter(index: string, value: number) {
    if (!this.db) return;

    let key;
    let self = this;

    this.db.write(() => {
      key = self.db?.create(
        'Setting',
        {
          key: 'counter_' + index,
          value: value,
        },
        'modified',
      );
    });

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
        'modified',
      );
    });

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

    this.db.write(() => {
      setting = self.db?.create(
        'Setting',
        {
          key: key,
          value: value.toString(),
        },
        'modified',
      );
    });

    return !!setting;
  }

  async GetValue(key: string) {
    if (!this.db) return;

    let ret = this.db.objectForPrimaryKey('EncryptedSetting', key);

    if (ret) return ret.value;

    return undefined;
  }

  async GetNavAddresses() {
    if (!this.db) return [];

    return this.db.objects('Key').filtered(`type == ${AddressTypes.NAV}`);
  }

  async GetStakingAddresses() {
    if (!this.db) return [];

    return this.db.objects('StakingAddress');
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

    this.db.write(() => {
      item = self.db?.create(
        'StakingAdress',
        {
          id: address + '_' + address2,
          address: address,
          addressVoting: address2,
          hash: hash,
          hashVoting: pk2,
        },
        'modified',
      );
    });

    return !!item;
  }

  async GetStakingAddress(address: string, address2: string) {
    if (!this.db) return;

    return this.db
      .objects('StakingAddress')
      .filtered(`address == '${address}' && addressVoting == '${address2}'`);
  }

  async GetStatusForScriptHash(s: string) {
    if (!this.db) return;

    let ret = this.db.objects('Status').filtered(`scriptHash == '${s}'`)[0];

    return ret?.status;
  }

  async SetStatusForScriptHash(s: string, st: string) {
    if (!this.db) return;

    let item;
    let self = this;

    this.db.write(() => {
      item = self.db?.create(
        'Status',
        {
          scriptHash: s,
          status: st,
        },
        'modified',
      );
    });

    return !!item;
  }

  async BulkRawInsert(documents: any) {
    if (!this.dbTx) return;

    let item;
    let self = this;

    this.dbTx.write(() => {
      for (let d of documents) {
        item = self.dbTx?.create(
          'TxKeys',
          {
            ...d,
            vin: JSON.stringify(d.vin),
            vout: JSON.stringify(d.vout),
          },
          'modified',
        );
      }
    });

    return !!item;
  }

  async BulkRawInsertHistory(documents: any) {
    if (!this.db) return;

    let item;
    let self = this;

    this.db.write(() => {
      for (let d of documents) {
        item = self.db?.create('ScriptHistory', d, 'modified');
      }
    });

    return !!item;
  }

  async ZapWalletTxes() {
    if (!this.db) return;

    let types = ['Status', 'ScriptHistory', 'OutPoint', 'WalletTx', 'Name'];

    let self = this;

    for (var i in types) {
      let type = types[i];
      this.db.write(() => {
        self.db?.delete(self.db?.objects(type));
      });
    }
  }

  async GetXNavReceivingAddresses(all: boolean) {
    if (!this.db) return [];

    return this.db.objects('Key').filtered(`type == ${AddressTypes.XNAV}`);
  }

  async GetNavReceivingAddresses(all: boolean) {
    if (!this.db) return [];

    return this.db.objects('Key').filtered(`type == ${AddressTypes.NAV}`);
  }

  async GetNavAddress(address) {
    if (!this.db) return;

    let ret = this.db.objects('Key').filtered(`address == '${address}'`);

    return ret[0];
  }

  async GetPendingTxs(downloaded = 0) {
    if (!this.db) return [];

    return this.db
      .objects('ScriptHistory')
      .filtered(`fetched == ${downloaded}`);
  }

  async CleanScriptHashHistory(
    scriptHash: string,
    lowerLimit: number,
    upperLimit: number,
  ) {
    if (!this.db) return;

    let self = this;

    this.db.write(() => {
      self.db?.delete(
        self.db
          ?.objects('ScriptHistory')
          .filtered(
            `(height >= ${upperLimit} || height <= ${lowerLimit}) && scriptHash == '${scriptHash}'`,
          ),
      );
    });
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
        'modified',
      );
    });

    return !!item;
  }

  async AddLabel(address: string, name: string) {
    if (!this.db) return;

    let self = this;
    let item;

    this.db.write(() => {
      item = self.db?.create(
        'Label',
        {
          address: address,
          name: name,
        },
        'modified',
      );
    });

    return !!item;
  }

  async AddName(name: string, height: number, data = {}) {
    if (!this.db) return;

    let self = this;
    let item;

    this.db.write(() => {
      item = self.db?.create(
        'Name',
        {
          name: name,
          height: height,
          data: data,
        },
        'modified',
      );
    });

    return !!item;
  }

  async GetName(name: string) {
    if (!this.db) return;

    return this.db.objectForPrimaryKey('Name', name);
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
        'modified',
      );
    });

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

    this.db.write(() => {
      item = self.db?.create(
        'Nft',
        {
          id: id + '-' + nftid,
          metadata: metadata,
        },
        'modified',
      );
    });

    return !!item;
  }

  async GetNftInfo(id: string, nftid: string) {
    if (!this.db) return;

    return this.db.objectForPrimaryKey('Nft', id + '-' + nftid);
  }

  async GetMyNames() {
    if (!this.db) return;

    return this.db.objects('Name');
  }

  async GetMyTokens() {
    if (!this.db) return;

    return this.db.objects('Token');
  }

  async GetLabel(address: string) {
    if (!this.db) return;

    let ret = this.db.objectForPrimaryKey('Label', address);
    return ret ? ret : address;
  }

  async GetScriptHashHistory(scriptHash: string) {
    if (!this.db) return [];

    return this.db
      .objects('ScriptHistory')
      .filtered(`scriptHash == '${scriptHash}'`);
  }

  async MarkAsFetched(hash: string) {
    if (!this.db) return;

    let self = this;

    this.db.write(() => {
      self.db
        .objects('ScriptHistory')
        .filtered(`tx_hash == '${hash}'`)
        .forEach(el => {
          el.fetched = 1;
        });
    });
  }

  async GetWalletHistory() {
    if (!this.db) return [];

    let history = this.db.objects('WalletTx').map(el => {
      return {
        ...el,
        memos: JSON.parse(el.memos),
        strdzeel: JSON.parse(el.strdzeel),
        addresses_in: JSON.parse(el.addresses_in),
        addresses_out: JSON.parse(el.addresses_out),
      };
    });

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

    return ret;
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
        'modified',
      );
    });

    return !!item;
  }

  async GetUtxos(forBalance = false) {
    if (!this.db) return [];

    let ret = this.db
      .objects('OutPoint')
      .filtered(`spentIn == ''` + (forBalance ? ` || spentIn == '0:0'` : ''));

    return ret;
  }

  async GetCandidates(network: string) {
    if (!this.dbTx) return;

    return this.dbTx.objects('Candidate').filtered(`network == '${network}'`);
  }

  async GetTxs() {
    if (!this.dbTx) return;

    return this.dbTx.objects('Tx');
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

    this.db.write(() => {
      item = self.db?.create('OutPoint', {
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
      });
    });

    return !!item;
  }

  async GetUtxo(outPoint: string) {
    if (!this.db) return {};

    return this.db.objectForPrimaryKey('OutPoint', outPoint);
  }

  async SpendUtxo(outPoint: string, spentIn: string) {
    if (!this.db) return;

    let self = this;

    this.db.write(() => {
      self?.db
        ?.objects('OutPoint')
        .filtered(`id == '${outPoint}'`)
        .forEach(el => {
          el.spentIn = spentIn;
        });
    });
  }

  async SetTxHeight(hash: string, height: number, pos: number) {
    if (!this.db) return;

    let self = this;

    this.db.write(() => {
      self?.db
        ?.objects('Tx')
        .filtered(`hash == '${hash}'`)
        .forEach(el => {
          el.height = height;
          el.pos = pos;
        });
    });
  }

  async UseNavAddress(address: string) {
    if (!this.db) return;

    let self = this;

    this.db.write(() => {
      self?.db
        ?.objects('Key')
        .filtered(`address == '${address}'`)
        .forEach(el => {
          el.used = 1;
        });
    });
  }

  async UseXNavAddress(hashId: string) {
    if (!this.db) return;

    let self = this;

    this.db.write(() => {
      self?.db
        ?.objects('Key')
        .filtered(`hash == '${hashId}'`)
        .forEach(el => {
          el.used = 1;
        });
    });
  }

  async AddTx(tx) {
    if (!this.dbTx) return;

    tx.hash = tx.txid;
    delete tx.tx;
    let self = this;

    try {
      self.dbTx?.write(() => {
        self.dbTx?.create('Tx', tx);
      });
    } catch (e) {}
  }

  async AddTxKeys(tx) {
    if (!this.dbTx) return;

    tx.hash = tx.txidkeys;
    let self = this;

    try {
      self.dbTx?.write(() => {
        self.dbTx?.create('TxKeys', {
          ...tx,
          vin: JSON.stringify(tx.vin),
          vout: JSON.stringify(tx.vout),
        });
      });
    } catch (e) {}
  }

  async AddTxCandidate(candidate: any, network: string) {
    if (!this.dbTx) return;

    let self = this;

    try {
      self.dbTx?.write(() => {
        self.dbTx?.create('Candidate', {
          network: network,
          tx: candidate.tx.toString(),
          fee: candidate.fee,
          input:
            candidate.tx.inputs[0].prevTxId.toString('hex') +
            ':' +
            candidate.tx.inputs[0].outputIndex,
        });
      });
    } catch (e) {}
  }

  async RemoveTxCandidate(input: string) {
    if (!this.dbTx) return;

    let self = this;

    this.dbTx.write(() => {
      self.dbTx?.delete(self.dbTx.objectForPrimaryKey('Candidate', input));
    });
  }

  async GetTxKeys(hash: string) {
    if (!this.dbTx) return;

    let ret = this.dbTx.objectForPrimaryKey('TxKeys', hash);
    return {...ret, vin: JSON.parse(ret?.vin), vout: JSON.parse(ret?.vout)};
  }
}

export const ListWallets = Db.ListWallets;
export const RemoveWallet = Db.RemoveWallet;
export const SetBackend = Db.SetBackend;
