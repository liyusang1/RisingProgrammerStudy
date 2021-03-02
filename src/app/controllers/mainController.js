const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const mainDao = require('../dao/mainDao');

exports.getMain = async function (req, res) {

    try {
        const showMain1 = await mainDao.Main1();
        const showMain2 = await mainDao.Main2();
        const showMain3 = await mainDao.Main3();
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showMain1)
        console.log(showMain2)
        console.log(showMain3)

        if (showMain1.length>0 && showMain2.length>0 && showMain3.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회 성공",
                Result : { Event : showMain1, Cafe : showMain2,Theme : showMain3}
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

