const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const cafeReviewDao = require('../dao/cafeReviewDao');
const { constants } = require('buffer');
const cafeRoute = require('../routes/cafeRoute');

//리뷰 생성
exports.postReview = async function (req, res) {
    const {
        content, cafeStar
    } = req.body;

    const {userId} = req.verifiedToken

    cafeId =req.params.cafeid;

    if (!content) return res.json({isSuccess: false, code: 301, message: "리뷰를 작성해 주세요."});

    if (content.length < 5) return res.json({
        isSuccess: false,
        code: 302,
        message: "리뷰는 5자 이상으로 입력해주세요."
    });

    if (!cafeStar) return res.json({isSuccess: false, code: 304, 
        message: "별점을 입력 해주세요."});

    if (!userId) return res.json({isSuccess: false, code: 305, 
        message: "사용자 정보가 있어야 합니다."});

    if (!cafeId) return res.json({isSuccess: false, code: 306, 
        message: "카페 정보가 있어야 합니다."});

    if (cafeStar.length > 5 || cafeStar.length < 1) return res.json({
        isSuccess: false,
        code: 305,
        message: "별점은 1 ~ 5점 사이의 값만 입력이 가능합니다."
    });
        try {
            const insertCafeReviewParams = [content,cafeStar,cafeId,userId];
            const insertUserRows = await cafeReviewDao.insertCafeReview(insertCafeReviewParams);

          //  await connection.commit(); // COMMIT
           // connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "리뷰 작성 성공",
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

//리뷰 조회
exports.getReview = async function (req, res) {
   
    cafeId =req.params.cafeid;
    
    try {
        const getCafeReviewParams = [cafeId];
        const getCafeReviewRows = await cafeReviewDao.getReview1(getCafeReviewParams);

        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(getCafeReviewRows)
  
        if (getCafeReviewRows.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "리뷰 조회 성공",
                Result : getCafeReviewRows
            });
        }

        if (!cafeId) return res.json({isSuccess: false, code: 306, 
            message: "카페 id가 있어야 합니다."});

        return res.json({
            isSuccess: false,
            code: 300,
            message: "리뷰 조회 실페"
        });
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

//리뷰 수정
exports.patchReview = async function (req, res) {
    const {
        content, cafeStar
    } = req.body;

    const {userId} = req.verifiedToken
    reviewId =req.params.reviewid;

    if (!content) return res.json({isSuccess: false, code: 301, message: "수정할 리뷰를 작성해 주세요."});
    
    if (content.length < 5) return res.json({
        isSuccess: false,
        code: 302,
        message: "리뷰는 5자 이상으로 입력해주세요."
    });

    if (!reviewId) return res.json({isSuccess: false, code: 302, 
        message: "리뷰 아이디가 있어야 합니다."});

    if (!cafeStar) return res.json({isSuccess: false, code: 304, 
        message: "별점을 입력 해주세요."});

    if (cafeStar.length > 5 || cafeStar.length < 1) return res.json({
        isSuccess: false,
        code: 305,
        message: "별점은 1 ~ 5점 사이의 값만 입력이 가능합니다."


    });
        try {
            const [reviewAccessCheck] = await cafeReviewDao.cafeReviewAccessCheck(reviewId);

            if (reviewAccessCheck[0].userId !== userId) {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 311,
                    message: "리뷰 수정 권한이 없습니다."
                });
            }

            const patchCafeReviewParams = [content,cafeStar,reviewId];
            const patchCafeReviewRows = await cafeReviewDao.patchCafeReview(patchCafeReviewParams);

          //  await connection.commit(); // COMMIT
           // connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "리뷰 수정 성공",
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

//리뷰 삭제
exports.deleteReview = async function (req, res) {

    reviewId =req.params.reviewid;
    const {userId} = req.verifiedToken

    if (!reviewId) return res.json({isSuccess: false, code: 302, 
        message: "리뷰 아이디가 있어야 합니다."});

        try {
            const [reviewAccessCheck] = await cafeReviewDao.cafeReviewAccessCheck(reviewId);

            if (reviewAccessCheck[0].userId !== userId) {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 311,
                    message: "리뷰 수정 권한이 없습니다."
                });
            }
            const deleteCafeReviewParams = [reviewId];
            const deleteCafeReviewRows = await cafeReviewDao.deleteCafeReview(deleteCafeReviewParams);

          //  await connection.commit(); // COMMIT
          // connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "리뷰 삭제 성공",
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

/**
 update : 2019.09.23
 03.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};