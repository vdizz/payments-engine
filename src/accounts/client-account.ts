import { ClientRecord } from '../types/client-account'

export class Client {
  private id: string
  private availableFunds: number = 0
  private heldFunds: number = 0
  private isLocked: boolean = false
  private transactionHistory: Array<ClientRecord> = []

  constructor(id: string) {
    this.id = id
  }

  deposit(amount: number, tx: number): void {
    this.availableFunds += amount
    this.transactionHistory.push({ type: 'deposit', amount, tx, disputed: false })
  }

  withdraw(amount: number, tx: number): void {
    if (this.availableFunds >= amount) {
      this.availableFunds -= amount
    }
    this.transactionHistory.push({ type: 'withdraw', amount, tx, disputed: false })
  }

  dispute(tx: number): void {
    const transactionIndex = this.transactionHistory.findIndex(record => record.tx === tx)
    if (transactionIndex !== -1) {
      const { type, amount } = this.transactionHistory[transactionIndex]
      this.transactionHistory[transactionIndex].disputed = true
      if (type === 'deposit') this.availableFunds -= amount
      this.heldFunds += amount
      this.transactionHistory.push({ type: 'dispute', tx, amount })
    }
  }

  resolve(tx: number): void {
    const disputedIndex = this.transactionHistory.findIndex(record => record.tx === tx && record.disputed)
    if (disputedIndex !== -1) {
      const { amount } = this.transactionHistory[disputedIndex]
      this.transactionHistory[disputedIndex].disputed = false
      this.availableFunds += amount
      this.heldFunds -= amount
      this.transactionHistory.push({ type: 'resolve', tx, amount })
    }
  }

  chargeback(tx: number): void {
    const disputedIndex = this.transactionHistory.findIndex(record => record.tx === tx && record.disputed)
    if (disputedIndex !== -1) {
      const { amount } = this.transactionHistory[disputedIndex]
      this.transactionHistory[disputedIndex].disputed = false
      this.heldFunds -= amount
      this.lockAccount()
      this.transactionHistory.push({ type: 'chargeback', tx, amount })
    }
  }

  lockAccount(): void {
    this.isLocked = true
  }

  unlockAccount(): void {
    this.isLocked = false
  }

  getTotalFunds(): number {
    return this.availableFunds + this.heldFunds
  }

  getClientInfo(): string {
    return `${this.id},${+this.availableFunds.toFixed(4)},${+this.heldFunds.toFixed(4)},${+this.getTotalFunds().toFixed(
      4
    )},${this.isLocked}`
  }
}
