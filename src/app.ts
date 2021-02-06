import { loadTransactions } from './file-loader/load-transactions'
import { Client } from './accounts/client-account'
import { Transaction, ClientGroup } from './types/client-account'

async function run(): Promise<void> {
  try {
    const transactions = await loadTransactions()
    const clients = groupClients(transactions)
    const resolvedClients = executeClientTransactions(clients)
    generateOutput(resolvedClients)
  } catch (error) {
    console.log('Error processing file: ', { error })
  }
}

function groupClients(transactions: Array<Transaction>): ClientGroup {
  return transactions.reduce((clients: ClientGroup, transaction) => {
    const client = clients[transaction.client] || []
    client.push(transaction)

    clients[transaction.client] = client
    return clients
  }, {})
}

function executeClientTransactions(clients: ClientGroup): Array<Client> {
  const completedAccounts: Array<Client> = []
  for (const clientId in clients) {
    const client = new Client(clientId)

    clients[clientId].forEach((transaction: Transaction) => {
      const { type, amount, tx } = transaction

      if (type === 'deposit') client.deposit(amount, tx)
      if (type === 'withdraw') client.withdraw(amount, tx)
      if (type === 'dispute') client.dispute(tx)
      if (type === 'resolve') client.resolve(tx)
      if (type === 'chargeback') client.chargeback(tx)
    })
    completedAccounts.push(client)
  }

  return completedAccounts
}

function generateOutput(clients: Array<Client>) {
  console.log('client,available,held,total,locked')
  clients.forEach(client => {
    console.log(client.getClientInfo())
  })
}

run()
