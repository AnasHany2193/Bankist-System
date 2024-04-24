'use strict';

// Data
const account1 = {
  owner: 'Anas Hany',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Create a username for each account based on the owner's name.
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsername(accounts);

// Show movements in the account.
const showMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${movement}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and display the current balance based on movements.
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((accum, movement) => accum + movement, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Calculate and display summary statistics including income, outcome, and interest.
const calcDisplaySummary = (movements, rate) => {
  const income = movements
    .filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = Math.abs(
    movements
      .filter(movement => movement < 0)
      .reduce((acc, movement) => acc + movement, 0)
  );
  labelSumOut.textContent = `${outcome}€`;

  const interest = (income * rate) / 100;
  labelSumInterest.textContent = `${interest}€`;
};

// Update the user interface with account information.
const updateUI = function (acc) {
  // Display Movments:
  showMovements(acc.movements);

  // Display Balance:
  calcDisplayBalance(acc);

  // Display Summary:
  calcDisplaySummary(acc.movements, acc.interestRate);
};

// Event listener for login button click. Authenticates user and displays account information if successful.
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting:
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message:
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    // Update UI:
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = `User Not Found! :(`;
    containerApp.style.opacity = 0;
  }

  // Clear fields:
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
});

// Event listener for transfer button click. Transfers funds between accounts if conditions are met.

btnTransfer.addEventListener('click', function (e) {
  // Display UI and welcome message:
  e.preventDefault();

  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (
    amount &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // transfare amount:
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Update UI:
    updateUI(currentAccount);
  }

  // Clear fields:
  inputTransferAmount.value = inputTransferTo.value = '';
});
