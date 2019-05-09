var NotificationSettings = exports = module.exports = function(scoreThreashold) {
    this.scoreThreashold = scoreThreashold || NotificationSettings.DEFAULT_SCORE_THEASHOLD;
    this.schedule = NotificationSettings.SCHEDULE_IMMEDIATELY;
    this.enabled = true;
}

NotificationSettings.DEFAULT_SCORE_THEASHOLD = 2;
NotificationSettings.SCHEDULE_IMMEDIATELY = 'immediately';