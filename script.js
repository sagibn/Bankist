'use strict';

//Accounts
const account1 = {
  owner: 'Sagi Ben Noon',
  movements: [700, 1500, -1000, 225, -50, 900],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'John Levi',
  movements: [2000, 2500, -1100, -120, 400, -500, 1000, -800],
  interestRate: 1.5, // %
  pin: 2222,
};

const account3 = {
  owner: 'Barak Cohen',
  movements: [7000, -5000, 500, -153, -12, -70, -900, -1500, 2000],
  interestRate: 1.1, // %
  pin: 3333,
};

const account4 = {
  owner: 'Tal Mor',
  movements: [1000, 1500, 1000, -2000, 4000, -2000],
  interestRate: 1.6, // %
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance-amount');
const labelSumIn = document.querySelector('.summary-value-in');
const labelSumOut = document.querySelector('.summary-value-out');
const labelSumInterest = document.querySelector('.summary-value-interest');
const labelTimer = document.querySelector('.timer');

const btnLogin = document.querySelector('.login-btn');
const btnTransfer = document.querySelector('.form-btn-transfer');
const btnLoan = document.querySelector('.form-btn-loan');
const btnClose = document.querySelector('.form-btn-close');
const btnSort = document.querySelector('.btn-sort');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movement');

const inputUsername = document.querySelector('.login-user');
const inputPassword = document.querySelector('.login-pin');
const inputTransferTo = document.querySelector('.form-input-to');
const inputTransferAmount = document.querySelector('.form-input-amount');
const inputLoanAmount = document.querySelector('.form-input-loan-amount');
const inputCloseUsername = document.querySelector('.form-input-user');
const inputClosePassword = document.querySelector('.form-input-pin');

//Currencies
const currencies = new Map([
  ['ILS', 'New Israeli Shekel'],
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
]);
