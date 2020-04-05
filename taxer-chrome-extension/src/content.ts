import { Operation } from './app/interfaces';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fillData(request, (error, result) => {
    if (error) {
      return sendResponse({ error });
    }
    sendResponse({ result });
  });
});

const userSettings = {
  userId: 116825,
  accounts: {
    USD: { currency: 'USD', id: 2, title: 'OTP USD' },
    UAH: { currency: 'UAH', id: 3, title: 'OTP UAH' },
  },
};

function fillData(data: Array<Operation>, callback: (err, result?) => void) {
  if (!data || !data.length) {
    return callback(null, 0);
  }

  const addOperation = (op: Operation, cb: (err, result?) => void) => {
    const timestamp = new Date(op.dateTime).getTime() / 1000;
    let operationData;
    switch (op.type) {
      case 'Income':
        operationData = {
          id: null,
          type: 'FlowIncome',
          comment: op.description,
          contents: [],
          timestamp,
          payedSum: null,
          financeType: 'custom',
          account: userSettings.accounts[op.currency],
          total: op.amount,
        };
        break;
      case 'Expense':
        operationData = {
          id: null,
          type: 'FlowOutgo',
          comment: op.description,
          contents: [],
          timestamp,
          payedSum: null,
          financeType: 'custom',
          account: userSettings.accounts[op.currency],
          total: Math.abs(op.amount),
        };
        break;
      case 'Currency Exchange':
        operationData = {
          id: null,
          type: 'CurrencyExchange',
          comment: op.description,
          contents: [],
          timestamp,
          financeType: 'tax_free',
          outgoTotal: op.extensions.usdAmount,
          outgoAccount: userSettings.accounts.USD,
          incomeAccount: userSettings.accounts.UAH,
          incomeCurrency: op.extensions.exchangeRate,
        };
        break;
      default:
        callback(new Error('Unknown transaction'));
    }

    $.post(
      'https://taxer.ua/api/finances/operation/create?lang=ru',
      JSON.stringify({
        userId: userSettings.userId,
        operation: operationData,
      }),
      res => cb(null, op),
      'json',
    );
  };

  const recursiveCallback = (err, op) => {
    if (err) {
      return callback(err);
    }
    const index = data.indexOf(op);
    if (index < data.length - 1) {
      addOperation(data[index + 1], recursiveCallback);
    } else {
      callback(null, data);
    }
  };

  addOperation(data[0], recursiveCallback);
}

console.log('Freelance Hub Taxer Extension Installed');
