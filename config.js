////////////////////
// Configurations //
////////////////////


// redis (for session)
var redis = {};
redis.connectionString = "redis://redistogo:0afae999612f5bb8d60a3528d2e33359@sole.redistogo.com:9062/";
redis.host = "sole.redistogo.com";
redis.port = "9062";
redis.pass = "0afae999612f5bb8d60a3528d2e33359"
module.exports.redis = redis;



// 500px
var fpx = {};
fpx.key = "uoQXhmMNaqQpRTngdMGEYsOECEUhMEse6nu8jJYd";
fpx.secret = "jJYqmndzx5m8FcRTSBjlGPxxOqpcxTugOO7c0dh4";
fpx.callback = "http://localhost:3000/login/callback";
module.exports.fpx = fpx;