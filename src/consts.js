
export const ADDR_VERSION = '2d'

export const ASSETS = {
  KAZE: 'KAZE',
  'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17': 'KAZE',
  STREAM: 'STREAM',
  '9d2593e23db5e8946969a16d1980ee57e04bb25904bb0ca0d181257eb48a539': 'STREAM'
}

export const ASSET_ID = {
  KAZE: 'f1fee7945e5ba7fed56272b916094ed8f384a94e63d5f8d81214dfde489ffb17',
  STREAM: '9d2593e23db5e8946969a16d1980ee57e04bb25904bb0ca0d181257eb48a539'
}

export const CONTRACTS = {
  RPX: 'ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9',
  TEST_RPX: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
  TEST_LWTF: 'd7678dd97c000be3f33e9362e673101bac4ca654',
  TEST_NXT: '0b6c1f919e95fe61c17a7612aebfaf4fda3a2214',
  TEST_RHTT4: 'f9572c5b119a6b5775a6af07f1cef5d310038f55'
}

export const DEFAULT_RPC = {
  MAIN: 'http://node1.kaze.solutions:22886',
  TEST: 'http://node1.kaze.solutions:44886'
}

export const DEFAULT_REQ = { jsonrpc: '2.0', method: 'getblockcount', params: [], id: 1234 }

export const DEFAULT_SCRYPT = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
}

export const DEFAULT_SYSFEE = {
  enrollmentTransaction: 1000,
  issueTransaction: 500,
  publishTransaction: 500,
  registerTransaction: 10000
}

export const DEFAULT_WALLET = {
  name: 'myWallet',
  version: '1.0',
  scrypt: {},
  accounts: [],
  extra: null
}

export const DEFAULT_ACCOUNT_CONTRACT = {
  'script': '',
  'parameters': [
    {
      'name': 'signature',
      'type': 'Signature'
    }
  ],
  'deployed': false
}

export const KAZE_NETWORK = {
  MAIN: 'MainNet',
  TEST: 'TestNet'
}

// specified by kep2, same as bip38
export const KEP_HEADER = '0142'

export const KEP_FLAG = 'e0'

export const RPC_VERSION = '2.3.2'

export const TX_VERSION = {
  'CLAIM': 0,
  'CONTRACT': 0,
  'INVOCATION': 1
}
