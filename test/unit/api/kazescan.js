import * as kazescan from '../../../src/api/kazescan'
import * as settings from '../../../src/settings'
import { Balance, Claims } from '../../../src/wallet'
import { Fixed8 } from '../../../src/utils'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('Kazescan', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.kazescan)
  })

  after(() => {
    mock.restore()
  })

  it('getAPIEndpoint', () => {
    kazescan.getAPIEndpoint('MainNet').should.equal(settings.networks['MainNet'].extra.kazescan)
    kazescan.getAPIEndpoint('TestNet').should.equal(settings.networks['TestNet'].extra.kazescan)
    kazescan.getAPIEndpoint('VertoNet').should.equal(settings.networks['VertoNet'].extra.kazescan)
  })

  it('getRPCEndpoint returns https only', () => {
    settings.httpsOnly = true
    return kazescan.getRPCEndpoint('TestNet')
      .then(res => res.should.have.string('https://'))
      .then(() => { settings.httpsOnly = false })
  })

  it('getPRCEndpoint chooses from height of best-1', () => {
    return kazescan.getRPCEndpoint('TestNet')
      .then(res => res.should.equal('http://test3.kazeblockchain.io:8880'))
  })

  it('getBalance returns Balance object', () => {
    return kazescan.getBalance('TestNet', testKeys.a.address).then(response => {
      response.should.be.an.instanceof(Balance)
      response.assetSymbols.should.have.members(['KAZE', 'STREAM'])
      response.assets.KAZE.balance.toNumber().should.equal(261)
      response.assets.KAZE.unspent.should.be.an('array')
      response.assets.STREAM.balance.toNumber().should.equal(1117.93620487)
      response.assets.STREAM.unspent.should.be.an('array')
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
    })
  })

  it('getBalance on invalid/empty address returns null Balance object', () => {
    return kazescan.getBalance('TestNet', 'invalidAddress').then(response => {
      response.should.be.an.instanceof(Balance)
      response.address.should.equal('not found')
    })
  })

  it('getClaims returns Claims object', () => {
    return kazescan.getClaims('TestNet', testKeys.a.address).then(response => {
      response.should.be.an.instanceof(Claims)
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
      response.claims.should.be.an('array')
    })
  })

  it('getClaims on invalid/empty address returns null Claims object', () => {
    return kazescan.getClaims('TestNet', 'invalidAddress').then(response => {
      response.should.be.an.instanceof(Claims)
      response.address.should.equal('not found')
    })
  })

  it('getWalletDBHeight returns height number', () => {
    return kazescan.getWalletDBHeight('TestNet').then(response => {
      response.should.equal(1049805)
    })
  })

  it('getTransactionHistory returns history', () => {
    return kazescan
      .getTransactionHistory('TestNet', testKeys.a.address)
      .then(response => {
        response.should.be.an('array')
      })
  })

  it('getMaxClaimAmount returns amount', () => {
    return kazescan
      .getMaxClaimAmount('TestNet', testKeys.a.address)
      .then(response => {
        ; (response instanceof Fixed8).should.equal(true)
        const testNum = new Fixed8(0.03455555)
        const responseNumber = response.toNumber()
        responseNumber.should.equal(testNum.toNumber())
      })
  })

  it('should allow custom API endpoint, i.e. for private net', done => {
    const customEndpoint = 'http://localhost:5000'
    const privNet = kazescan.getAPIEndpoint(customEndpoint)
    privNet.should.equal(customEndpoint)
    done()
  })
})
