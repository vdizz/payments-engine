export interface Transaction {
  type: 'deposit' | 'withdraw' | 'dispute' | 'resolve' | 'chargeback'
  client: number
  tx: number
  amount: number
}

export interface ClientRecord {
  type: 'deposit' | 'withdraw' | 'dispute' | 'resolve' | 'chargeback'
  tx: number
  amount: number
  disputed?: boolean
}

export interface ClientGroup {
  [key: number]: Array<Transaction>
}
