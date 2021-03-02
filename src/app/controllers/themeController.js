const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const themeDao = require('../dao/themeDao');

//테마조회
exports.getTheme = async function (req, res) {

    try {
        const showTheme = await themeDao.SearchTheme();
    
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showTheme)
   
        if (showTheme.length>0) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : showTheme, 
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

// 테마 상세 조회
exports.getThemeDetail = async function (req, res) {

    ThemeId =req.params.themeid;
    
    if (!ThemeId) return res.json({isSuccess: false, code: 306, 
        message: "테마 id가 있어야 합니다."});

    try {
        const getThemeDetailParams = [ThemeId,ThemeId];
        const getReviewParams = [ThemeId];
        const showThemeDetail1 = await themeDao.ThemeDetailInfo1(getThemeDetailParams);
        const showThemeDetail2 = await themeDao.getThemeReview(getReviewParams);
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showThemeDetail1)
        console.log(showThemeDetail2)

        if (showThemeDetail1.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : {Theme:showThemeDetail1,Review:showThemeDetail2}
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

// 테마 리뷰 상세 조회
exports.getThemeReview = async function (req, res) {

    ThemeId =req.params.themeid;
    
    if (!ThemeId) return res.json({isSuccess: false, code: 306, 
        message: "테마 id가 있어야 합니다."});

    try {
        const getThemeReviewParams = [ThemeId];
        const showThemeReview = await themeDao.getMoreThemeReview(getThemeReviewParams);
        //const showThemeDetail2 = await themeDao.getThemeReview(getReviewParams );
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showThemeReview )
        //console.log(showThemeDetail2)

        if (showThemeReview.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : showThemeReview 
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

//테마 리뷰 생성
exports.postThemeReview = async function (req, res) {
    const {
        content, themeStar,themeDifficulty,useHintCount,escapeSuccess,remainTime
    } = req.body;

    const {userId} = req.verifiedToken

    themeId =req.params.themeid;
  
    if (!content) return res.json({isSuccess: false, code: 301, message: "리뷰를 작성해 주세요."});
  
    /*
    if (content.length < 10) return res.json({
        isSuccess: false,
        code: 302,
        message: "리뷰는 10자 이상으로 입력해주세요."
    });*/
  
    if (!themeStar) return res.json({isSuccess: false, code: 304, 
        message: "별점을 입력 해주세요."});
  
    if (!themeDifficulty) return res.json({isSuccess: false, code: 305, 
        message: "테마 별점을 입력해야 합니다."});

     if (!userId) return res.json({isSuccess: false, code: 306, 
         message: "사용자 정보가 있어야 합니다."});
  
    if (themeStar.length > 5 || themeStar.length < 1) return res.json({
        isSuccess: false,
        code: 305,
        message: "별점은 1 ~ 5점 사이의 값만 입력이 가능합니다."
    });
        try {
            const insertThemeReviewParams = 
            [content, themeStar,themeDifficulty,useHintCount,userId,escapeSuccess,remainTime,themeId];

            const insertThemeReviewRows = await themeDao.insertThemeReview(insertThemeReviewParams);
        
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


//테마 리뷰 수정
exports.patchThemeReview = async function (req, res) {
    const {
        content, themeStar,themeDifficulty,useHintCount,escapeSuccess,remainTime
    } = req.body;

    const {userId} = req.verifiedToken

    reviewId =req.params.reviewid;
  
    if (!content) return res.json({isSuccess: false, code: 301, message: "수정할 리뷰를 작성해 주세요."});
  
    if (!themeStar) return res.json({isSuccess: false, code: 304, 
        message: "수정할 별점을 입력 해주세요."});
  
    if (!themeDifficulty) return res.json({isSuccess: false, code: 305, 
        message: "수정할 테마 난이도를 입력해 주세요."});

    if (themeStar.length > 5 || themeStar.length < 1) return res.json({
        isSuccess: false,
        code: 305,
        message: "별점은 1 ~ 5점 사이의 값만 입력이 가능합니다."
    });
        try {
            
            //리뷰 수정권한 체크
            const [reviewAccessCheck] = await themeDao.ReviewAccessCheck(reviewId);

            if (reviewAccessCheck[0].userId !== userId) {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 311,
                    message: "리뷰 수정 권한이 없습니다."
                });
            }

            const PatchThemeReviewParams = 
            [content, themeStar,themeDifficulty,useHintCount,escapeSuccess,remainTime,reviewId];

            const PatchThemeReviewRows = await themeDao.patchThemeReview(PatchThemeReviewParams);
        
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
             //리뷰 수정권한 체크
             const [reviewAccessCheck] = await themeDao.ReviewAccessCheck(reviewId);

             if (reviewAccessCheck[0].userId !== userId) {
                 //connection.release();
                 return res.json({
                     isSuccess: false,
                     code: 311,
                     message: "리뷰 수정 권한이 없습니다."
                 });
             }

            const deleteThemeReviewParams = [reviewId];
            const deleteThemeReviewRows = await themeDao.deleteThemeReview(deleteThemeReviewParams);

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