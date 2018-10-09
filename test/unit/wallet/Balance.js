import Balance from '../../../src/wallet/Balance'
import testData from '../testData.json'
import { Transaction } from '../../../src/transactions'
import { Fixed8 } from '../../../src/utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Balance', function () {
  let bal
  beforeEach('refresh balance', () => {
    bal = new Balance({ net: 'TestNet', address: testData.a.address })
    bal.addAsset('KAZE', testData.a.balance.assets.KAZE)
    bal.addAsset('STREAM', testData.a.balance.assets.STREAM)
  })

  describe('addAsset', function () {
    it('empty balance', () => {
      bal.addAsset('new1')
      bal.assetSymbols.length.should.equal(3)
      bal.assetSymbols[2].should.equal('NEW1')
    })

    it('filled balance', () => {
      const coin = {
        value: 1,
        assetId: 'abc',
        scriptHash: 'def'
      }
      bal.addAsset('new2', { balance: 1, unspent: [coin] })
      bal.assetSymbols.length.should.equal(3)
      bal.assetSymbols[2].should.equal('NEW2')
      bal.assets.NEW2.should.have.keys(['balance', 'spent', 'unspent', 'unconfirmed'])
      bal.assets.NEW2.balance.toNumber().should.equal(1)
    })
  })

  describe('applyTx', function () {
    const intents = [
      {
        assetId: 'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17',
        value: new Fixed8(200),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: 'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17',
        value: new Fixed8(59),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: '9d2593e23db5e8946969a16d1980ee57e04bb25904bb0ca0d181257eb48a539',
        value: new Fixed8(400),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: '9d2593e23db5e8946969a16d1980ee57e04bb25904bb0ca0d181257eb48a539',
        value: new Fixed8(20.96175487),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      }
    ]

    it('unconfirmed', () => {
      Transaction.createContractTx(bal, intents)
      bal.assets.STREAM.spent.length.should.equal(1)
      bal.assets.STREAM.unspent.length.should.equal(1)
      bal.assets.STREAM.unconfirmed.length.should.equal(2)
      bal.assets.KAZE.spent.length.should.equal(1)
      bal.assets.KAZE.unspent.length.should.equal(0)
      bal.assets.KAZE.unconfirmed.length.should.equal(2)
    })

    it('confirmed', () => {
      const tx = Transaction.createContractTx(bal, intents)
      bal.applyTx(tx, true)
      bal.assets.STREAM.spent.length.should.equal(1)
      bal.assets.STREAM.unspent.length.should.equal(3)
      if (bal.assets.STREAM.unconfirmed) bal.assets.STREAM.unconfirmed.length.should.equal(0)
      bal.assets.KAZE.spent.length.should.equal(1)
      bal.assets.KAZE.unspent.length.should.equal(2)
      if (bal.assets.KAZE.unconfirmed) bal.assets.KAZE.unconfirmed.length.should.equal(0)
    })
  })

  it('confirm', () => {
    bal.assets.KAZE.unconfirmed = [{ txid: 'abc', index: 0, value: 1 }]
    const unspentLength = bal.assets.KAZE.unspent.length
    bal.confirm()
    bal.assets.KAZE.unspent.length.should.equal(unspentLength + 1)
  })

  describe('verifyAssets', function () {
    let mock
    before(() => {
      mock = new MockAdapter(axios)
      mock.onPost().reply(200, {
        'jsonrpc': '2.0',
        'id': 1234,
        'result': null
      })
    })
    after(() => mock.restore())

    it('all spent', () => {
      return bal.verifyAssets('http://node1.kaze.solutions:44886')
        .then((bal) => {
          bal.assets.STREAM.spent.length.should.equal(2)
          bal.assets.KAZE.spent.length.should.equal(1)
        })
    })
  })

  describe('export', function () {
    it('exports correctly', () => {
      const result = bal.export()
      result.assets.should.eql(testData.a.balance.assets)
    })
  })
})
