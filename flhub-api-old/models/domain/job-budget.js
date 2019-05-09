var JobBudget = exports = module.exports = function() {
    this.range = JobBudget.UNDEFINED;
    this.minimum = 0;
    this.maximum = 0;
}
JobBudget.HIGH = "High";
JobBudget.MIDDLE = "Middle";
JobBudget.LOW = "Low";
JobBudget.UNDEFINED = "Undefined";
