'use strict';

// Data
const account1 = {
  owner: 'Anas Hany',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

// Calculate the relative date based on the provided date.
const calcDate = date => {
  const calcDaysPassed = date =>
    Math.floor(Math.abs(date - new Date()) / (1000 * 60 * 60 * 24));

  const period = calcDaysPassed(date);

  return period === 0
    ? 'Today'
    : period === 1
    ? 'Yesterday'
    : `${period} days ago`;
};

// Show movements in the account.
const showMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const displayDate = calcDate(new Date(acc.movementsDates[i]));

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and display the current balance based on movements.
const calcDisplayBalance = acc => {
  acc.balance = acc.movements
    .reduce((accum, movement) => accum + movement, 0)
    .toFixed(2);
  labelBalance.textContent = `${acc.balance}€`;

  // Update the current date and time in the user interface.
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const day = `${now.getDate()}`.padStart(2, 0);
  const period = now.getHours() > 12 ? 'PM' : 'AM';
  const hour = `${now.getHours() % 12}`.padStart(2, 0);
  const minutes = `${now.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes} ${period}`;
};

// Calculate and display summary statistics including income, outcome, and interest.
const calcDisplaySummary = (movements, rate) => {
  const income = movements
    .filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement, 0)
    .toFixed(2);
  labelSumIn.textContent = `${income}€`;

  const outcome = Math.abs(
    movements
      .filter(movement => movement < 0)
      .reduce((acc, movement) => acc + movement, 0)
      .toFixed(2)
  );
  labelSumOut.textContent = `${outcome}€`;

  const interest = ((income * rate) / 100).toFixed(2);
  labelSumInterest.textContent = `${interest}€`;
};

// Update the user interface with account information.
const updateUI = function (acc) {
  // Display Movments:
  showMovements(acc);

  // Display Balance:
  calcDisplayBalance(acc);

  // Display Summary:
  calcDisplaySummary(acc.movements, acc.interestRate);
};

// Start a logout timer for the user session.
const startLogOutTimer = () => {
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);

    // in each call, print the remaining UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);

      // LogOut:
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // dec 1s
    time--;
  };

  // set time to 5 minutes
  let time = 60 * 5;

  // Call timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentAccount, timer;

// Event listener for login button click. Authenticates user and displays account information if successful.
btnLogin.addEventListener('click', function (e) {
  // prevent from submitting:
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message:
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    // Update UI:
    updateUI(currentAccount);

    // logOut timer:
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
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
  // prevent from submitting:
  e.preventDefault();

  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  if (
    amount &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // transfare amount:
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // add transfare date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    // Update UI:
    updateUI(currentAccount);

    // reset timer:
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  // Clear fields:
  inputTransferAmount.value = inputTransferTo.value = '';
});

// Event listener for loan button click. Grants a loan to the current account if conditions are met.
btnLoan.addEventListener('click', function (e) {
  // prevent from submitting:
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // add load movment
      currentAccount.movements.push(amount);

      // add load date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI:
      updateUI(currentAccount);
    }, 1500);
  }

  // reset timer:
  clearInterval(timer);
  timer = startLogOutTimer();

  // Clear fields:
  inputLoanAmount.value = '';
});

// Event listener for close account button click. Closes the current account if credentials match.
btnClose.addEventListener('click', function (e) {
  // prevent from submitting:
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername?.value &&
    currentAccount.pin === +inputClosePin?.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    // LogOut:
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }

  // Clear fields:
  inputCloseUsername.value = inputClosePin.value = '';
});

// Event listener for sort button click.
let sorted = true;
btnSort.addEventListener('click', function (e) {
  // prevent from submitting:
  e.preventDefault();

  showMovements(currentAccount, sorted);
  sorted = !sorted;
});
