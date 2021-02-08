import fs from 'fs'
import csv from 'csv-parser'
import { Transaction } from '../types/client-account'

export function loadTransactions(): Promise<Array<Transaction>> {
  const transactions: Array<Transaction> = []
  const filePath: string = process.argv[2]

  if (!fs.existsSync(filePath)) throw new Error('File Not Found')

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          mapValues: ({ index, value }) => {
            if (index === 0) return value.trim().toLowerCase()

            // If the transaction value does not resolve to a number, throw an error
            return Number(value.trim()) || reject(`Invalid transaction value in column ${index + 1}`)
          }
        })
      )
      .on('error', error => {
        reject(error)
      })
      .on('data', (transaction: Transaction) => {
        transactions.push(transaction)
      })
      .on('end', () => {
        resolve(transactions)
      })
  })
}
