import { calculateInputs, serializeTransaction, deserializeTransaction, signTransaction, getTransactionHash } from '../../../src/transactions/core'
import { Balance } from '../../../src/wallet'
import { Fixed8 } from '../../../src/utils'
import createData from './createData.json'
import data from './data.json'

describe('Core Transaction Methods', function () {
  describe('calculateInputs', function () {
    it('outputs correctly', () => {
      const intents = [{
        assetId: 'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17',
        value: new Fixed8(1),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      }]
      const { inputs, change } = calculateInputs(new Balance(createData.balance), intents, 0.1)
      inputs.length.should.be.least(2)
      change.length.should.be.least(1)
    })

    it('Errors when insufficient balance', () => {
      const intents = [{
        assetId: 'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17',
        value: new Fixed8(100),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      }]
      const thrower = () => {
        calculateInputs(new Balance(createData.balance), intents, 0.1)
      }
      thrower.should.throw()
    })

    it('returns empty inputs/change when given null intents', () => {
      const intents = []
      const { inputs, change } = calculateInputs(createData.balance, intents)
      inputs.should.eql([])
      change.should.eql([])
    })
  })

  it('serialize', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      const hexstring = serializeTransaction(tx.deserialized)
      hexstring.should.equal(tx.serialized.stream)
    })
  })

  it('deserialize', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      const expected = tx.deserialized
      expected.outputs = expected.outputs.map(txout => {
        return {
          assetId: txout.assetId,
          value: new Fixed8(txout.value),
          scriptHash: txout.scriptHash
        }
      })
      const transaction = deserializeTransaction(tx.serialized.stream)
      transaction.should.eql(expected)
    })
  })

  it('signTransaction', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      // Only perform test if privateKey is available for that tx
      if (tx.privateKey) {
        const unsignedTransaction = Object.assign({}, tx.deserialized, { scripts: [] })
        const signedTx = signTransaction(unsignedTransaction, tx.privateKey)
        signedTx.scripts.should.eql(tx.deserialized.scripts)
      }
    })
  })

  it('getTransactionHash', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      const hash = getTransactionHash(tx.deserialized)
      hash.should.equal(tx.hash)
    })
  })
})
