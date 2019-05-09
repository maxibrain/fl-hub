
var Daemons = exports = module.exports = function(daemons) {
	if (!daemons) throw new Error("No daemons");
	this.daemons = daemons;
}

Daemons.prototype.start = function () {
    for (var i = 0; i < this.daemons.length; i++) {
        var daemon = this.daemons[i];
        console.log("DAEMONS: Starting '" + daemon.name + "'...");
        daemon.intervalObject = setInterval(function () {
            daemon.process(function (err) {
                var message = "DAEMONS: '" + daemon.name + "': "
                if (err) {
                    message += "Error iteration: " + err;
                } else {
                    message += "Successful iteration.";
                }
                console.log(message);
            });
        }, daemon.interval);
    }
}

Daemons.prototype.stop = function () {
    for (var i = 0; i < this.daemons.length; i++) {
        var daemon = this.daemons[i];
        if (daemon.intervalObject) {
            console.log("DAEMONS: Stopping '" + daemon.name + "'...");
            clearInterval(daemon.intervalObject);
            delete daemon.intervalObject;
        }
    }
}