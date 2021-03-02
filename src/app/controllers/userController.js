const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');

/**
 update : 2020.10.4
 01.signUp API = 회원가입
 */
exports.signUp = async function (req, res) {
    const {
        userEmail, userPassword,checkUserPassword,userName
    } = req.body;

    //if (!isEmail(userEmail))
    // return res.json({isSuccess: false, code: 300, message: "이메일 형식이 올바르지 않습니다."});

    if (!userEmail) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});

    if (userEmail.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(userEmail)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!userPassword) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});

    if (userPassword.length < 8 || userPassword.length > 20) return res.json({
        isSuccess: false,
        code: 305,
        message: "비밀번호는 8~20자리로 입력해주세요."
    });

    if (!checkUserPassword) return res.json({isSuccess: false, code: 306, message: "비밀번호 확인을 입력해 주세요."});

    if (userPassword != checkUserPassword ) return res.json({isSuccess: false, code: 307, message: "비밀번호와 비밀번호 확인이 다릅니다."});

    if (!userName) return res.json({isSuccess: false, code: 308, message: "닉네임을 입력 해주세요."});

    if (userName.length > 10) return res.json({
        isSuccess: false,
        code: 309,
        message: "닉네임은 10자리 이하로 입력해주세요."
    });

    if (!/^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/.test(userName))
    return res.json({
      isSuccess: false,
      code: 310,
      message: "닉네임은 한글, 영문, 숫자만 입력가능하고 2자 이상이어야 합니다.",
    });

        try {
            // 이메일 중복 확인
            const emailRows = await userDao.userEmailCheck(userEmail);
            if (emailRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 311,
                    message: "중복된 이메일입니다."
                });
            }

            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(userName);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 312,
                    message: "중복된 닉네임입니다."
                });
            }

            // TRANSACTION : advanced
           // await connection.beginTransaction(); // START TRANSACTION
            const hashedPassword = await crypto.createHash('sha512').update(userPassword).digest('hex');
            const insertUserInfoParams = [userEmail, hashedPassword,  userName];
            
            const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);

          //  await connection.commit(); // COMMIT
           // connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "회원가입 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

/**
 update : 2020.10.4
 02.signIn API = 로그인
 **/
