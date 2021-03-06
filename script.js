'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],

  movements1: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movements1: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movements1: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],

  movements1: [430, 1000, 700, 50, 90],
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

/////////////////////////////////////////////////

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Functions
const displayTransactions = function (obj) {
  containerMovements.innerHTML = ''; //tozalash
  obj.movements.forEach(function (val, key) {
    let tekshir = val > 0 ? 'deposit' : 'withdrawal';
    let movementsRow = `<div class="movements__row">
  <div class="movements__type movements__type--${tekshir}">2 ${tekshir}</div>
  <div class="movements__date">3 days ago</div>
  <div class="movements__value">${val}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', movementsRow);
  });
};

accounts.forEach(function (val) {
  val.username = val.owner
    .toLowerCase()
    .split(' ')
    .map(function (val) {
      return val[0];
    })
    .join('');
  // console.log(val.username);
});

const currentBalance = function (obj) {
  let sum = obj.movements.reduce(function (def = 0, val) {
    return def + val;
  });
  return sum;
};

let sumIn = 0;
let out = 0;
let komissiya = 0;
const stats = function (obj) {
  sumIn = obj.movements
    .filter(function (val) {
      return val > 0;
    })
    .reduce(function (sum = 0, val) {
      return sum + val;
    });
  out = obj.movements
    .filter(function (val) {
      return val < 0;
    })
    .reduce(function (sum, val) {
      return sum + val;
    }, 0);
  komissiya = obj.movements
    .filter(function (val) {
      return val < 0;
    })
    .map(function (val) {
      return (val * obj.interestRate) / 100;
    })
    .reduce(function (sum, val) {
      return sum + val;
    }, 0);
};
function sortt(obj) {
  obj.movements.sort((a, b) => a - b);
}
function unSortt(obj) {
  obj.movements = [...obj.movements1];
}

let kirganUser;

const updateInterface = function (acc) {
  displayTransactions(acc);
  currentBalance(acc);
  stats(acc);
  labelBalance.textContent = `${currentBalance(kirganUser)}???`;
  stats(kirganUser);
  labelSumIn.textContent = `${sumIn}???`;
  labelSumOut.textContent = `${Math.abs(out)}???`;
  labelSumInterest.textContent = `${Math.abs(komissiya)}???`;
};

// btnLogin.innerHTML = '';
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //htmldagi default holatlarni o'chirish
  // console.log('LOGIN');
  let login = inputLoginUsername.value;
  let parol = Number(inputLoginPin.value);
  kirganUser = accounts.find(function (val) {
    return val.username == login;
  });
  if (kirganUser?.pin === parol) {
    inputLoginUsername.value = inputLoginPin.value = '';
    labelWelcome.textContent = `Welcome ${kirganUser.owner}`;
    labelWelcome.style.color = `limegreen`;
    containerApp.style.opacity = 1;
  } else {
    labelWelcome.textContent = `Try again!`;
    labelWelcome.style.color = `red`;
  }
  // displayTransactions(kirganUser);
  labelBalance.textContent = `${currentBalance(kirganUser)}???`;
  stats(kirganUser);
  labelSumIn.textContent = `${sumIn}???`;
  labelSumOut.textContent = `${Math.abs(out)}???`;
  labelSumInterest.textContent = `${Math.abs(komissiya)}???`;
  //console.log(kirganUser);

  updateInterface(kirganUser);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let qabulQiluvchi = String(inputTransferTo.value);
  let kiritilganSumma = Number(inputTransferAmount.value);
  let transferUser = accounts.find(function (val) {
    return qabulQiluvchi === val.username;
  });
  if (transferUser !== kirganUser) {
    if (currentBalance(kirganUser) > kiritilganSumma) {
      kirganUser.movements.push(kiritilganSumma * -1);
      transferUser.movements.push(kiritilganSumma);
    }
    updateInterface(kirganUser);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let qarz = Number(inputLoanAmount.value);
  if (qarz <= sumIn * 0.1) {
    kirganUser.movements.push(qarz);
  } else {
    alert(`siz buncha summa qarz ololmaysiz`);
  }
  updateInterface(kirganUser);
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let confirmUser = inputCloseUsername.value;
  let confirmPin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  kirganUser = accounts.find(function (val) {
    return val.username === confirmUser;
  });
  if (confirmUser === kirganUser.username && confirmPin === kirganUser.pin) {
    accounts.splice(accounts.indexOf(kirganUser), 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = '';
  }
  if (confirmUser === kirganUser.username && confirmPin !== kirganUser.pin) {
    alert(`parol noto'g'ri`);
  }

  updateInterface(kirganUser);
});

let sortirovka;
let shart = 0;
btnSort.addEventListener('click', function () {
  if (shart == 0) {
    sortt(kirganUser);
    shart = 1;
  } else {
    unSortt(kirganUser);
    shart = 0;
  }

  updateInterface(kirganUser);
});

// labelBalance.addEventListener('click', function () {
//   let utkazmalar = Array.from(
//     document.querySelectorAll('.movements__value'),
//     function (val, key) {
//       return Number(val.textContent);
//     }
//   );
//   console.log(utkazmalar);
// });

//find method
// let x = accounts.find(function (val) {
//   return val.username === 'js';
// });
// console.log(x);
// console.log(
//   accounts.find(function (val) {
//     return val.username === 'ss';
//   })
// );
