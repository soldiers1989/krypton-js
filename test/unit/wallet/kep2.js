import * as KEP2 from '../../../src/wallet/kep2'
import { isKEP2, isWIF } from '../../../src/wallet/verify'
import testKeys from '../testKeys.json'

describe('KEP2', function () {
  const simpleScrypt = {
    cost: 256,
    blockSize: 1,
    parallel: 1,
    size: 64
  }

  describe('Basic (KEP2)', function () {
    this.timeout(0)
    let encrypted
    it('encrypt', () => {
      encrypted = KEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase)
      isKEP2(encrypted).should.equal(true)
      encrypted.should.equal(testKeys.a.encryptedWif)
    })

    it('decrypt', () => {
      const wif = KEP2.decrypt(encrypted, testKeys.a.passphrase)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Non-english', function () {
    let encrypted
    let asyncEncrypted
    const passphrase = testKeys.b.passphrase

    it('encrypt', () => {
      encrypted = KEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      isKEP2(encrypted).should.equal(true)
    })

    it('encryptAsync', async () => {
      const encryptedKey = await KEP2.encryptAsync(testKeys.a.wif, passphrase, simpleScrypt)
      asyncEncrypted = encryptedKey
      return isKEP2(asyncEncrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = KEP2.decrypt(encrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })

    it('decryptAsync', async () => {
      const wif = await KEP2.decryptAsync(asyncEncrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      return wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Symbols', function () {
    let encrypted
    let asyncEncrypted
    const passphrase = testKeys.c.passphrase

    it('encrypt', () => {
      encrypted = KEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      isKEP2(encrypted).should.equal(true)
    })

    it('encryptAsync', async () => {
      const encryptedKey = await KEP2.encryptAsync(testKeys.a.wif, passphrase, simpleScrypt)
      asyncEncrypted = encryptedKey
      return isKEP2(asyncEncrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = KEP2.decrypt(encrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })

    it('decryptAsync', async () => {
      const wif = await KEP2.decryptAsync(asyncEncrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      return wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Error', function () {
    const encrypted = KEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase, simpleScrypt)

    it('Errors on wrong password (sync)', () => {
      const thrower = () => KEP2.decrypt(encrypted, 'wrongpassword', simpleScrypt)
      thrower.should.throw()
    })
    it('Errors on wrong scrypt params (sync)', () => {
      const thrower = () => KEP2.decrypt(testKeys.a.encryptedWif, testKeys.a.passphrase, simpleScrypt)
      thrower.should.throw()
    })

    it('Errors on wrong password (async)', () => {
      const thrower = KEP2.decryptAsync(encrypted, 'wrongpassword', simpleScrypt)
      return thrower.should.be.rejectedWith(Error, 'Wrong Password')
    })

    it('Errors on wrong scrypt params (async)', () => {
      const thrower = KEP2.decryptAsync(testKeys.a.encryptedWif, testKeys.a.passphrase, simpleScrypt)
      return thrower.should.be.rejectedWith(Error, `scrypt parameters`)
    })
  })
})
