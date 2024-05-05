'use strict';

//Accounts
const account1 = {
  owner: 'Sagi Ben Noon',
  movements: [700, 1500, -1000, 225, -50, 900],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'ILS',
  balance: 10000,
};

const account2 = {
  owner: 'John Levi',
  movements: [2000, 2500, -1100, -120, 400, -500, 1000, -800],
  interestRate: 1.5, // %
  pin: 2222,
  currency: 'ILS',
  balance: 5500,
};

const account3 = {
  owner: 'Barak Cohen',
  movements: [7000, -5000, 500, -153, -12, -70, -900, -1500, 2000],
  interestRate: 1.1, // %
  pin: 3333,
  currency: 'USD',
  balance: 2000,
};

const account4 = {
  owner: 'Tal Mor',
  movements: [1000, 1500, 1000, -2000, 4000, -2000],
  interestRate: 1.6, // %
  pin: 4444,
  currency: 'EUR',
  balance: 7000,
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

let currUser = account1;
let currSymbolCurrency = '';
let isSorted = false;

function getUsername(fullName) {
  return fullName
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
}

function findAccount(username, password) {
  const account = findUser(username);

  if (!account || account.pin !== password) {
    alert('Username or password are incorrect!');
    return undefined;
  }
  return account;
}

function findUser(username) {
  const account = accounts.find(
    account => getUsername(account.owner) === username
  );

  return account;
}

function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = today.getFullYear().toString(); // Get last two digits of the year

  return `${day}/${month}/${year}`;
}

function getSymbolCurrency(currency) {
  let symbol;

  if (currency.toUpperCase() === 'ILS') {
    symbol = '₪';
  } else if (currency.toUpperCase() === 'USD') {
    symbol = '$';
  } else if (currency.toUpperCase() === 'EUR') {
    symbol = '€';
  } else {
    symbol = undefined;
  }

  return symbol;
}

function displayMovements(movements, startingIndex = 0) {
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdraw';
    const htmlEl = `
    <div class="movement-row">
      <div class="movement-type movement-type-${type}">${
      i + startingIndex + 1
    } ${type}</div>
      <div class="movement-date"></div>
      <div class="movement-amount">${mov.toFixed(2)}${currSymbolCurrency}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htmlEl);
  });
}

function displayAndUpdateBalance(balance) {
  //let sum = 0;

  //movements.forEach(el => (sum += el));
  currUser.balance = balance;
  labelBalance.textContent = currUser.balance.toFixed(2) + currSymbolCurrency;
}

function changeCurrency(from, to) {
  const url = `https://v6.exchangerate-api.com/v6/1f80d0c0f081f92b779fe3a3/pair/${from.toUpperCase()}/${to.toUpperCase()}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(
        `Conversion rate from ${from.toUpperCase()} to ${to.toUpperCase()}:`,
        data.conversion_rate
      );
      const newMovements = currUser.movements.map(mov =>
        Number((mov * Number(data.conversion_rate)).toFixed(2))
      );

      currUser.currency = to;
      currSymbolCurrency = getSymbolCurrency(currUser.currency);
      currUser.movements = newMovements;
      containerMovements.textContent = '';
      displayMovements(currUser.movements);

      const newBalance = Number(
        (Number(currUser.balance) * data.conversion_rate).toFixed(2)
      );

      console.log(
        `Previous balance: ${currUser.balance}${getSymbolCurrency(
          from
        )} || New balance: ${newBalance}${currSymbolCurrency}`
      );
      displayAndUpdateBalance(newBalance);
    })
    .catch(error => console.error('Error fetching data:', error));
}

