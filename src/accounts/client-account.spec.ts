import { Client } from './client-account'

describe('Client', () => {
  let client: Client

  beforeEach(() => {
    client = new Client(1)
  })

  describe('getClientInfo()', () => {
    it('should return a client object', () => {
      const clientInfo = client.getClientInfo()
      expect(clientInfo).toMatchObject({
        id: 1,
        availableFunds: 0,
        heldFunds: 0,
        total: 0,
        isLocked: false,
        transactionHistory: []
      })
    })
  })
  describe('deposit()', () => {
    it('should deposit funds into a clients account', () => {
      client.deposit(1, 3.52)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(3.52)
      expect(heldFunds).toBe(0)
      expect(total).toBe(3.52)
    })
  })
  describe('withdraw()', () => {
    it('should withdraw funds from a clients account', () => {
      client.deposit(1, 7.23)
      client.withdraw(2, 3.11)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(4.12)
      expect(heldFunds).toBe(0)
      expect(total).toBe(4.12)
    })
    it('should fail to withdraw if there are insufficient available funds', () => {
      client.deposit(1, 5.25)
      client.withdraw(2, 10)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(5.25)
      expect(heldFunds).toBe(0)
      expect(total).toBe(5.25)
    })
  })
  describe('dispute()', () => {
    it('should dispute a deposit and transfer funds to held', () => {
      client.deposit(1, 6.52)
      client.deposit(2, 3.03)
      client.dispute(1)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(3.03)
      expect(heldFunds).toBe(6.52)
      expect(total).toBe(9.55)
    })
    it('should dispute a withdrawal and transfer funds to held', () => {
      client.deposit(1, 6.52)
      client.withdraw(2, 3.03)
      client.dispute(2)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(3.49)
      expect(heldFunds).toBe(3.03)
      expect(total).toBe(6.52)
    })
    it('should ignore dispute if transaction id does not exist', () => {
      client.deposit(1, 500)
      client.withdraw(2, 300)
      client.dispute(3)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(200)
      expect(heldFunds).toBe(0)
      expect(total).toBe(200)
    })
  })
  describe('resolve()', () => {
    it('should resolve a dispute and transfer held funds to available', () => {
      client.deposit(1, 1.50523)
      client.dispute(1)
      client.resolve(1)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(1.5052)
      expect(heldFunds).toBe(0)
      expect(total).toBe(1.5052)
    })
    it('should ignore resolve if transaction id does not exist', () => {
      client.deposit(1, 1.50523)
      client.dispute(1)
      client.resolve(2)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(0)
      expect(heldFunds).toBe(1.5052)
      expect(total).toBe(1.5052)
    })
    it('should ignore resolve if transaction id is not in dispute', () => {
      client.deposit(1, 1.50523)
      client.resolve(1)

      const { availableFunds, heldFunds, total } = client.getClientInfo()
      expect(availableFunds).toBe(1.5052)
      expect(heldFunds).toBe(0)
      expect(total).toBe(1.5052)
    })
  })
  describe('chargeback()', () => {
    it('should initiate a chargeback and lock the account', () => {
      client.deposit(1, 3.02)
      client.dispute(1)
      client.chargeback(1)

      const { availableFunds, heldFunds, total, isLocked } = client.getClientInfo()
      expect(availableFunds).toBe(0)
      expect(heldFunds).toBe(0)
      expect(total).toBe(0)
      expect(isLocked).toBeTruthy()
    })
    it('should ignore chargeback if transaction id does not exist', () => {
      client.deposit(1, 3.02)
      client.dispute(1)
      client.chargeback(2)

      const { availableFunds, heldFunds, total, isLocked } = client.getClientInfo()
      expect(availableFunds).toBe(0)
      expect(heldFunds).toBe(3.02)
      expect(total).toBe(3.02)
      expect(isLocked).toBeFalsy()
    })
    it('should ignore chargeback if transaction is not in dispute', () => {
      client.deposit(1, 3.02)
      client.chargeback(1)

      const { availableFunds, heldFunds, total, isLocked } = client.getClientInfo()
      expect(availableFunds).toBe(3.02)
      expect(heldFunds).toBe(0)
      expect(total).toBe(3.02)
      expect(isLocked).toBeFalsy()
    })
  })
  describe('getTotalFunds()', () => {
    it('should get the total funds in an account', () => {
      client.deposit(1, 5.25)
      client.deposit(2, 3.75)
      client.dispute(2)
      client.withdraw(4, 1.02)

      const total = client.getTotalFunds()
      expect(total).toBe(7.98)
    })
  })
})
