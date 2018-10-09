import * as kryptonDB from '../../../src/api/kryptonDB'
import * as settings from '../../../src/settings'
import { Balance, Claims } from '../../../src/wallet'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('KryptonDB', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.kryptonDB)
  })

  after(() => {
    mock.restore()
  })

  it('getAPIEndpoint', () => {
    kryptonDB.getAPIEndpoint('MainNet').should.equal(settings.networks['MainNet'].extra.kryptonDB)
    kryptonDB.getAPIEndpoint('TestNet').should.equal(settings.networks['TestNet'].extra.kryptonDB)
  })

  it('getRPCEndpoint returns https only', () => {
    settings.httpsOnly = true
    return kryptonDB.getRPCEndpoint('TestNet')
      .then(res => res.should.have.string('https://'))
      .then(() => { settings.httpsOnly = false })
  })

  it('getPRCEndpoint chooses from height of best-1', () => {
    return kryptonDB.getRPCEndpoint('TestNet')
      .then(res => res.should.be.oneOf(['https://node4.kaze.solutions:44885', 'http://node1.kaze.solutions:44886']))
  })

  it('getBalance returns Balance object', () => {
    return kryptonDB.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        (response instanceof Balance).should.equal(true)
        response.assetSymbols.should.have.members(['KAZE', 'STREAM'])
        response.assets.KAZE.balance.toNumber().should.equal(261)
        response.assets.KAZE.unspent.should.be.an('array')
        response.assets.STREAM.balance.toNumber().should.equal(1117.93620487)
        response.assets.STREAM.unspent.should.be.an('array')
        response.net.should.equal('TestNet')
        response.address.should.equal(testKeys.a.address)
      })
  })

  it('getClaims returns Claims object', () => {
    return kryptonDB.getClaims('TestNet', testKeys.a.address)
      .then((response) => {
        (response instanceof Claims).should.equal(true)
        response.net.should.equal('TestNet')
        response.address.should.equal(testKeys.a.address)
        response.claims.should.be.an('array')
      })
  })

  it('getWalletDBHeight returns height number', () => {
    return kryptonDB.getWalletDBHeight('TestNet')
      .then((response) => {
        response.should.equal(850226)
      })
  })

  it('getTransactionHistory returns history', () => {
    return kryptonDB.getTransactionHistory('TestNet', testKeys.a.address)
      .then((response) => {
        response.should.be.an('array')
        response.map(tx => {
          tx.should.have.keys(['change', 'blockHeight', 'txid'])
        })
      })
  })

  it('should allow custom API endpoint, i.e. for private net', done => {
    const customEndpoint = 'http://localhost:5000'
    const privNet = kryptonDB.getAPIEndpoint(customEndpoint)
    privNet.should.equal(customEndpoint)
    done()
  })
})
