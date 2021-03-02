module.exports = function(app){
    const reserve = require('../controllers/reserveController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/reserve',jwtMiddleware,reserve.reserveTheme); //예약하기

    app.get('/reserve',jwtMiddleware,reserve.reserveCheck); //나의 예약확인

    app.delete('/reserve/:reserveid',jwtMiddleware,reserve.deleteReserve); //예약 해제

    app.get('/reserve/theme/:themeid',reserve.allReserveCheck); 
    //테마의 모든 예약 조회

}; 
