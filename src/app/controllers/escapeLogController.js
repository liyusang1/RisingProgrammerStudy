const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const escapeLogDao = require('../dao/escapeLogDao');

//탈출 일지 조회
exports.getEscapeLog = async function (req, res) {

    const {userId} = req.verifiedToken
    
    if (!userId) return res.json({isSuccess: false, code: 306, 
        message: "유저 id가 있어야 합니다."});

    try {
        const getEscapeLogParams = [userId];
        //진행했었던 테마 관련
        const showEscapeLog = await escapeLogDao.getEscapeLog(getEscapeLogParams);
        //성공률 관련
        const showEscapeLogRate = await escapeLogDao.getEscapeLogRate(getEscapeLogParams);
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showEscapeLog)
        console.log(showEscapeLogRate)

        if (showEscapeLog.length>0 && showEscapeLogRate.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : {showEscapeLogRate,showEscapeLog}
            });
        }

        return res.json({
            isSuccess: false,
            code: 300,
            message: "조회실패"
        });
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

//탈출 일지 엿보기
exports.getOtherEscapeLog = async function (req, res) {

    userName = req.params.username;

    if (!userName) return res.json({isSuccess: false, code: 306, 
        message: "유저 닉네임을 입력해 주세요."});

    try {

        //진행했었던 테마 관련
        const showEscapeLog = await escapeLogDao.getOtherEscapeLog(userName);
        //성공률 관련
        const showEscapeLogRate = await escapeLogDao.getOtherEscapeLogRate(userName);
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showEscapeLog)
        console.log(showEscapeLogRate)

        if (showEscapeLog.length>0 && showEscapeLogRate.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : {showEscapeLogRate,showEscapeLog}
            });
        }

        return res.json({
            isSuccess: false,
            code: 300,
            message: "조회실패"
        });
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};






