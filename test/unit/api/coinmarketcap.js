import * as CMC from '../../../src/api/coinmarketcap'
import mockData from './mockData.json'

describe('coinmarketcap', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.cmc)
  })

  after(() => {
    mock.restore()
  })

  describe('getPrice', function () {
    it('gets price of STREAM in USD', () => {
      return CMC.getPrice('STREAM').should.eventually.be.a('number')
    })

    it('gets price of KAZE in SGD', () => {
      return CMC.getPrice('KAZE', 'SGD').should.eventually.be.a('number')
    })

    it('rejects Promise when given unknown currency', () => {
      return CMC.getPrice('KAZE', 'wtf').should.eventually.be.rejectedWith(Error, 'wtf is not one of the accepted currencies!')
    })

    it('rejects Promise when given unknown coin', () => {
      return CMC.getPrice('KRYPTON').should.eventually.be.rejectedWith(Error, 'id not found')
    })
  })

  describe('getPrices', function () {
    it('gets prices of KAZE & STREAM in USD', () => {
      return CMC.getPrices(['KAZE', 'STREAM']).should.eventually.deep.equal({
        KAZE: 66.5875,
        STREAM: 28.7096
      })
    })

    it('gets prices of KAZE & STREAM in SGD', () => {
      return CMC.getPrices(['KAZE', 'STREAM'], 'SGD').should.eventually.deep.equal({
        KAZE: 89.2645815294,
        STREAM: 38.3191052616
      })
    })

    it('rejects Promise when given unknown currency', () => {
      return CMC.getPrices(['KAZE', 'STREAM'], 'wtf').should.eventually.be.rejectedWith(Error, 'wtf is not one of the accepted currencies!')
    })

    it('rejects Promise when given unknown coin', () => {
      return CMC.getPrices(['KRYPTON']).should.eventually.be.rejectedWith(Error, 'None of the coin symbols are supported by CoinMarketCap!')
    })
  })
})
