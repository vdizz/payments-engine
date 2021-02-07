# payments-engine

A simple payments system for processessing financial transactions.

This program will accept a CSV file of transactions to update client accounts and output a final state of each account.

Supported transaction options: `deposit`, `withdraw`, `dispute`, `resolve`, `chargeback`

---

## Quick Start

- First run `npm install` to build the project
- Navigate to the `src` directory and run:

```
    npx ts-node app.ts {{your-file}}.csv
```

- If you have `ts-node` globally installed, the command can be run without `npx`

```
    ts-node app.ts {{your-file}}.csv
```

- Example:

```
    ts-node app.ts test-data/deposit-withdraw.csv > output.csv
```

## Notes & Assumptions

- It's assumed the csv input file will have the correct headers `type,client,tx,amount`
- The CSV will be rejected if the `client`,`tx` or `amount` columns do not resolve to a valid number
- Transactions are processed in the order which they are received by transaction ID (`tx`)
- A dispute can result in a negative fund total (if it's run after a withdrawal for instance)
- After a client account receives a valid chargeback, it's expected that they won't receive any follow-up transactions

## Unit Tests via Jest

- `npm run test`

## Sample Data

---

Example Input: `test-data/deposit-withdraw.csv`

```
type,client,tx,amount
deposit,1,1,1.0000
deposit,2,2,2.0
deposit,1,3,2.0
withdraw,1,4,1.5
withdraw,2,5,3.0
```

Expected Output:

```
client,available,held,total,locked
1,1.5,0,1.5,false
2,2,0,2,false
```

---

Example Input: `test-data/dispute.csv`

```
type,client,tx,amount
deposit,1,1,1.0
deposit,2,2,5.50
deposit,1,3,2.0
withdrawal,1,4,1.5245
dispute,1,3
withdrawal,2,6,3.0
dispute,1,4
withdrawal,2,8,67.00
withdrawal,2,9,1.2
```

Expected Output:

```
client,available,held,total,locked
1,1,2,3,false
2,5.5,0,5.5,false
```

---

Example Input: `test-data/chargeback-resolve.csv`

```
type,client,tx,amount
deposit,2,1,5.01
deposit,1,2,1.50523
deposit,1,3,3.50444
deposit,2,4,12.70
chargeback,1,1
dispute,1,2
dispute,2,1
resolve,1,2
chargeback,2,1
```

Expected Output:

```
client,available,held,total,locked
2,12.7,0,12.7,true
1,5.0097,0,5.0097,false
```
