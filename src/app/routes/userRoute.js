module.exports = function(app){
    const user = require('../controllers/userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.route('/signup').post(user.signUp); //회원가입
    app.route('/signin').post(user.signIn);  //로그인
    app.get('/check', jwtMiddleware, user.check); //토큰 검증
    app.get('/user', jwtMiddleware, user.getUserInfo); //사용자 정보 확인
    app.get('/user/cafe', jwtMiddleware, user.getHeartedCafe); //유저가 찜한 카페 조회

    app.post('/user/cafe/:cafeid', jwtMiddleware, user.heartedCafe); //카페 찜하기
    app.delete('/user/cafe/:cafeid', jwtMiddleware, user.heartedCafeOff); //카페 찜 해제하기

    app.get('/user/theme', jwtMiddleware, user.getHeartedTheme); //유저가 찜한 테마 조회
    app.post('/user/theme/:themeid', jwtMiddleware, user.heartedThemeOn); // 테마 찜하기
    app.delete('/user/theme/:themeid', jwtMiddleware, user.heartedThemeOff); // 테마 찜 해제하기

};