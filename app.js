"use strict";
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const sequelize = require("./models/index.js").sequelize;

// 일회성(휘발성) 데이터를 특정 페이지(뷰) 에 전달하는 방식제공 플래시 패키지 참조하기
var flash = require('connect-flash');


var app = express();
// const redis = require('redis');
// const client = redis.createClient();



const session = require('express-session');
// const connectRedis =require('connect-redis');
// const RedisStore = connectRedis(session);

// passport 
const passport  = require('passport');


const sess = {
  
  secret: '@#$DFGDF',
  resave: false,
  saveUninitialized: true,
  // name: 'redis_session',     // 세션 이름 (개발자도구에서 확인)
  cookie: {
    httpOnly: true,
    secure: false,
  },

  // store: new RedisStore({ url: 'http://localhost:6379', logErrors: true})
};
app.use(session(sess));

// flash 메시지 사용 활성화
app.use(flash());

//패스포트-세션 초기화 : express session 뒤에 설정
app.use(passport.initialize());
app.use(passport.session());



// 컨트롤러
const home = require("./routes/home");
const board = require("./routes/board");
const api = require("./routes/api");

// 마스터 레이아웃
app.use(expressLayouts);

// 시퀄라이즈 ORM 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("ORM 준비 완료");
  })
  .catch((err) => {
    console.log(err);
  });

// 패스포트 개발자 정의 모듈로드
const passportConfig = require('./passport/index');

// 패스포트 설정 처러ㅣ
passportConfig(passport);



// view engine setup
app.set("layout", "layout");
app.set("layout extractScripts", true);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 라우터 미들웨어

app.use("/", home);
// app.use("/memberShip", home)
app.use("/boards", board);
app.use("/api/articles", api);

app.all('*', (req, res) => {
  res.render('./home/notaccess',{nickName: ''});
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler (노드 어플리케이션 전역예외처리기 try - catch 안걸면 여기로 에러가 넘어옴)
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



module.exports = app;


