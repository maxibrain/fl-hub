var NotificationSettings = require('./notification-settings.js');

var User = exports = module.exports = function (firstName, lastName, emailAddress) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.phoneNumber = "";
    this.notificationSettings = {
        email: new NotificationSettings(2),
        sms: new NotificationSettings(5),
    }
}