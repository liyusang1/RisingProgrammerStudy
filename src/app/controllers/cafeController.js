const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const cafeDao = require('../dao/cafeDao');

//카페조회
exports.getCafe = async function (req, res) {

    try {
        const showCafe1 = await cafeDao.Cafe1();
        //const showMain2 = await mainDao.Main2();
        //const showMain3 = await mainDao.Main3();
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showCafe1)
        //console.log(showMain2)
        //console.log(showMain3)

        if (showCafe1.length>0) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : {Cafe:showCafe1},
              
            });
        }

        return res.json({
            isSuccess: false,
            code: 300,
            message: "게시물이 존재하지 않습니다"
        });
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

// 카페 상세 조회
exports.getCafeDetailedInfo = async function (req, res) {

    cafeId =req.params.cafeid;
    
    if (!cafeId) return res.json({isSuccess: false, code: 306, 
        message: "카페 id가 있어야 합니다."});

    try {
        const getCafeDetailedInfoParams = [cafeId];
        const showCafeDetailedInfo1 = await cafeDao.CafeDetailedInfo1(getCafeDetailedInfoParams);
        const showCafeDetailedInfo2 = await cafeDao.CafeDetailedInfo2(getCafeDetailedInfoParams);
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showCafeDetailedInfo1)
        console.log(showCafeDetailedInfo2)

        if (showCafeDetailedInfo1.length>0 && showCafeDetailedInfo2.length>0) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : { Cafe : showCafeDetailedInfo1,  Theme : showCafeDetailedInfo2}
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


