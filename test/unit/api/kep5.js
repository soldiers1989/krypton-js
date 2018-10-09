import * as KEP5 from '../../../src/api/kep5'
import { DEFAULT_RPC, CONTRACTS } from '../../../src/consts'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('KEP5', function () {
  const url = DEFAULT_RPC.TEST
  const scriptHash = CONTRACTS.TEST_LWTF
  const secondScriptHash = CONTRACTS.TEST_NXT
  let mock

  before(() => {
    mock = setupMock(mockData.kep5)
  })

  after(() => {
    mock.restore()
  })

  it('get basic info', () => {
    return KEP5.getTokenInfo(url, scriptHash)
      .then(result => {
        result.name.should.equal('LOCALTOKEN')
        result.symbol.should.equal('LWTF')
        result.decimals.should.equal(8)
        result.totalSupply.should.least(1969000)
      })
  })

  it('get balance', () => {
    return KEP5.getTokenBalance(url, scriptHash, testKeys.c.address)
      .then(result => {
        result.should.be.above(0)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('get balances', () => {
    return KEP5.getTokenBalances(url, [scriptHash, secondScriptHash], testKeys.b.address)
      .then(result => {
        result.LWTF.should.equal(0.0001333)
        result.NXT.should.equal(0.00030806)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })

  describe('getToken', function () {
    it('get info only', () => {
      return KEP5.getToken(url, scriptHash)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.name.should.equal('LOCALTOKEN')
          result.symbol.should.equal('LWTF')
          result.decimals.should.equal(8)
          result.totalSupply.should.least(1969000)
        })
    })

    it('get info and balance', () => {
      return KEP5.getToken(url, scriptHash, testKeys.c.address)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.name.should.equal('LOCALTOKEN')
          result.symbol.should.equal('LWTF')
          result.decimals.should.equal(8)
          result.totalSupply.should.least(1969000)
          result.balance.should.be.above(0)
        })
    })

    it('get info and balance of zero', () => {
      return KEP5.getToken(url, scriptHash, testKeys.b.address)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.name.should.equal('LOCALTOKEN')
          result.symbol.should.equal('LWTF')
          result.decimals.should.equal(8)
          result.totalSupply.should.least(1969000)
          result.balance.should.equal(0)
        })
    })
  })
})
