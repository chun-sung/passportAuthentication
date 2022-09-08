const { router } = require("./app");




//JWT 토큰 생성하기
// 화면에서 입력한 데이터를 json데이터로 만들고 만들어진 json데이터를 jwt토큰으로 생성해 보자.
router.get('/token', async(req, res, next) => {
    res.render('member/makejwt', {userDate});
})