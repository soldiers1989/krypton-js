import * as KEP5 from '../../../src/api/kep5'
import { DEFAULT_RPC, CONTRACTS, KAZE_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API KEP5', function () {
  this.timeout(20000)
  const log = setupLogs()
  const scriptHash = CONTRACTS.TEST_LWTF

  describe('getToken', function () {
    it('get info and balance', () => {
      return KEP5.getToken(DEFAULT_RPC.TEST, scriptHash, testKeys.c.address)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.name.should.equal('LOCALTOKEN')
          result.symbol.should.equal('LWTF')
          result.decimals.should.equal(8)
          result.totalSupply.should.least(1969000)
          result.balance.should.be.above(0)
        })
    })

    it('should parse 0 decimals correctly', () => {
      return KEP5.getToken(DEFAULT_RPC.TEST, CONTRACTS.TEST_RHTT4, testKeys.a.address)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.decimals.should.equal(0)
          result.totalSupply.should.equal(60000)
          result.balance.should.equal(2)
        })
    })
  })

  it('getTokenInfo', () => {
    return KEP5.getTokenInfo(DEFAULT_RPC.TEST, CONTRACTS.TEST_RHTT4)
      .then(({ name, symbol, decimals, totalSupply }) => {
        name.should.equal('Redeemable HashPuppy Testnet Token 4')
        symbol.should.equal('RHTT4')
        decimals.should.equal(0)
        totalSupply.should.equal(60000)
      })
  })
  it('getTokenBalance', () => {
    return KEP5.getTokenBalance(DEFAULT_RPC.TEST, CONTRACTS.TEST_RHTT4, testKeys.b.address)
      .then(result => {
        result.should.equal(2)
      })
  })

  it('getTokenBalances', () => {
    return KEP5.getTokenBalances(
      DEFAULT_RPC.TEST,
      [
        CONTRACTS.TEST_RPX,
        CONTRACTS.TEST_RHTT4,
        CONTRACTS.TEST_LWTF,
        CONTRACTS.TEST_NXT,
        CONTRACTS.TEST_RPX,
        CONTRACTS.TEST_RHTT4,
        CONTRACTS.TEST_LWTF,
        CONTRACTS.TEST_NXT
      ],
      testKeys.b.address
    ).then(result => {
      const keys = Object.keys(result)
      keys.length.should.equal(4)
      keys.forEach(k => {
        result[k].should.be.a('number')
      })
    })
  })

  it.skip('doTransferToken', () => {
    const transferAmount = 1
    const streamCost = 0
    return KEP5.doTransferToken(KAZE_NETWORK.TEST, scriptHash, testKeys.c.wif, testKeys.b.address, transferAmount, streamCost)
      .then(({ result, txid }) => {
        result.should.equal(true)
        log.info(`doTransferToken: ${txid}`)
      })
  })
})
