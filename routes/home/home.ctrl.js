"use strict";
var moment = require("moment");
const bcrypt = require("bcrypt");
const passport = require('passport');
const db = require("../../models");

let show = {
    home: function (req, res, next) {
        if(!req.session.passport){
            res.render("./home/index", {nickName:''});            
        } else {
            res.render("./home/index", {nickName:req.session.passport.user});
        }
    },
    login: function (req, res, next) {
        res.render("./home/login", {nickName:req.session.nickName});
    },
    memberShip: function (req, res, next) {
        res.render("./home/memberShip", {nickName:''});
    },
    mShip: function(req, res, next) {
        res.render("./home/mship", {nickName:req.session.passport.user})             
    },
    myMirror: function(req, res, next) {
        res.render("./home/mymirror", {nickName:req.session.passport.user})             
    },
    memberList: async (req, res, next) => {
        let memberList = await db.Member.findAll();
        res.render("./home/memberList", { memberList, moment, nickName:req.session.passport.user });
    },
};

let process = {
    memberShip: async (req, res, next) => {
        let user_id = req.body.member.user_id;
        let password = req.body.member.psword;
        let nickName = req.body.member.nickName;

        let id_pattern = /\w{5,}/;
        let valid_id = id_pattern.test(user_id);
        let valid_pw = id_pattern.test(password);
        let valid_nickName = nickName.length >= 2 ? true : false;

        if (!valid_id) {
            let data = { msg: "ID" };
            res.json(data);
            return;
        } else if (!valid_pw) {
            let data = { msg: "PW" };
            res.json(data);
            return;
        } else if (!valid_nickName) {
            let data = { msg: "nickName" };
            res.json(data);
            return;
        }

        let findUserId = await db.Member.findOne({
            where: { user_id: user_id },
        });
        console.log("사용자아이디 찾기", findUserId);

        if (findUserId == null) {
            bcrypt.hash(password, 10, (err, hash) => {
                // 비밀번호 암호화 2
                password = hash;
                let member = {
                    user_id,
                    password,
                    nickName,
                };
                let result = db.Member.create(member);
                res.json({ msg: "성공" });
            });
        } else {
            let data = { msg: `${user_id} 는 사용중인 ID 입니다.` };
            res.json(data);
        }
    },

    login: async (req, res, next) => {
        let user_id = req.body.user_id;
        let password = req.body.password;
        let result = await db.Member.findOne({ where: { user_id: user_id } });

        if (result == null) {
            let data = {
                msg: "실패 (ID를 확인해주세요)",
            };
            res.json(data);
        }

        bcrypt.compare(password, result.password, (err, user) => {
            if (result.user_id == user_id && user) {
                let data = {
                    msg: "성공",
                };
                req.session.nickName = result.nickName;                    
                req.session.save(() => {
                    res.json(data);
                })            
            } else {
                let data = {
                    msg: "실패 (비밀번호를 확인해주세요).",
                };
                res.json(data);
            }
        });
    },

    login2: function(req, res, next) {

    // 패스포트 인증처리: 로컬로그인전략 적용
    // authenticate() 기능이 호출되면 호출결과값과 함꼐(authError, user, info)=>{}콜백함수가 호출됩니다 
        passport.authenticate('local', function(authError, user, info) {
            console.log("따용자",user);  // false
            //로컬 로그인 전략(localStrategy.js) 수행결과 값이 리턴됨
            //인증에러 발생시
            if (authError) {
            console.error(authError);
            return next(authError);
            }

            //사용자 정보가 없으면 에러처리
            if (!user) {
            //localStrategy.js 파일내 DB로그인 검증결과 메시지 출력
            // req.flash('loginError', info.message);  // render 를 사용하지 않고 아래 /login 페이지에 한번 메시지를 전달
            // return res.redirect('/login'); 
            let data = { msg: '실패'}
            return res.json(data)
            }

            //req.login 메소드 호출 로그인 세션처리
            //req.log(user,처리결과콜백함수)
            //user세션데이터가 전달되어 express-session에 저장됨.req.session.passport.user = user
            return req.login(user, (loginError) => {
            //로그인 에러발생시
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            //정상 로그인시 메인페이지 이동
            // return res.redirect('/articles/list');
            let data = { msg: '성공'}
            console.log('9999999999999999999999999')
            return res.json(data)
            });
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
    },

    logout: (req, res, next) => {
        delete req.session.passport
        res.redirect('/');
    }
};

module.exports = {
    show,
    process,
};
