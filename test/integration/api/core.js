import * as core from '../../../src/api/core'
import * as APIswitch from '../../../src/api/switch'
import { CONTRACTS, KAZE_NETWORK } from '../../../src/consts'
import { ContractParam } from '../../../src/sc'
import { Account } from '../../../src/wallet'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API Core', function () {
  this.timeout(30000)
  const log = setupLogs()
  log.info('Integration: API Core')
  let mock

  const useKryptonDB = () => {
    APIswitch.setApiSwitch(0)
    mock = setupMock()
    mock.onGet(/kazescan/).timeout()
    mock.onAny().passThrough()
  }

  const useKazescan = () => {
    APIswitch.setApiSwitch(1)
    mock = setupMock()
    mock.onGet(/testnet-api.wallet/).timeout()
    mock.onAny().passThrough()
  }
  afterEach(() => {
    APIswitch.setApiSwitch(0)
    if (mock) mock.restore()
  })
  describe('sendAsset', function () {
    it.skip('KryptonDB', () => {
      useKryptonDB()

      const intent1 = core.makeIntent({ KAZE: 1 }, testKeys.a.address)
      const config1 = {
        net: KAZE_NETWORK.TEST,
        account: new Account(testKeys.b.privateKey),
        intents: intent1
      }

      return core.sendAsset(config1)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`sendAsset(kryptonDB): ${c.response.txid}`)
        })
    })

    it('Kazescan', () => {
      useKazescan()

      const intent2 = core.makeIntent({ KAZE: 1 }, testKeys.b.address)
      const config2 = {
        net: KAZE_NETWORK.TEST,
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        intents: intent2,
        fees: 0.00000001
      }
      return core.sendAsset(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`sendAsset(kazescan): ${c.response.txid}`)
        })
    })
  })

  describe('claimStream', function () {
    it.skip('kryptonDB', () => {
      useKryptonDB()

      const config = {
        net: KAZE_NETWORK.TEST,
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey
      }
      return core.claimStream(config)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`claimStream(kryptonDB): ${c.response.txid}`)
        })
    })

    it('kazescan', () => {
      useKazescan()

      const config2 = {
        net: KAZE_NETWORK.TEST,
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey
      }
      return core.claimStream(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`claimStream(kazescan): ${c.response.txid}`)
        })
    })
  })

  describe('doInvoke', function () {
    it.skip('kryptonDB', () => {
      useKryptonDB()

      const config = {
        net: KAZE_NETWORK.TEST,
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        script: '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
        stream: 0
      }
      return core.doInvoke(config)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`doInvoke(kryptonDB): ${c.response.txid}`)
        })
    })

    it('kazescan', () => {
      // This does a transferToken
      useKazescan()
      const fromAddrScriptHash = ContractParam.byteArray(testKeys.b.address, 'address')
      const toAddrScriptHash = ContractParam.byteArray(testKeys.c.address, 'address')
      const transferAmount = ContractParam.byteArray(0.00000001, 'fixed8')
      const script = {
        scriptHash: CONTRACTS.TEST_LWTF,
        operation: 'transfer',
        args: ContractParam.array(fromAddrScriptHash, toAddrScriptHash, transferAmount)
      }
      const config2 = {
        net: KAZE_NETWORK.TEST,
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey,
        script,
        stream: 0
      }
      return core.doInvoke(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`doInvoke(kazescan): ${c.response.txid}`)
        })
    })
  })

  describe('setupVote', function () {
    it('kazescan', () => {
      useKazescan()
      const stateConfig = {
        net: 'TestNet',
        account: new Account(testKeys.a.privateKey),
        candidateKeys: [
          '030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e36',
          '0327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8'
        ]
      }
      return core.setupVote(stateConfig)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`setupVote(kazescan): ${c.response.txid}`)
        })
    })
  })
})
