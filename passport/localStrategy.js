//로컬 로그인 전략 기능 정의
//회원가입시 입력한 아이디/암호 기반으로 패스포트 기능을 사용하는 경우의 인증전략
//passport-local 은 사용자아이디/암호를 직접 입력해서 로그인하는 방식을 제공한다.
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models');
//회원정보가 존재하는 모델 조회


module.exports = () => {
  //req.body내 비교 아이디/암호 html요소이름을 지정
  //new LocalStrategy({로그인폼의 아이디요소네임,암호요소네임지정},로그인인증처리함수(사용자가 입력한 아이디값,사용자가 입력한 암호값))
  passport.use(new LocalStrategy({
        usernameField: 'user_id',   // 로그인 페이지의 사용자 아이디 UI INPUT 요소 name 값
        passwordField: 'password',  // 로그인 페이지의 사용자 암호   UI INPUT 요소 name 값
      }, async (user_id, password, done) => {
        console.log('Local 전략 ////////////////////////////////////////////////')
        // 예외(Exception) 처리 (에러-Bug)
        try {
          //로그인 화면에서 전달된 아이디(userId)/암호(userPWD)를 이용 DB사용자와 검증
          //done함수는 passport.authenticate의 콜백함수임
          //사용자 정보조회
          const exUser = await db.Member.findOne({ where: { user_id} });
          // 사용자 아이디 정보가 존재하면 (true)
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); 

            if (result) {   // 사용자 암호가 암호가 일치하면
              var sessionUser = {
                // userPSeq: exUser.member_idx,
                user_id: exUser.user_id,
                nickName: exUser.nickName,
                // userTelephone: exUser.usertelephone,
              };
              //사용자 정보 전달
              done(null, sessionUser);
            } else {
                // 사용자 암호가 일치하지 않은 경우
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            done(null, false, { message: '아이디가 존재하지 않습니다.' });
          }
        } catch (error) {
            // 수집된 에러를 전역 에러처리하는 곳으로 보냄
          console.error(error);
          done(error);
        }
      },
    ),
  );
};