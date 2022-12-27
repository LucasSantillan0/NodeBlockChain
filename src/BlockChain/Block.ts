import { SHA256 } from "crypto-js";
import { BlockChain } from ".";
import { MINE_RATE } from "../shared/constants";

export interface BlockConstructorArguments {
  body: string;
  previousBlock: Block;
  blockChain: BlockChain;
}

export class Block {
  public blockChain: BlockChain;

  private _body: string;
  private _previousBlock!: Block;
  private _nextBlock!: Block | null;

  private _hash!: string;
  private _difficulty!: number;
  private _nonce!: number;
  private _time!: number;

  constructor({ body, previousBlock, blockChain }: BlockConstructorArguments) {
    this._hash = SHA256(
      body + `${blockChain.length && previousBlock._hash}`
    ).toString();
    this._body = body;
    this.blockChain = blockChain;
  }

  get body() {
    return this._body;
  }
  get previousBlock() {
    return this._previousBlock;
  }
  get nextBlock() {
    if (!this._nextBlock) {
      throw new Error("Head has no block forward");
    }
    return this._nextBlock;
  }
  get hash() {
    return this._hash;
  }
  public fitNext(nextBlock: Block) {
    nextBlock._previousBlock = this;
    this._nextBlock = nextBlock;
  }
  public clean() {
    this._nextBlock = null;
    this._previousBlock = null as unknown as Block;
  }
  toJsonObject() {
    return {
      PreviousHash: this._previousBlock._hash,
      body: this._body,
      Hash: this.hash,
    };
  }
}
