"use strict";
const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");
const { isLoggedIn, isNotLoggedIn } = require('../../passport/middlewares');  // 내가 만든 사용자 미들웨어

// 메인 페이지
router.get("/", ctrl.show.home);

// 로그인 페이지
router.get("/login",isNotLoggedIn , ctrl.show.login);

// 로그 아웃 페이지
router.get("/logout", ctrl.process.logout);

// 회원 가입 페이지
router.get("/member", isNotLoggedIn, ctrl.show.memberShip);

// 회원 리스트 페이지
router.get("/member/list",isLoggedIn, ctrl.show.memberList);

// 회원 전용 페이지 1
router.get("/mship", isLoggedIn, ctrl.show.mShip);

// 회원 전용 페이지 2
router.get("/mymirror", isLoggedIn, ctrl.show.myMirror);

// 회원 가입 프로세스
router.post("/memberShip", ctrl.process.memberShip);

// 회원 로그인 프로세스 (express-session 기반)
router.post("/login", ctrl.process.login);

// 회원 로그인 프로세스(passport Local) (login.ejs 의 POST 경로 /login2 로 변경해서 테스트)
router.post("/login2", ctrl.process.login2);

module.exports = router;
