/**
 * @packageDocumentation
 * @module Utils-Serialization
 */
import BN from 'bn.js';
import { Buffer } from 'buffer/';
import BinTools from './bintools';
import {
  NodeIDStringToBuffer, privateKeyStringToBuffer, bufferToNodeIDString, bufferToPrivateKeyString,
} from './helperfunctions';

export const SERIALIZATIONVERSION = 0;

export type SerializedType =
  'hex'
  | 'BN'
  | 'Buffer'
  | 'bech32'
  | 'nodeID'
  | 'privateKey'
  | 'cb58'
  | 'base58'
  | 'base64'
  | 'decimalString'
  | 'number'
  | 'utf8';
export type SerializedEncoding =
  'hex'
  | 'cb58'
  | 'base58'
  | 'base64'
  | 'decimalString'
  | 'number'
  | 'utf8'
  | 'display';
export abstract class Serializable {
  protected _typeName:string;

  protected _typeID:number;

  protected _codecID: number;

  /**
     * Used in serialization. TypeName is a string name for the type of object being output.
     */
  getTypeName():string {
    return this._typeName;
  }

  /**
     * Used in serialization. Optional. TypeID is a number for the typeID of object being output.
     */
  getTypeID():number {
    return this._typeID;
  }

  /**
     * Used in serialization. Optional. TypeID is a number for the typeID of object being output.
     */
  getCodecID(): number {
    return this._codecID;
  }

  // sometimes the parent class manages the fields
  // these are so you can say super.serialize(encoding);
  serialize() {
    return {
      _typeName: this._typeName,
      _typeID: (typeof this._typeID === 'undefined' ? null : this._typeID),
      _codecID: (typeof this._codecID === 'undefined' ? null : this._codecID),
    };
  }

  deserialize(fields:Serializable) {
    if (typeof fields._typeName !== 'string') {
      throw new Error(`Error - Serializable.deserialize: _typeName must be a string, found: ${typeof fields._typeName}`);
    }
    if (fields._typeName !== this._typeName) {
      throw new Error(`Error - Serializable.deserialize: _typeName mismatch -- expected: ${this._typeName} -- recieved: ${fields._typeName}`);
    }
    if (typeof fields._typeID !== 'undefined' && fields._typeID !== null) {
      if (typeof fields._typeID !== 'number') {
        throw new Error(`Error - Serializable.deserialize: _typeID must be a number, found: ${typeof fields._typeID}`);
      }
      if (fields._typeID !== this._typeID) {
        throw new Error(`Error - Serializable.deserialize: _typeID mismatch -- expected: ${this._typeID} -- recieved: ${fields._typeID}`);
      }
    }
    if (typeof fields._codecID !== 'undefined' && fields._codecID !== null) {
      if (typeof fields._codecID !== 'number') {
        throw new Error(`Error - Serializable.deserialize: _codecID must be a number, found: ${typeof fields._codecID}`);
      }
      if (fields._codecID !== this._codecID) {
        throw new Error(`Error - Serializable.deserialize: _codecID mismatch -- expected: ${this._codecID} -- recieved: ${fields._codecID}`);
      }
    }
  }
}

export class Serialization {
  private static instance:Serialization;

  private constructor() {
    this.bintools = BinTools.getInstance();
  }

  private bintools:BinTools;

  /**
     * Retrieves the Serialization singleton.
     */
  static getInstance(): Serialization {
    if (!Serialization.instance) {
      Serialization.instance = new Serialization();
    }
    return Serialization.instance;
  }

