var Krypton = require('../lib/index')

const contractHash = 'ae36e5a84ee861200676627df409b0f6eec44bd7'

const config = {
  net: 'TestNet',
  account: new Krypton.wallet.Account('L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG'),
  intents: Krypton.api.makeIntent({ STREAM: 1 }, Krypton.wallet.getAddressFromScriptHash(contractHash)),
  script: {
    scriptHash: contractHash,
    operation: 'mintTokens',
    args: []
  },
  stream: 0
}

Krypton.api.doInvoke(config)
  .then(res => {
    console.log(res)
  })
  .catch(err => console.log(err))
