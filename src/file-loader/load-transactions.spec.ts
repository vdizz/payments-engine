import { loadTransactions } from './load-transactions'

describe('load-transactions', () => {
  it('should throw an error if the transaction file does not exist in fs', () => {
    try {
      loadTransactions()
    } catch (error) {
      expect(error.message).toBe('Invalid File Uploaded')
    }
  })
})
