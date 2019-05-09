var Feed = require('../models/feed');
var UserFeed = require('../models/user-feed');
var nodemailer = require('nodemailer');
var async = require('async');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mkostyrkin@gmail.com',
        pass: 'mbg00glepas'
    }
});

var Daemon = exports = module.exports = function (db, provider, settings) {
    if (!db) throw new Error("No db");
    this.name = "Job Feed Daemon";
    this.db = db;
    this.interval = 1 * 60 * 60 * 1000; // 1 hour
    this.latestJobId = null;
    this.settings = settings;
    this.feed = new Feed(provider);
}

Daemon.prototype.process = function (callback) {
    var self = this;
    self.settings.latestJobId = self.latestJobId;
    self.feed.fetch(self.settings, function (error, jobs) {
        if (error) {
            callback(error);
            return;
        }
        var filter = {
            $or: [
                {
                    $and: [
                        { "emailAddress" : { "$exists" : true, "$ne" : "" } },
                        { "notificationSettings.email.enabled": true }
                    ]
                },
/*
                {
                    $and: [
                        { "phoneNumber" : { "$exists" : true, "$ne" : "" } },
                        { "notificationSettings.enabled.sms": true }
                    ]
                },
*/
            ]
        }
        var usersCollection = self.db.get('users');
        usersCollection.find(filter, function (err, users) {
            if (err) {
                callback(err);
                return;
            }
            async.each(users, 
                function (user, callback) {
                    var scoreThreashold = user.notificationSettings.scoreThreashold || 1;
                    var settings = {
                        filter: function(job) { return job.totalScore > scoreThreashold; }
                    };
                    var userFeed = new UserFeed(self.db, user);
                    userFeed.process(jobs, function (err, jobs) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (user.emailAddress && jobs.length > 0) {
                            Daemon.sendJobs(user, jobs, callback);
                            //                            function(err, info) {
                            //                                if (err) {
                            //                                    callback(err);
                            //                                user.lastEmailError = err;
                            //                                usersCollection.updateById(user._id,
                            //                                    { $set: { lastEmailError: err } },
                            //                                    function(err) {
                            //                                        if (err) console.log(err);
                            //                                    });
                            //                                }
                            //                            });
                        } else {
                            callback();
                        }
                    });
                },
                function(error) {
                    if (jobs.length > 0) {
                        self.latestJobId = jobs[0].id;
                    }
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback(error, self);
                });
        });
    });
};

Daemon.sendJobs = function (user, jobs, callback) {
    if (!user.emailAddress) throw new Error("No email address");
    if (!jobs || jobs.length === 0) throw new Error("No jobs");
    
    var plainText = "Hello " + user.firstName + ". Here are new job postings selected for you:\r\n";
    var html = "<div>Hello " + user.firstName + ". Here are new job postings selected for you:</div><div><ul>";
    for (var i = 0; i < jobs.length; i++) {
        var job = jobs[i];
        plainText += job.title + ": " + job.url + " - Score: " + job.totalScore;
        html += '<li><a href="' + job.url + '">' + job.title + "</a><span> - Score: " + job.totalScore + "</li>";
    }
    html += "</ul></div>"
    
    var mailOptions = {
        from: 'Freelance Hub <mkostyrkin@gmail.com>', // sender address
        to: user.emailAddress, // list of receivers
        subject: 'New jobs notification', // Subject line
        text: plainText, // plaintext body
        html: html // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, callback);
}