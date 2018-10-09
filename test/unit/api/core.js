import * as core from '../../../src/api/core'
import { kryptonDB, kazescan } from '../../../src/api'
import { Transaction, signTransaction, getTransactionHash } from '../../../src/transactions'
import { Account, Balance, Claims } from '../../../src/wallet'
import { DEFAULT_RPC } from '../../../src/consts'
import { Fixed8 } from '../../../src/utils'
import testKeys from '../testKeys.json'
import testData from '../testData.json'
import mockData from './mockData.json'

describe('Core API', function () {
  let mock
  const baseConfig = {
    net: 'TestNet',
    address: testKeys.a.address
  }

  before(() => {
    mock = setupMock([mockData.kryptonDB, mockData.kazescan, mockData.core])
  })

  after(() => {
    mock.restore()
  })

  it('makeIntent', () => {
    core.makeIntent({ KAZE: 1, STREAM: 1.1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      .should.deep.include.members([
        {
          assetId: 'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17',
          value: new Fixed8(1),
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        },
        {
          assetId: '9d2593e23db5e8946969a16d1980ee57e04bb25904bb0ca0d181257eb48a539',
          value: new Fixed8(1.1),
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        }]
      )
  })

  describe('getBalanceFrom', function () {
    it('kryptonDB', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, kryptonDB)
        .should.eventually.have.keys([
          'net',
          'address',
          'balance'
        ])
    })

    it('kazescan', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, kazescan)
        .should.eventually.have.keys([
          'net',
          'address',
          'balance'
        ])
    })

    it('errors when insufficient info', () => {
      return core.getBalanceFrom({ net: 'TestNet' }, kryptonDB).should.be.rejected
    })

    it('errors when incorrect api', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, {}).should.be.rejected
    })
  })

  describe('getClaimsFrom', function () {
    it('Retrieves information properly', () => {
      const config = Object.assign({}, baseConfig)
      return core.getClaimsFrom(config, kryptonDB)
        .then((conf) => {
          conf.should.have.keys([
            'net', 'address', 'claims'
          ])
        })
    })

    it('errors when insufficient info', () => {
      return core.getClaimsFrom({ net: 'TestNet' }, kryptonDB).should.be.rejected
    })

    it('errors when incorrect api', () => {
      const config = Object.assign({}, baseConfig)
      return core.getClaimsFrom(config, {}).should.be.rejected
    })
  })

  describe('buildDescriptors', function () {
    it('converts candidateKeys to descriptors', () => {
      const config = Object.assign({}, baseConfig, { candidateKeys: ['02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef', '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9'] })

      return core.buildDescriptors(config)
        .then(conf => {
          conf.should.have.any.keys(['descriptors'])
          conf.descriptors.should.eql([{
            type: 0x40,
            key: '3775292229eccdf904f16fff8e83e7cffdc0f0ce',
            field: 'Votes',
            value: '0202028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9'
          }])
        })
    })
  })

  describe('createTx', function () {
    let config
    beforeEach(() => {
      config = Object.assign({}, baseConfig, {
        balance: new Balance(JSON.parse(JSON.stringify(testData.a.balance))),
        claims: testData.a.claims,
        intents: [{
          assetId: '9d2593e23db5e8946969a16d1980ee57e04bb25904bb0ca0d181257eb48a539',
          value: 1.1,
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        }],
        script: '001234567890',
        stream: 0.1,
        descriptors: [{
          type: 0x40,
          key: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537',
          field: 'Votes',
          value: 'abcd'
        }]
      })
    })
    it('claims', () => {
      return core.createTx(config, 'claim')
        .then((conf) => {
          conf.should.have.any.keys(['balance', 'claims', 'intents', 'script', 'stream', 'tx'])
          conf.tx.type.should.equal(2)
          conf.tx.outputs.length.should.equal(1)
        })
    })

    it('contract', () => {
      return core.createTx(config, 'contract')
        .then((conf) => {
          conf.should.have.any.keys(['balance', 'claims', 'intents', 'script', 'stream', 'tx'])
          conf.tx.type.should.equal(128)
          conf.tx.inputs.length.should.least(1)
          conf.tx.outputs.length.should.least(1)
        })
    })

    it('invocation', () => {
      return core.createTx(config, 'invocation')
        .then((conf) => {
          conf.should.have.any.keys(['balance', 'claims', 'intents', 'script', 'stream', 'tx'])
          conf.tx.type.should.equal(209)
        })
    })

    it('state', () => {
      return core.createTx(config, 'state')
        .then((conf) => {
          conf.should.have.any.keys(['tx', 'descriptors'])
          conf.tx.type.should.equal(144)
        })
    })

    it('errors when given wrong type', () => {
      return core.createTx(config, 'weird').should.eventually.be.rejected
    })
  })

  describe('signTx', function () {
    const tx = Transaction.deserialize(testData.a.tx)
    const signature = tx.scripts[0]
    const address = testKeys.a.address
    beforeEach(() => {
      tx.scripts = []
    })
    it('sign with Private key', () => {
      return core.signTx({
        tx,
        address,
        privateKey: testKeys.a.privateKey
      })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
    })

    it('cannot sign for assets on address mismatch', () => {
      return core.signTx({
        tx,
        address,
        privateKey: testKeys.b.privateKey
      })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
        .should.be.rejectedWith(Error)
    })

    it('sign for smart contract assets', () => {
      const testSmartContractAddress = 'AXhgHZtAYC8ZztJo8B1LV2kLyeMrXr39La'

      return core.signTx({
        tx,
        address: testSmartContractAddress,
        privateKey: testKeys.a.privateKey,
        sendingFromSmartContract: true
      })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
    })

    it('cannot sign for smart contract assets without option', () => {
      const testSmartContractAddress = 'AXhgHZtAYC8ZztJo8B1LV2kLyeMrXr39La'

      const config = {
        tx,
        address: testSmartContractAddress,
        privateKey: testKeys.a.privateKey
      }
      return core.signTx(config).should.be.rejectedWith(Error)
    })

    it('sign with signingFunction', () => {
      const signingFunction = (tx, publicKey) => {
        return Promise.resolve(signTransaction(tx, testKeys.a.privateKey))
      }
      return core.signTx({ tx, address, signingFunction, publicKey: testKeys.a.publicKey })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
    })
  })

  describe('sendTx', function () {
    const config = {
      tx: Transaction.deserialize(testData.a.tx),
      url: DEFAULT_RPC.TEST
    }
    it('works', () => {
      return core.sendTx(config)
        .then((conf) => {
          conf.response.should.be.an('object')
          conf.response.result.should.equal(true)
          conf.response.txid.should.equal(getTransactionHash(config.tx))
        })
    })
  })

  describe('fillUrl', function () {
    it('does nothing when url provided', () => {
      const config = {
        url: 'http://random.org:44886'
      }

      return core.fillUrl(config)
        .then(conf => {
          conf.url.should.equal('http://random.org:44886')
        })
    })

    it('fills url', () => {
      const config = Object.assign({}, baseConfig)
      return core.fillUrl(config)
        .then(conf => {
          conf.url.should.be.a('string')
        })
    })
  })

  describe('fillKeys', function () {
    it('fill address and privateKey', () => {
      const config = {
        account: new Account(testKeys.a.privateKey)
      }

      return core.fillKeys(config)
        .then((conf) => {
          conf.address.should.equal(testKeys.a.address)
          conf.privateKey.should.equal(testKeys.a.privateKey)
        })
    })

    it('fill address and publicKey when using signingFunction', () => {
      const config = {
        account: new Account(testKeys.a.publicKey),
        signingFunction: () => true
      }

      return core.fillKeys(config)
        .then(conf => {
          conf.address.should.equal(testKeys.a.address)
          conf.publicKey.should.equal(testKeys.a.publicKey)
        })
    })
  })

  describe('fillBalance', function () {
    it('does not call getBalance when balance exists', () => {
      const expectedBalance = new Balance()
      const config = {
        net: 'RandomNet',
        address: testKeys.b.address,
        balance: expectedBalance
      }
      return core.fillBalance(config)
        .then(conf => {
          conf.balance.should.equal(expectedBalance)
        })
    })

    it('calls getBalance when balance is not available', () => {
      const config = Object.assign({}, baseConfig)
      return core.fillBalance(config)
        .then(conf => {
          conf.should.have.keys([
            'net',
            'address',
            'balance'
          ])
        })
    })
  })

  describe('fillClaims', function () {
    it('does not call getClaims when claims exist', () => {
      const expectedClaims = new Claims()
      const config = {
        net: 'RandomNet',
        address: testKeys.b.address,
        claims: expectedClaims
      }
      return core.fillClaims(config)
        .then(conf => {
          conf.claims.should.equal(expectedClaims)
        })
    })

    it('calls getClaims when claims is not available', () => {
      const config = Object.assign({}, baseConfig)
      return core.fillClaims(config)
        .then(conf => {
          conf.should.have.keys([
            'net',
            'address',
            'claims'
          ])
        })
    })
  })
})
