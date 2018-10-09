import { RPCResponse } from '../../rpc'
import { signingFunction, net } from './core';

/** Queries for KEP5 Token information. */
export function getTokenInfo(url: string, scriptHash: string): Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>

/** Get the token balance of Address from Contract */
export function getTokenBalance(url: string, scriptHash: string, address: string): Promise<number>

/** Get token balances of a list of tokens for an address */
export function getTokenBalances(url:string, scriptHashArray: string[], address: string): Promise<{[key: string]: number}>

/** Get the token info and also balance if address is provided. */
export function getToken(url: string, scriptHash: string, address?: string): Promise<object>

/** Transfers KEP5 Tokens. */
export function doTransferToken(
  net: net,
  scriptHash: string,
  fromWif: string,
  toAddress: string,
  transferAmount: number,
  streamCost?: number,
  signingFunction?: signingFunction
): Promise<RPCResponse>
