chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    sendResponse({ result: fillData(request) });
  } catch (error) {
    sendResponse({ error });
  }
});

function fillData(
  data: Array<{ type: 'Income' | 'Expense'; dateTime: string; currency: 'UAH' | 'USD'; amount: number; description?: string }>,
) {
  const operationTypeMap = new Map([
    ['Income', 0],
    ['Expense', 1],
  ]);
  data.forEach(op => {
    const operationTypeIndex = operationTypeMap.get(op.type);
    console.log(operationTypeIndex);
    $('.finances-tab__controls button').trigger('click');
    const $content = $('.finances-popup-content');
    $content.find('.finances-popup-tabs__input a')
      .eq(operationTypeIndex)
      .trigger('click');
    const date = new Date(op.dateTime);
    $content.find('.operation-popup__date-input[formcontrolname="date"] input').val(date.toLocaleDateString('uk-UA'));
    $content.find('.operation-popup__date-input[formcontrolname="time"] input').val(date.toLocaleTimeString('uk-UA'));
    if (op.type === 'Income' && op.currency === 'USD') {
      $content.find('select[formcontrolname="financeType"]').val('1: custom');
      $content.find('p-autocomplete[formcontrolname="account"] input').val('OTP USD (USD)');
      $content.find('input[formcontrolname="total"]').val(op.amount);
    } else {
      throw new Error('Unknown transaction');
    }
    $content.find('textarea[formcontrolname="comment"]').val(op.description);
    $('.finances-popup-actions button.ui-button-dropdown__button').trigger('click');
  });
}

console.log('content.js loaded');
