var Criteria = exports = module.exports = function (userId, name, expression, multiplier, icon, showName) {
    if (!userId) throw new Error("No user ID");
    if (!name) throw new Error("No name");
    this.userId = userId;
    this.name = name;
    this.expression = expression || "false";
    this.multiplier = multiplier || 1.0;
    this.icon = icon || "usd";
    this.showName = showName || false;
}