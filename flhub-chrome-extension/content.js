$(document).ready(function() {
    var $controllerDiv = $('div[data-ng-controller="JobDetailsRootController"]');
    var $historyDiv = $controllerDiv.find('[data-client-work-history]');
    setTimeout(function() {
        while (click(() => $historyDiv.find('footer a'))) {
        }
        click(() => $historyDiv.find('header a.isCollapsed'));
    }, 250);
    var history = $historyDiv.data('client-work-history');
    var $clientDiv = $controllerDiv.find('div[data-ng-controller="JobDetailsClientNameController"]');

    var score = new Score(history).eval();
    
    chrome.runtime.sendMessage(score, function(response) {
        console.log("Background page responded", response);
      });
});

var click = function(selector) {
    var element = selector()[0];
    if (element) {
        element.click();
        return true;
    }
    return false;
}

var Score = function(history) {
    this.history = history || [];
}

Score.prototype.eval = function() {
    var total = 5.0;
    return {
        total: total
    };
}