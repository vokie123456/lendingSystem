var express = require('express');
var path = require('path');
var config=require('./config');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');//图片上传格式处理
var session=require('express-session');
var FileStore = require('session-file-store')(session);
var multipartMiddleware = multipart();
var app = express();
var os=require("os");
global.urlHandle=require("./router/util/urlHandler");

if(process.env.NODE_ENV==="production"){
  app.engine('html',require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, config.prod.assetsViews));
}


var useragent = require('express-useragent');
app.use(useragent.express());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:"1346e3df95aae99d8dca79932d9a74a3",
  saveUninitialized: true,
  cookie:{maxAge:process.env.NODE_ENV==="production"?config.prod.sessionTimeOut:config.dev.sessionTimeOut,secure:false},//设置过期时间
  resave: false,
  store:new FileStore({reapInterval:-1,path : "./router/session",ttl:process.env.NODE_ENV==="production"?config.prod.sessionTimeOut:config.dev.sessionTimeOut})
}));
app.use(multipartMiddleware);//图片上传处理


//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","POST,GET,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  if(process.env.NODE_ENV==="production"){
    var netWork=os.networkInterfaces();
    for(var key in netWork){
      for(var i= 0,len=netWork[key].length;i<len;i++){
        if(netWork[key][i]["family"]==="IPv4"){
          console.log('netWork[key][i]["family"]:',netWork[key][i]["family"]==="IPv4"&&netWork[key][i]["address"]==="10.4.33.251");
        }
        if(netWork[key][i]["family"]==="IPv4"&&netWork[key][i]["address"]==="10.4.33.251"){
          global.urlHandle.baseUrl="http://127.0.0.1:9998/";
        }
      }
    }
    console.log("global.baseUrl222222:",global.urlHandle.baseUrl);
  }
  next();
});


if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, config.prod.assetsSubDirectory)));

  app.get("/",function(req,res,next){
    console.log("用户请求了index");
    console.log("req.originalUrl:",req.originalUrl);
    res.status(200);
    res.render("index");
  })
 /* app.get("/",function(req,res,next){

    res.redirect(req.originalUrl+'/');
  })*/
}
var ctrl=require("./router/controller");
app.use('/rest',ctrl);



// catch 404 and forward to error handler
app.all("*",function(req, res, next) {
  console.log("req.originalUrlsss:",req.originalUrl);
  res.status(200);
  res.render("index");
});
//express不崩
process.on('uncaughtException', function (err) {
  console.log(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  delete err.stack;
  delete err.name;
  res.status(err.status || 500);
  if(res.endParam){
    return;
  }
  try{
    res.send(err);
  }catch(err){
  }
});

module.exports = app;
