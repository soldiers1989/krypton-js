import * as kryptonDB from './kryptonDB'
import * as cmc from './coinmarketcap'
import * as kep5 from './kep5'
import * as kazescan from './kazescan'
import * as core from './core'
/**
 * @typedef {object} History
 * @property {string} address - Address.
 * @property {string} name - API name.
 * @property {string} net - 'MainNet' or 'TestNet'
 * @property {PastTx[]} history - List of past transactions.
 */

/**
 * @typedef {object} PastTx
 * @property {number} STREAM - Stream involved.
 * @property {number} KAZE - KAZE involved.
 * @property {number} block_index - Block index.
 * @property {boolean} stream_sent - Was STREAM sent.
 * @property {boolean} kaze_sent - Was KAZE sent.
 * @property {string} txid - Transaction ID.
 */

export default {
  get: {
    price: cmc.getPrice,
    prices: cmc.getPrices,
    balance: kryptonDB.getBalance,
    claims: kryptonDB.getClaims,
    transactionHistory: kryptonDB.getTransactionHistory,
    tokenBalance: kep5.getTokenBalance,
    tokenBalances: kep5.getTokenBalances,
    tokenInfo: kep5.getTokenInfo,
    token: kep5.getToken
  },
  do: {
    sendAsset: kryptonDB.doSendAsset,
    claimAllStream: kryptonDB.doClaimAllStream,
    mintTokens: kryptonDB.doMintTokens
  },
  sendAsset: (config) => core.sendAsset(config),
  claimStream: (config) => core.claimStream(config),
  doInvoke: (config) => core.doInvoke(config),
  setupVote: (config) => core.setupVote(config)
}

export * from './core'
export * from './switch'
export { kryptonDB, cmc, kep5, kazescan }
