
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

export const DEFAULT_PRICE = {
  'data':[
    {
        "id": "kaze", 
        "name": "KAZE", 
        "symbol": "KAZE", 
        "rank": "1", 
        "price_usd": "0.3", 
        "price_btc": "0.000047", 
        "24h_volume_usd": "3744314339.06", 
        "market_cap_usd": "113625509468", 
        "available_supply": "17314662.0", 
        "total_supply": "100000000.0", 
        "max_supply": "15000000.0", 
        "percent_change_1h": "-0.18", 
        "percent_change_24h": "-0.8", 
        "percent_change_7d": "1.04", 
        "last_updated": "1539181526", 
        "price_chf": "0.3", 
        "24h_volume_chf": "3706901150.18", 
        "market_cap_chf": "112490163378"
    }, 
    {
        "id": "stream", 
        "name": "STREAM", 
        "symbol": "STREAM", 
        "rank": "2", 
        "price_usd": "0.1", 
        "price_btc": "0.000016", 
        "24h_volume_usd": "1349407304.26", 
        "market_cap_usd": "23158602357.0", 
        "available_supply": "4084786.0", 
        "total_supply": "100000000.0", 
        "max_supply": "100000000.0", 
        "percent_change_1h": "-0.22", 
        "percent_change_24h": "-0.44", 
        "percent_change_7d": "2.79", 
        "last_updated": "1539181536", 
        "price_chf": "0.16", 
        "24h_volume_chf": "1335924026.48", 
        "market_cap_chf": "22927201603.0"
    }
  ]
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
