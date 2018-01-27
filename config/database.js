const crypto = require("crypto").randomBytes(256).toString('hex');
module.exports = {
    // uri:"mongodb://localhost:27017/MEAN-angular2",
    uri:'mongodb://obaida:obaida@ds117148.mlab.com:17148/angular2-app',
    secret:crypto,
    db:"angular2-app"
};