exports.signIn = async function (req, res) {
    const {
        userEmail, userPassword
    } = req.body;

    if (!userEmail) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});

    if (userEmail.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(userEmail)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!userPassword) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});

        try {
            const [userInfoRows] = await userDao.selectUserInfo(userEmail)

            if (userInfoRows.length < 1) {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 310,
                    message: "아이디를 확인해주세요."
                });
            }

            const hashedPassword = await crypto.createHash('sha512').update(userPassword).digest('hex');
            if (userInfoRows[0].userPassword !== hashedPassword) {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 311,
                    message: "비밀번호를 확인해주세요."
                });
            }
            if (userInfoRows[0].status === "INACTIVE") {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 312,
                    message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
                });
            } else if (userInfoRows[0].status === "DELETED") {
                //connection.release();
                return res.json({
                    isSuccess: false,
                    code: 313,
                    message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
                });
            }

            //토큰 생성
            let token = await jwt.sign({
                    userId: userInfoRows[0].userId,
                    userEmail: userInfoRows[0].userEmail,
                    userName: userInfoRows[0].userName,
                    userLatitude: userInfoRows[0].userLatitude,
                    userHardness: userInfoRows[0].userHardness,
                }, // 토큰의 내용(payload) 토큰이 위의 값을 가지고 있음
                
                secret_config.jwtsecret, // 비밀 키
                {
                    expiresIn: '365d',
                    subject: 'User',
                } // 유효 시간은 365일
            );

            res.json({
                result: userInfoRows,
                jwt: token,
                isSuccess: true,
                code: 200,
                message: "로그인 성공"
            });

            //connection.release();
        } catch (err) {
            logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
            //connection.release();
            return false;
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

//유저 조회
exports.getUserInfo = async function (req, res) {

    const {userId} = req.verifiedToken
    // const 는 블록 상수 지정
    // userId = req.verifiedToken.id를 대신 쓸 수 도 있음 !!

    try {
        const showUserInfo = await userDao.UserInfo(userId);
        //const showThemeDetail2 = await themeDao.getThemeReview(getReviewParams );
        
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showUserInfo)
        //console.log(showThemeDetail2)

        if (showUserInfo.length>0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : showUserInfo
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

//유저의 찜한 카페확인
exports.getHeartedCafe = async function (req, res) {

    const {userId} = req.verifiedToken
 
    try {
        const showHeartedCafe = await userDao.HeartedCafe(userId);
       
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showHeartedCafe)
    
        if (showHeartedCafe.length>=0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : showHeartedCafe
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

//유저의 카페 찜하기
exports.heartedCafe = async function (req, res) {

    const {userId} = req.verifiedToken
    cafeId =req.params.cafeid;

    if (!cafeId) return res.json({isSuccess: false, code: 302, 
        message: "찜할 카페 id가 있어야 합니다"});
 
    try {
        const HeartedOnParams = [userId,cafeId];
     
        //이미 찜한카페인지 확인
        const HeartedCheckRows = await userDao.HeartedCheck(HeartedOnParams);
            if (HeartedCheckRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 301,
                    message: "이미 찜한 카페입니다."
                });
            }
    
        const showHeartedCafe = await userDao.HeartedCafeOn(HeartedOnParams);
            return res.json({
                isSuccess: true,
                code: 200,
                message: "카페 찜 성공",
            });
       
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

//유저의 카페 찜 해제 하기
exports.heartedCafeOff = async function (req, res) {

    const {userId} = req.verifiedToken
    cafeId =req.params.cafeid;

    if (!cafeId) return res.json({isSuccess: false, code: 302, 
        message: "찜을 해제 할 카페 id가 있어야 합니다"});
 
    try {
        const HeartedOnParams = [userId,cafeId];
     
        //이미 해제한 카페인지 확인
        const HeartedCheckRows = await userDao.HeartedCheck(HeartedOnParams);
            if (!(HeartedCheckRows.length > 0)) {

                return res.json({
                    isSuccess: false,
                    code: 301,
                    message: "이미 찜을 해제한 카페입니다."
                });
            }
    
        const showHeartedCafe = await userDao.HeartedCafeOff(HeartedOnParams);
            return res.json({
                isSuccess: true,
                code: 200,
                message: "카페 찜 해제 성공",
            });
       
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


//유저의 찜한 테마확인
exports.getHeartedTheme = async function (req, res) {

    const {userId} = req.verifiedToken
 
    try {
        const showHeartedTheme = await userDao.getHeartedTheme(userId);
       
        //없어도 됨 터미널 로그 출력 원할시 사용
        console.log(showHeartedTheme)
    
        if (showHeartedTheme.length>=0 ) {
    
            return res.json({
                isSuccess: true,
                code: 200,
                message: "조회성공",
                Result : showHeartedTheme
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

//유저의 테마 찜하기
exports.heartedThemeOn = async function (req, res) {

    const {userId} = req.verifiedToken
    themeId =req.params.themeid;

    if (!themeId) return res.json({isSuccess: false, code: 302, 
        message: "찜할 테마 id가 있어야 합니다"});
 
    try {
        const HeartedOnParams = [userId,themeId];
     
        //이미 찜한테마인지 확인
        const HeartedCheckRows = await userDao.themeHeartedCheck(HeartedOnParams);
            if (HeartedCheckRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 301,
                    message: "이미 찜한 테마입니다."
                });
            }
    
        const HeartedTheme = await userDao.HeartingTheme(HeartedOnParams);
            return res.json({
                isSuccess: true,
                code: 200,
                message: "테마 찜 성공",
            });
       
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

//유저의 테마 찜 해제 하기
exports.heartedThemeOff = async function (req, res) {

    const {userId} = req.verifiedToken
    themeId =req.params.themeid;

    if (!themeId) return res.json({isSuccess: false, code: 302, 
        message: "찜을 해제 할 테마 id가 있어야 합니다"});
 
    try {
        const HeartedOnParams = [userId,themeId];
     
        //이미 찜을 해제한 테마인지 확인
        const HeartedCheckRows = await userDao.themeHeartedCheck(HeartedOnParams);
            if (!(HeartedCheckRows.length > 0)) {

                return res.json({
                    isSuccess: false,
                    code: 301,
                    message: "이미 찜을 해제한 테마입니다."
                });
            }
    
        const showHeartedCafe = await userDao.unheartingTheme(HeartedOnParams);
            return res.json({
                isSuccess: true,
                code: 200,
                message: "테마 찜 해제 성공",
            });
       
    } catch (err) {
       // await connection.rollback(); // ROLLBACK
       // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};