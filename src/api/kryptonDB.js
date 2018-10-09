import axios from 'axios'
import { Account, Balance, Claims } from '../wallet'
import { Transaction, TxAttrUsage } from '../transactions'
import { RPCClient, Query } from '../rpc'
import { ASSET_ID } from '../consts'
import { Fixed8, reverseHex } from '../utils'
import { networks, httpsOnly, timeout } from '../settings'
import logger from '../logging'
import { raceToSuccess } from './common'

const log = logger('api')
export const name = 'kryptonDB'

var cachedRPC = null
/**
 * API Switch for MainNet and TestNet
 * @param {string} net - 'MainNet', 'TestNet', or custom krypton-wallet-db URL.
 * @return {string} URL of API endpoint.
 */
export const getAPIEndpoint = net => {
  if (networks[net]) return networks[net].extra.kryptonDB
  return net
}
/**
 * Get balances of KAZE and STREAM for an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>} Balance of address
 */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/balance/' + address).then(res => {
    const bal = new Balance({ net, address: res.data.address })
    Object.keys(res.data).map(key => {
      if (key === 'net' || key === 'address') return
      bal.addAsset(key, res.data[key])
    })
    log.info(`Retrieved Balance for ${address} from kryptonDB ${net}`)
    return bal
  })
}

/**
 * Get amounts of available (spent) and unavailable claims.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Claim>} An object with available and unavailable STREAM amounts.
 */
export const getClaims = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then(res => {
    const claimData = res.data
    claimData.claims = claimData.claims.map(c => {
      return {
        claim: new Fixed8(c.claim).div(100000000),
        index: c.index,
        txid: c.txid,
        start: new Fixed8(c.start),
        end: new Fixed8(c.end),
        value: c.value
      }
    })
    log.info(`Retrieved Claims for ${address} from kryptonDB ${net}`)
    return new Claims(claimData)
  })
}

/**
 * Gets the maximum amount of stream claimable after spending all KAZE.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Fixed8>} An object with available and unavailable STREAM amounts.
 */
export const getMaxClaimAmount = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then(res => {
    log.info(
      `Retrieved maximum amount of stream claimable after spending all KAZE for ${address} from kryptonDB ${net}`
    )
    return new Fixed8(res.data.total_claim + res.data.total_unspent_claim).div(
      100000000
    )
  })
}

/**
 * Returns the best performing (highest block + fastest) node RPC.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<string>} The URL of the best performing node.
 */
export const getRPCEndpoint = net => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/network/nodes')
    .then((response) => {
      const healthyNodes = response.data.nodes.filter(n => n.status)
      let nodes = healthyNodes.sort((a, b) => b.block_height - a.block_height)
      if (httpsOnly) nodes = nodes.filter(n => n.url.includes('https://'))
      if (nodes.length === 0) throw new Error('No eligible nodes found!')

      const heightThreshold = nodes[0].block_height - 1
      const goodNodes = nodes.filter(n => n.block_height >= heightThreshold)

      const urls = goodNodes.map(n => n.url)
      if (urls.includes(cachedRPC)) {
        return new RPCClient(cachedRPC).ping().then(num => {
          if (num <= timeout.ping) return cachedRPC
          cachedRPC = null
          return getRPCEndpoint(net)
        })
      }
      const clients = urls.map(u => new RPCClient(u))
      return raceToSuccess(clients.map(c => c.ping().then(_ => c.net)))
    })
    .then(fastestUrl => {
      cachedRPC = fastestUrl
      return fastestUrl
    })
}

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} a list of PastTransaction
 */
export const getTransactionHistory = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios
    .get(apiEndpoint + '/v2/address/history/' + address)
    .then(response => {
      log.info(`Retrieved History for ${address} from kryptonDB ${net}`)
      return response.data.history.map(rawTx => {
        return {
          change: {
            KAZE: new Fixed8(rawTx.KAZE || 0),
            STREAM: new Fixed8(rawTx.STREAM || 0)
          },
          blockHeight: new Fixed8(rawTx.block_index),
          txid: rawTx.txid
        }
      })
    })
}

