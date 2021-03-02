const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const boardDao = require('../dao/boardDao');

exports.getBoard = async function (req, res) {

    try {
        const boardRows = await boardDao.selectBoard();
        const Rows = await boardDao.showBoard();
        
        console.log(Rows)
        console.log(boardRows)

        if (boardRows.length>0 && Rows.length>0  ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                data : boardRows,
                data2 :Rows
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


exports.Board = async function (req, res) {

    try {
        const Rows = await boardDao.showBoard();

        console.log(Rows)

        if (Rows.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                data : Rows
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


