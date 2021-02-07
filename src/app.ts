import { loadTransactions } from './file-loader/load-transactions'
import { Client } from './accounts/client-account'
import { Transaction } from './types/client-account'

async function run(): Promise<void> {
  try {
    const transactions = await loadTransactions()
    const resolvedClients = executeClientTransactions(transactions)
    generateOutput(resolvedClients)
  } catch (error) {
    console.log('Error processing file: ', { error })
  }
}

function executeClientTransactions(transactions: Array<Transaction>): Array<Client> {
  const clients: Array<Client> = []

  transactions.forEach((transaction: Transaction) => {
    const { type, client, amount, tx } = transaction
    const foundClient = clients.find(cli => cli.id === client)
    const clientRef = foundClient || new Client(client)

    if (type === 'deposit') clientRef.deposit(tx, amount)
    if (type === 'withdraw') clientRef.withdraw(tx, amount)
    if (type === 'dispute') clientRef.dispute(tx)
    if (type === 'resolve') clientRef.resolve(tx)
    if (type === 'chargeback') clientRef.chargeback(tx)

    if (!foundClient) clients.push(clientRef)
  })

  return clients
}

function generateOutput(clients: Array<Client>) {
  console.log('client,available,held,total,locked')
  clients.forEach(client => {
    const { id, availableFunds, heldFunds, total, isLocked } = client.getClientInfo()
    console.log(`${id},${availableFunds},${heldFunds},${total},${isLocked}`)
  })
}

run()
