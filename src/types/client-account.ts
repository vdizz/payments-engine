export interface Transaction {
  type: 'deposit' | 'withdraw' | 'dispute' | 'resolve' | 'chargeback'
  client: number
  tx: number
  amount: number
}

export interface ClientRecord {
  type: 'deposit' | 'withdraw' | 'dispute' | 'resolve' | 'chargeback'
  transactionId: number
  amount: number
  disputed?: boolean
}

export interface ClientInfo {
  id: number
  availableFunds: number
  heldFunds: number
  total: number
  isLocked: boolean
  transactionHistory: Array<ClientRecord>
}
