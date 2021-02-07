import { ClientRecord, ClientInfo } from '../types/client-account'

export class Client {
  private availableFunds: number = 0
  private heldFunds: number = 0
  private isLocked: boolean = false
  private transactionHistory: Array<ClientRecord> = []
  public id: number

  constructor(id: number) {
    this.id = id
  }

  deposit(transactionId: number, amount: number): void {
    this.availableFunds += amount
    this.transactionHistory.push({ type: 'deposit', amount, transactionId, disputed: false })
  }

  withdraw(transactionId: number, amount: number): void {
    if (this.availableFunds < amount) return

    this.availableFunds -= amount
    this.transactionHistory.push({ type: 'withdraw', amount, transactionId, disputed: false })
  }

  dispute(transactionId: number): void {
    const transactionIndex = this.transactionHistory.findIndex(record => record.transactionId === transactionId)
    if (transactionIndex === -1) return

    const { type, amount } = this.transactionHistory[transactionIndex]
    if (type === 'deposit') this.availableFunds -= amount
    this.heldFunds += amount
    this.transactionHistory[transactionIndex].disputed = true
    this.transactionHistory.push({ type: 'dispute', transactionId, amount })
  }

  resolve(transactionId: number): void {
    const disputedIndex = this.transactionHistory.findIndex(
      record => record.transactionId === transactionId && record.disputed
    )
    if (disputedIndex === -1) return

    const { amount } = this.transactionHistory[disputedIndex]
    this.availableFunds += amount
    this.heldFunds -= amount
    this.transactionHistory[disputedIndex].disputed = false
    this.transactionHistory.push({ type: 'resolve', transactionId, amount })
  }

  chargeback(transactionId: number): void {
    const disputedIndex = this.transactionHistory.findIndex(
      record => record.transactionId === transactionId && record.disputed
    )
    if (disputedIndex === -1) return

    const { amount } = this.transactionHistory[disputedIndex]
    this.heldFunds -= amount
    this.isLocked = true
    this.transactionHistory[disputedIndex].disputed = false
    this.transactionHistory.push({ type: 'chargeback', transactionId, amount })
  }

  getTotalFunds(): number {
    return this.availableFunds + this.heldFunds
  }

  getClientInfo(): ClientInfo {
    return {
      id: this.id,
      availableFunds: +this.availableFunds.toFixed(4),
      heldFunds: +this.heldFunds.toFixed(4),
      total: +this.getTotalFunds().toFixed(4),
      isLocked: this.isLocked,
      transactionHistory: this.transactionHistory
    }
  }
}
