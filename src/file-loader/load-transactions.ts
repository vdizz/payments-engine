import fs from 'fs'
import csv from 'csv-parser'
import { Transaction } from '../types/client-account'

export function loadTransactions(): Promise<Array<Transaction>> {
  const transactions: Array<Transaction> = []
  const filePath: string = process.argv[2]

  if (!fs.existsSync(filePath)) throw new Error('Invalid File Uploaded')

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .on('error', error => {
        reject(error)
      })
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          mapValues: ({ index, value }) => {
            if (index === 0) return value.trim().toLowerCase()

            return Number(value.trim())
          }
        })
      )
      .on('data', (transaction: Transaction) => {
        transactions.push(transaction)
      })
      .on('end', () => {
        resolve(transactions)
      })
  })
}