/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
export const getWalletDBHeight = net => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/block/height').then(response => {
    return parseInt(response.data.block_height)
  })
}

/**
 * Perform a ClaimTransaction for all available STREAM based on API
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} privateKey - Private Key or WIF.
 * @param {function} [signingFunction] - Optional async signing function. Used for external signing.
 * @return {Promise<Response>} RPC response from sending transaction
 */
export const doClaimAllStream = (net, privateKey, signingFunction) => {
  log.warn('doClaimAllStream will be deprecated in favor of claimStream')
  const account = new Account(privateKey)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const claimsPromise = getClaims(net, account.address)
  let signedTx // Scope this outside so that all promises have this
  let endpt
  return Promise.all([rpcEndpointPromise, claimsPromise])
    .then(values => {
      endpt = values[0]
      const claims = values[1]
      if (claims.length === 0) throw new Error('No claimable stream!')
      const unsignedTx = Transaction.createClaimTx(account.publicKey, claims)
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        return unsignedTx.sign(account.privateKey)
      }
    })
    .then(signedResult => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then(res => {
      if (res.result === true) {
        res.txid = signedTx
      } else {
        log.error(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}

/**
 * Call mintTokens for RPX
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} scriptHash - Contract scriptHash.
 * @param {string} fromWif - The WIF key of the originating address.
 * @param {number} kaze - The amount of kaze to send to RPX.
 * @param {number} streamCost - The Stream to send as SC fee.
 * @return {Promise<Response>} RPC Response
 */
export const doMintTokens = (net, scriptHash, fromWif, kaze, streamCost, signingFunction) => {
  log.warn('doMintTokens will be deprecated in favor of doInvoke')
  const account = new Account(fromWif)
  const intents = [
    { assetId: ASSET_ID.KAZE, value: kaze, scriptHash: scriptHash }
  ]
  const invoke = { operation: 'mintTokens', scriptHash, args: [] }
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, account.address)
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then(values => {
      endpt = values[0]
      let balances = values[1]
      const attributes = [
        {
          data: reverseHex(scriptHash),
          usage: TxAttrUsage.Script
        }
      ]
      const unsignedTx = Transaction.createInvocationTx(balances, intents, invoke, streamCost, { attributes })
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        return unsignedTx.sign(account.privateKey)
      }
    })
    .then(signedResult => {
      signedTx = signedResult
      return Query.getContractState(scriptHash).execute(endpt)
    })
    .then(contractState => {
      const attachInvokedContract = {
        invocationScript: '0000',
        verificationScript: contractState.result.script
      }
      signedTx.scripts.unshift(attachInvokedContract)
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then(res => {
      if (res.result === true) {
        res.txid = signedTx.hash
      } else {
        log.error(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}

/**
 * Send an asset to an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} toAddress - The destination address.
 * @param {string} from - Private Key or WIF of the sending address.
 * @param {{KAZE: number, STREAM: number}} assetAmounts - The amount of each asset (KAZE and STREAM) to send, leave empty for 0.
 * @param {function} [signingFunction] - Optional signing function. Used for external signing.
 * @return {Promise<Response>} RPC Response
 */
export const doSendAsset = (net, toAddress, from, assetAmounts, signingFunction) => {
  log.warn('doSendAsset will be deprecated in favor of sendAsset')
  const fromAcct = new Account(from)
  const toAcct = new Account(toAddress)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, fromAcct.address)
  const intents = Object.keys(assetAmounts).map(key => {
    return {
      assetId: ASSET_ID[key],
      value: assetAmounts[key],
      scriptHash: toAcct.scriptHash
    }
  })
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then(values => {
      endpt = values[0]
      const balance = values[1]
      const unsignedTx = Transaction.createContractTx(balance, intents)
      if (signingFunction) {
        return signingFunction(unsignedTx, fromAcct.publicKey)
      } else {
        return unsignedTx.sign(fromAcct.privateKey)
      }
    })
    .then(signedResult => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then(res => {
      if (res.result === true) {
        res.txid = signedTx.hash
      } else {
        log.error(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}
