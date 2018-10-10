import { Account } from "./wallet"

export const ADDR_VERSION = '2d'

export namespace ASSETS {
  export const KAZE: string
  export const STREAM: string
}

export namespace ASSET_ID {
  export const KAZE: string
  export const STREAM: string
}

export namespace CONTRACTS {
  export const RPX: string
  export const TEST_RPX: string
  export const TEST_LWTF: string
  export const TEST_NXT: string
  export const TEST_RHTT4: string
}

export namespace DEFAULT_RPC {
  export const MAIN: string
  export const TEST: string
}

export const DEFAULT_REQ: {
  jsonrpc: string
  method: string
  params: any[]
  id: number
}

export const DEFAULT_SCRYPT: {
  cost: number
  blockSize: number
  parallel: number
  size: number
}

export const DEFAULT_WALLET: {
  name: string
  version: string,
  scrypt: object
  accounts: Account[]
  extra: any
}

export const DEFAULT_ACCOUNT_CONTRACT: {
  script: string
  parameters: any[]
  deployed: boolean
}

export const DEFAULT_PRICE: {
  data: any[]
}

export namespace KAZE_NETWORK {
  export const MAIN: string
  export const TEST: string
}

export const KEP_HEADER: string

export const KEP_FLAG: string

export const RPC_VERSION: string

export namespace TX_VERSION {
  export const CLAIM: number
  export const CONTRACT: number
  export const INVOCATION: number
}

export as namespace CONST

