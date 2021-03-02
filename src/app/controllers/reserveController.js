const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const reserveDao = require('../dao/reserveDao');


//테마 예약
exports.reserveTheme = async function (req, res) {

    const {
        reservationDate,reservationTime,themeId
    } = req.body;

    //날짜 체크
    if(!/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/.test(reservationDate))
    return res.json({isSuccess: false, code: 301, 
        message: "올바른 날짜가 아닙니다. 유효한 날짜를 입력해 주세요."});

    //예약 시간 체크 1~10 사이의 값만 입력
    if (reservationTime < 1 || reservationTime >10) 
    return res.json({isSuccess: false, code: 302, 
        message: "올바르지 않은 예약 시간입니다. 1-10사이의 숫자를 입력하세요."});

    const {userId} = req.verifiedToken

    const ReservationCheckParams = [reservationDate,reservationTime,themeId];
    const ReservationParams = [reservationDate,reservationTime,themeId,userId];
    try {
        const reservationCheck = await reserveDao.reservationCheck(ReservationCheckParams);
        
        if (reservationCheck.length > 0) {

            return res.json({
                isSuccess: false,
                code: 303,
                message: "이미 예약이 있는 시간입니다. 다른 시간을 선택해 주세요."
            });
        }

        const reservation = await reserveDao.reservation(ReservationParams);

        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(reservation)
       
        if (reservation.length>0) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "예약 성공",
            });
        }

        return res.json({
            isSuccess: false,
            code: 300,
            message: "예약 실패, 에러 발생"
        });
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


//나의 예약 확인
exports.reserveCheck = async function (req, res) {

    const {userId} = req.verifiedToken
  
    try {
        
        const getReservation = await reserveDao.getReservation(userId);

        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(getReservation)
       
        if (getReservation.length>=0) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회 성공",
                result : getReservation
            });
        }

        return res.json({
            isSuccess: false,
            code: 300,
            message: "조회 실패, 에러 발생"
        });

    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

//예약 해제
exports.deleteReserve = async function (req, res) {

    reserveId =req.params.reserveid;

    const {userId} = req.verifiedToken

    try {

        //예약 해제 권한 체크
        const [reserveAccessCheck] = await reserveDao.AccessCheck(reserveId);

        if(!(reserveAccessCheck.length>0))
        return res.json({
            isSuccess: false,
            code: 301,
            message: "예약되어 있지 않습니다."
        });

        if (reserveAccessCheck[0].userId !== userId) 
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 302,
                message: "예약 해제 권한이 없습니다."
            });
        
        const deleteReservation = await reserveDao.delReservation(reserveId);

        //없어도 됨 터미널 로그 출력 원할시 사용
        //console.log(deleteReservation)
       
        return res.json({
            isSuccess: true,
            code: 200,
            message: "예약 해제 성공"
        });

    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


//모든 예약 확인
exports.allReserveCheck = async function (req, res) {

    themeId =req.params.themeid;

    try {
        
        const getReservation = await reserveDao.getAllReservation(themeId);

        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(getReservation)
       
        if (getReservation.length>=0) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회 성공",
                result : getReservation
            });
        }

        return res.json({
            isSuccess: false,
            code: 300,
            message: "조회 실패, 에러 발생"
        });

    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};