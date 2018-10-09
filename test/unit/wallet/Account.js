import Account from '../../../src/wallet/Account'
import testWallet from './testWallet.json'

describe('Account', function () {
  const acct = {
    encrypted: '6PYWVp3xfXQfKY4S14738y8iDqm29gwnzZ86pQ8sMeUtkrzVe4zfzRuv31',
    WIF: 'L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG',
    privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
    publicKey: '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9',
    publicKeyUnencoded: '041d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c94617303f7408d9abfedfb6fbb00dd07e3e7735d918bbea7a7e2c1895ea1bc9b9',
    scriptHash: '5df31f6f59e6a4fbdd75103786bf73db1000b235',
    address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s'
  }

  const scryptParams = {
    cost: 256,
    blockSize: 1,
    parallel: 1
  }

  const keyphrase = 'thisisakeyphrase'
  describe('Constructor', function () {
    it('can be created with different formats', () => {
      Object.keys(acct).map((key) => {
        const a = new Account(acct[key])
        a.should.not.equal(undefined)
        if (key === 'publicKeyUnencoded') {
          a.publicKey.should.equal(acct.publicKey)
          return
        }
        a[key].should.equal(acct[key])
      })
    })

    it('can be created from Wallet Account object', () => {
      const walletAcct = testWallet.accounts[0]
      const a = new Account(walletAcct)
      a.should.not.equal(undefined)
      a.encrypted.should.equal(walletAcct.key)
      a.address.should.equal(walletAcct.address)
    })

    it('exports to a Wallet Account object', () => {
      const walletAcct = testWallet.accounts[0]
      const a = new Account(walletAcct)
      const result = a.export()
      result.should.eql(testWallet.accounts[0])
    })

    it('Accepts both public key forms', () => {
      const a = new Account(acct.publicKeyUnencoded)
      a.address.should.equal(acct.address)
      a.publicKey.should.equal(acct.publicKey)
      a.getPublicKey(false).should.equal(acct.publicKeyUnencoded)
      a.getPublicKey(true).should.equal(acct.publicKey)
    })

    it('Accepts a partial Account object and setup defaults', () => {
      const result = new Account({
        key: acct.encrypted,
        address: acct.address
      })
      result.label.should.equal(acct.address)
      result.isDefault.should.equal(false)
      result.lock.should.equal(false)
      result.contract.should.eql({
        script: '',
        parameters: [{ name: 'signature', type: 'Signature' }],
        deployed: false
      })
    })
  })

  it('can query different key formats', () => {
    const a = new Account(acct.WIF)
    a.should.not.equal(undefined)
    a.privateKey.should.equal(acct.privateKey)
    a.publicKey.should.equal(acct.publicKey)
    a.scriptHash.should.equal(acct.scriptHash)
    a.address.should.equal(acct.address)
  })

  it('encrypts the key', () => {
    const a = new Account(acct.WIF)
    a.encrypt(keyphrase, scryptParams)
    a.encrypted.should.equal(acct.encrypted)
  })

  it('decrypts the key', () => {
    const a = new Account(acct.encrypted)
    a.decrypt(keyphrase, scryptParams)
    a.WIF.should.equal(acct.WIF)
  })

  it('throws error when insufficient information given', () => {
    const a = new Account(acct.address)
    const thrower = () => a.privateKey
    thrower.should.throw()
  })

  describe('Multisig', () => {
    it('createMultiSig(less than 16)', () => {
      const threshold = 2
      const publicKeys = [
        '02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef',
        '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9',
        '02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa'
      ]

      const result = Account.createMultiSig(threshold, publicKeys)
      result.address.should.equal('ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd')
      result.contract.script.should.equal('522102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa53ae')
    })

    it('createMultiSig(more than 16)', () => {
      const threshold = 17
      const publicKeys = [
        '02019a1a66c13311bf97534b2a563f9a1836855a6786c7129ceb5a062e3ca3f514',
        '0313b4274044e44b36c2d6c456ed78780c6a24bf9b62ea081f6503f19c1fbef0ad',
        '022aae92683dc6936312c75d27bf8f7110a4a42a5d715c2c63b9483a2ac525f8bd',
        '022e57d04af639405d352ddaf0b1499f29e438fb78dacafbddb17c9a1817b6e367',
        '0238ed4dea9df79805e265452ebe28da582a3b4c38636671e515d4c02b255bd5de',
        '02392acac4b678a2c8088025e83f19e6dc6e24a6fa25ddbda13c3c905fbad2acc0',
        '03436846c527c02c79b61e3f4727ab029b04a1ac7847d36efbb2e1fe9d593f6547',
        '024f9d1be2b30e724cff20215a307aabd7d718a90ed42e5f64fcf7954762d6ca74',
        '0258e57f0350730befb2fbcd8a6f5fef6dd4dc143207d486e16a4d694a87f806f4',
        '0369507b2bd96e79e4d201ed4345a6010ff3bbf2f4c68966414751b1b6f88daf5f',
        '026de9edd43d92ddcb018e6ec58309bfe99be00d0a4e12b1819b15baa75de23208',
        '037845a53d5cc53347e41a22937c0a9e82291f88363fcf99a13a7a12cf1613c468',
        '027c39729410040d8b3977cf19320a997f6e5a1c9895454c9993e26f59544405c5',
        '02a16bd9140780909eb4d86f44060a963b8988fbaea601336a5a92942e82b0c1e6',
        '03b3c4ccce56af5e066583620cac2e507dc5c47058c7a92a97ea122dc47ebb8411',
        '03bbb2f2cc850537818515da29d7dab0ee75be5ee1e65d9e2c26cdc15ac504a2b7',
        '03c73ce19147500f30bc075f134d2ad715ce4dfa5d6c13c8e5584816438b7529fb',
        '02de3a4cfa86aa62ab4784be7b08d3528cf52f19781dc4f043bceed407536ef97a',
        '03f85d0cbd392dac4647a313564d9426016f42a0ba89cf2fc0f6903528ec2d92e8',
        '03ff7fd8eccae93001919460e5cae6325f0ff832e8977e3276efd155ba3a27f6e7'
      ]

      const result = Account.createMultiSig(threshold, publicKeys)
      result.contract.script.should.equal('01112102019a1a66c13311bf97534b2a563f9a1836855a6786c7129ceb5a062e3ca3f514210313b4274044e44b36c2d6c456ed78780c6a24bf9b62ea081f6503f19c1fbef0ad21022aae92683dc6936312c75d27bf8f7110a4a42a5d715c2c63b9483a2ac525f8bd21022e57d04af639405d352ddaf0b1499f29e438fb78dacafbddb17c9a1817b6e367210238ed4dea9df79805e265452ebe28da582a3b4c38636671e515d4c02b255bd5de2102392acac4b678a2c8088025e83f19e6dc6e24a6fa25ddbda13c3c905fbad2acc02103436846c527c02c79b61e3f4727ab029b04a1ac7847d36efbb2e1fe9d593f654721024f9d1be2b30e724cff20215a307aabd7d718a90ed42e5f64fcf7954762d6ca74210258e57f0350730befb2fbcd8a6f5fef6dd4dc143207d486e16a4d694a87f806f4210369507b2bd96e79e4d201ed4345a6010ff3bbf2f4c68966414751b1b6f88daf5f21026de9edd43d92ddcb018e6ec58309bfe99be00d0a4e12b1819b15baa75de2320821037845a53d5cc53347e41a22937c0a9e82291f88363fcf99a13a7a12cf1613c46821027c39729410040d8b3977cf19320a997f6e5a1c9895454c9993e26f59544405c52102a16bd9140780909eb4d86f44060a963b8988fbaea601336a5a92942e82b0c1e62103b3c4ccce56af5e066583620cac2e507dc5c47058c7a92a97ea122dc47ebb84112103bbb2f2cc850537818515da29d7dab0ee75be5ee1e65d9e2c26cdc15ac504a2b72103c73ce19147500f30bc075f134d2ad715ce4dfa5d6c13c8e5584816438b7529fb2102de3a4cfa86aa62ab4784be7b08d3528cf52f19781dc4f043bceed407536ef97a2103f85d0cbd392dac4647a313564d9426016f42a0ba89cf2fc0f6903528ec2d92e82103ff7fd8eccae93001919460e5cae6325f0ff832e8977e3276efd155ba3a27f6e70114ae')
      result.address.should.equal('AdcARJbSyEahTtC7iCPwv45oVhXw6SQJcY')
      result.contract.parameters.length.should.equal(threshold)
    })

    it('isMultiSig returns true for multisig accounts', () => {
      const result = new Account({
        address: 'ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd',
        contract: {
          script:
            '522102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa53ae',
          parameters: [
            { name: 'parameter0', type: 'Signature' },
            { name: 'parameter1', type: 'Signature' }
          ],
          deployed: false
        }
      })
      result.isMultiSig.should.equal(true)
    })

    it('isMultiSig returns false for normal accounts', () => {
      const result = new Account('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      console.log(result.contract)
      console.log(result.contract.script)
      console.log(result.isMultiSig)
      result.isMultiSig.should.equal(false)
    })
  })
})