async function conversionRate(from, to) {
  const url = `https://v6.exchangerate-api.com/v6/1f80d0c0f081f92b779fe3a3/pair/${from.toUpperCase()}/${to.toUpperCase()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.conversion_rate;
  } catch (error) {
    console.error('Error fetching data:', error);

    return null;
  }
}

function loadApp() {
  containerApp.style.opacity = 1;
  containerMovements.textContent = '';
  isSorted = false;
  currSymbolCurrency = getSymbolCurrency(currUser.currency);
  displayAndUpdateBalance(currUser.balance);
  displayMovements(currUser.movements);
  displaySummary();
  labelDate.textContent = getCurrentDate();
  labelWelcome.textContent = `Welcome back, ${
    currUser.owner.trim().split(' ')[0]
  }`;
  console.log(`Logged in successfully as ${currUser.owner}.`);
}

async function updateCurrencies(to) {
  await changeCurrency(currUser.currency, to);
  await delay(5000);
  displaySummary();
  console.log(`Update currencies to ${to} completed.`);
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function displaySummary() {
  console.log(currUser.movements);
  labelSumIn.textContent =
    currUser.movements
      .filter(mov => mov > 0)
      .reduce((sum, curr) => sum + curr, 0)
      .toFixed(2) + currSymbolCurrency;

  labelSumOut.textContent =
    Math.abs(
      currUser.movements
        .filter(mov => mov < 0)
        .reduce((sum, curr) => sum + curr, 0)
    ).toFixed(2) + currSymbolCurrency;

  labelSumInterest.textContent =
    currUser.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * currUser.interestRate) / 100)
      .reduce((sum, curr) => sum + curr, 0)
      .toFixed(2) + currSymbolCurrency;
}

function makeTransaction(amount) {
  displayMovements([amount], currUser.movements.length);
  currUser.movements.push(amount);
  displayAndUpdateBalance(currUser.balance + amount);

  if (amount > 0) {
    labelSumIn.textContent =
      (Number(labelSumIn.textContent.slice(0, -1)) + amount).toFixed(2) +
      currSymbolCurrency;

    labelSumInterest.textContent =
      (
        Number(labelSumInterest.textContent.slice(0, -1)) +
        (amount * currUser.interestRate) / 100
      ).toFixed(2) + currSymbolCurrency;
  } else {
    labelSumOut.textContent =
      (Number(labelSumOut.textContent.slice(0, -1)) - amount).toFixed(2) +
      currSymbolCurrency;
  }
}

function hideUI() {
  containerApp.style.opacity = 0;
  containerMovements.textContent = '';
  labelWelcome.textContent = `Log in to get started`;
}

btnLogin.addEventListener('click', function (event) {
  console.clear();
  currUser = findAccount(inputUsername.value, Number(inputPassword.value));
  inputUsername.value = inputPassword.value = '';
  inputUsername.blur();
  inputPassword.blur();

  if (currUser) {
    event.preventDefault();
    loadApp();
    //updateCurrencies('EUR');
  }
});

btnTransfer.addEventListener('click', async function (event) {
  event.preventDefault();

  const amountRequest = Number(inputTransferAmount.value);
  const transferToUser = inputTransferTo.value;
  const destUser = findUser(transferToUser);
  //console.log(amountRequest);
  //console.log(transferToUser);
  //console.log(destUser);

  if (
    destUser &&
    destUser !== currUser &&
    amountRequest > 0 &&
    amountRequest <= currUser.balance
  ) {
    console.log(
      `Request transfer of ${amountRequest}${currSymbolCurrency} to ${destUser.owner}.`
    );
    const conv_rate = await conversionRate(
      currUser.currency,
      destUser.currency
    );
    await delay(3000);
    if (conv_rate) {
      makeTransaction(-amountRequest);
      destUser.movements.push(amountRequest * conv_rate);
      destUser.balance += amountRequest * conv_rate;
      alert(`transfer request completed successfully.`);
      console.log(`transfer request completed successfully.`);
    } else {
      console.log(`Request failed.`);
      alert(`Request failed.`);
    }
  } else {
    alert(`Unvalid amount or the destination account is not found.`);
  }

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

btnLoan.addEventListener('click', async function (event) {
  event.preventDefault();

  const amountRequest = Number(inputLoanAmount.value);

  if (
    amountRequest > 0 &&
    currUser.movements.some(mov => mov >= amountRequest * 0.1)
  ) {
    console.log(`Request loan of ${amountRequest}${currSymbolCurrency}.`);
    await delay(3000);
    makeTransaction(amountRequest);
    console.log(`Loan request completed successfully.`);
    alert(`Loan request completed successfully.`);
  } else {
    alert(
      `To get the loan, the user must have a deposit of at least 10% of the requested amount!`
    );
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  const username = inputCloseUsername.value;
  const pin = Number(inputClosePassword.value);

  console.log(username, pin);

  if (username === getUsername(currUser.owner) && pin === currUser.pin) {
    accounts.splice(accounts.indexOf(currUser));
    alert(`Account deleted successfully.`);
    hideUI();
  } else {
    alert(`Wrong username or pin.`);
  }

  inputCloseUsername.value = inputClosePassword.value = '';
  inputClosePassword.blur();
  inputCloseUsername.blur();
});

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  containerMovements.textContent = '';
  isSorted = !isSorted;
  isSorted
    ? displayMovements(currUser.movements.slice().sort((a, b) => a - b))
    : displayMovements(currUser.movements);
});
