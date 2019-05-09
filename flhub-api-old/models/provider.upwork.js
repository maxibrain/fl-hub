var UpworkApi = require('upwork-api'),
  AuthApi = require('upwork-api/lib/routers/auth').Auth,
  SearchApi = require('upwork-api/lib/routers/jobs/search').Search,
  JobProfileApi = require('upwork-api/lib/routers/jobs/profile').Profile,
  UsersApi = require('upwork-api/lib/routers/organization/users').Users,
  ProfileApi = require('upwork-api/lib/routers/freelancers/profile').Profile,
  Jobs = require('upwork-api/lib/routers/hr/jobs.js').Jobs,
  async = require('async'),
  objectMapper = require('object-mapper'),
  Profile = require('./domain/profile'),
  Job = require('./domain/job'),
  JobPaymentBasis = require('./domain/job-payment-basis'),
  JobBudget = require('./domain/job-budget');

var UpworkProvider = (exports = module.exports = function(session) {
  this.name = 'upwork';
  this.config = {
    consumerKey: '<key>',
    consumerSecret: '<secret>',
    accessToken: '<token>', // assign if known
    accessSecret: '<secret>', // assign if known
    debug: true,
  };

  this.api = new UpworkApi(this.config);
  if (session) {
    this.api.setAccessToken(session.accessToken, session.accessTokenSecret, function() {});
  }
});

UpworkProvider.prototype.getAuthorizationUrl = function(callbackUrl, callback) {
  this.api.getAuthorizationUrl(callbackUrl, function(error, url, requestToken, requestTokenSecret) {
    if (error) {
      callback(error);
    } else {
      callback(error, { url: url, requestToken: requestToken, requestTokenSecret: requestTokenSecret });
    }
  });
};

UpworkProvider.prototype.authorize = function(session, token, verifier, callback) {
  if (!session || !session.requestToken || !session.requestTokenSecret) throw new Error('No OAuth session.');
  if (!verifier) throw new Error('No verifier.');
  if (session.requestToken !== token) throw new Error('Token mismatch.');
  this.api.getAccessToken(session.requestToken, session.requestTokenSecret, verifier, function(error, accessToken, accessTokenSecret) {
    if (error) {
      callback(error);
    } else {
      callback(error, {
        requestToken: session.requestToken,
        requestTokenSecret: session.requestTokenSecret,
        accessToken: accessToken,
        accessTokenSecret: accessTokenSecret,
      });
    }
  });
};

UpworkProvider.JobMap = {
  url: 'url',
  date_created: {
    key: 'dateCreated',
    transform: val => ~~(new Date(val).getTime() / 1000),
  },
  title: 'title',
  snippet: 'description',
  job_type: {
    key: 'paymentBasis',
    transform: val => (val === 'Hourly' ? JobPaymentBasis.HOURLY : JobPaymentBasis.FIXED),
  },
  budget: 'budget.maximum',
  client: {
    key: 'client',
    transform: val => {
      paymentVerified: val && val.payment_verification_status === 'VERIFIED';
      country: val ? val.country : null;
    },
  },
  profiles: {
    key: 'isFavorite',
    transform: val => val && val.is_favorite,
  },
};

UpworkProvider.prototype.getJobsRaw = function(settings, callback) {
  settings = settings || {};
  settings.skills = settings.skills || [];
  var search = new SearchApi(this.api);
  var searchSettings = {
    q: settings.query || '*',
  };
  if (settings.paging) {
    searchSettings.paging = settings.paging.offset.toString() + ';' + settings.paging.limit.toString();
  }
  search.find(searchSettings, callback);
};

UpworkProvider.prototype.getJobRaw = function(id, callback) {
  var profile = new JobProfileApi(this.api);
  profile.getSpecific(id, callback);
};

UpworkProvider.prototype.getJobs = function(settings, callback) {
  this.getJobsRaw(settings, (error, data) => {
    if (error) {
      callback(error);
      return;
    }
    var jobs = [];
    for (var i = 0; i < data.jobs.length; i++) {
      var job = new Job(this.name);
      job.sourceJobJSON = JSON.stringify(data.jobs[i]);
      objectMapper(data.jobs[i], job, UpworkProvider.JobMap);
      jobs.push(job);
    }
    callback(error, jobs);
  });
};

UpworkProvider.prototype.getJob = function(id, callback) {
  var profile = new JobProfileApi(this.api);
  profile.getSpecific(id, (error, data) => {
    if (error) {
      callback(error);
      return;
    }
    var job = new Job(this.name);
    job.sourceJobJSON = JSON.stringify(data);
    objectMapper(data, job, UpworkProvider.JobMap);
    callback(error, job);
  });
};

UpworkProvider.ProfileMap = {
  'info.ref': 'id',
  'auth_user.first_name': 'name.firstName',
  'auth_user.last_name': 'name.lastName',
  'info.portrait_100_img': {
    key: 'photos[]+',
    transform: val => {
      return { value: val };
    },
  },
  'info.portrait_50_img': {
    key: 'photos[]+',
    transform: val => {
      return { value: val };
    },
  },
  'info.portrait_32_img': {
    key: 'photos[]+',
    transform: val => {
      return { value: val };
    },
  },
  'user.email': 'email',
  'user.profile_key': 'profileKey',
  skills: 'skills',
};

UpworkProvider.prototype.getProfile = function(callback) {
  var auth = new AuthApi(this.api);
  var users = new UsersApi(this.api);
  var freelancers = new ProfileApi(this.api);
  var profile = new Profile(this.name);
  async.parallel(
    [
      function(callback) {
        auth.getUserInfo(function(error, data) {
          if (error) {
            callback(error);
            return;
          }
          objectMapper(data, profile, UpworkProvider.ProfileMap);
          callback();
        });
      },
      function(callback) {
        users.getMyInfo(function(error, data) {
          if (error) {
            callback(error);
            return;
          }
          objectMapper(data, profile, UpworkProvider.ProfileMap);
          freelancers.getSpecific(data.user.profile_key, function(error, specificData) {
            if (error) {
              callback(error);
              return;
            }
            objectMapper(specificData, profile, UpworkProvider.ProfileMap);
            callback();
          });
        });
      },
    ],
    function(error) {
      if (error) {
        callback(error);
        return;
      }
      callback(error, profile);
    },
  );
};