  bufferToType(vb:Buffer, type:SerializedType, ...args:Array<any>):any {
    if (type === 'BN') {
      return new BN(vb.toString('hex'), 'hex');
    } if (type === 'Buffer') {
      if (args.length === 1 && typeof args[0] === 'number') {
        vb = Buffer.from(vb.toString('hex').padStart(args[0] * 2, '0'), 'hex');
      }
      return vb;
    } if (type === 'bech32') {
      return this.bintools.addressToString(args[0], args[1], vb);
    } if (type === 'nodeID') {
      return bufferToNodeIDString(vb);
    } if (type === 'privateKey') {
      return bufferToPrivateKeyString(vb);
    } if (type === 'cb58') {
      return this.bintools.cb58Encode(vb);
    } if (type === 'base58') {
      return this.bintools.bufferToB58(vb);
    } if (type === 'base64') {
      return vb.toString('base64');
    } if (type === 'hex') {
      return vb.toString('hex');
    } if (type === 'decimalString') {
      return new BN(vb.toString('hex'), 'hex').toString(10);
    } if (type === 'number') {
      return new BN(vb.toString('hex'), 'hex').toNumber();
    } if (type === 'utf8') {
      return vb.toString('utf8');
    }
    return undefined;
  }

  typeToBuffer(v:any, type:SerializedType, ...args:Array<any>):Buffer {
    if (type === 'BN') {
      const str:string = (v as BN).toString('hex');
      if (args.length === 1 && typeof args[0] === 'number') {
        return Buffer.from(str.padStart(args[0] * 2, '0'), 'hex');
      }
      return Buffer.from(str, 'hex');
    } if (type === 'Buffer') {
      return v;
    } if (type === 'bech32') {
      return this.bintools.stringToAddress(v);
    } if (type === 'nodeID') {
      return NodeIDStringToBuffer(v);
    } if (type === 'privateKey') {
      return privateKeyStringToBuffer(v);
    } if (type === 'cb58') {
      return this.bintools.cb58Decode(v);
    } if (type === 'base58') {
      return this.bintools.b58ToBuffer(v);
    } if (type === 'base64') {
      return Buffer.from(v as string, 'base64');
    } if (type === 'hex') {
      if ((v as string).startsWith('0x')) {
        v = (v as string).slice(2);
      }
      return Buffer.from(v as string, 'hex');
    } if (type === 'decimalString') {
      const str:string = new BN(v as string, 10).toString('hex');
      if (args.length === 1 && typeof args[0] === 'number') {
        return Buffer.from(str.padStart(args[0] * 2, '0'), 'hex');
      }
      return Buffer.from(str, 'hex');
    } if (type === 'number') {
      const str:string = new BN(v, 10).toString('hex');
      if (args.length === 1 && typeof args[0] === 'number') {
        return Buffer.from(str.padStart(args[0] * 2, '0'), 'hex');
      }
      return Buffer.from(str, 'hex');
    } if (type === 'utf8') {
      if (args.length === 1 && typeof args[0] === 'number') {
        const b:Buffer = Buffer.alloc(args[0]);
        b.write(v);
        return b;
      }
      return Buffer.from(v, 'utf8');
    }
    throw new Error('Unexpected value');
  }

  encoder(value:any, encoding:SerializedEncoding, intype:SerializedType, outtype:SerializedType, ...args:Array<any>):string {
    if (typeof value === 'undefined') {
      throw new Error('Error - Serializable.encoder: value passed is undefined');
    }
    if (encoding !== 'display') {
      outtype = encoding;
    }
    const vb = this.typeToBuffer(value, intype, ...args);
    return this.bufferToType(vb, outtype, ...args);
  }

  decoder(value:string, encoding:SerializedEncoding, intype:SerializedType, outtype:SerializedType, ...args:Array<any>): Buffer {
    if (typeof value === 'undefined') {
      throw new Error('Error - Serializable.decoder: value passed is undefined');
    }
    if (encoding !== 'display') {
      intype = encoding;
    }
    const vb = this.typeToBuffer(value, intype, ...args);
    return this.bufferToType(vb, outtype, ...args);
  }

  serialize(serialize:Serializable, vm:string, encoding:SerializedEncoding = 'display', notes?:string):object {
    if (typeof notes === 'undefined') {
      notes = serialize.getTypeName();
    }
    return {
      vm,
      encoding,
      version: SERIALIZATIONVERSION,
      notes,
      fields: serialize.serialize(),
    };
  }

  deserialize(input:{fields: Serializable}, output:Serializable) {
    output.deserialize(input.fields);
  }
}
