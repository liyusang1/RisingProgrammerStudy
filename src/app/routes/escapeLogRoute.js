module.exports = function(app){
    const escapeLog = require('../controllers/escapeLogController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/user/escapelog',jwtMiddleware,escapeLog.getEscapeLog); //나의 탈출일지 조회

    app.get('/user/:username/escapelog',escapeLog.getOtherEscapeLog); //탈출일지 엿보기

};