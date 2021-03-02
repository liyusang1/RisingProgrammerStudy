const { pool } = require("../../../config/database");

// Signup
async function userEmailCheck(userEmail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
                SELECT userEmail, userName 
                FROM User 
                WHERE userEmail = ?;
                `;
  const selectEmailParams = [userEmail];
  const [emailRows] = await connection.query(
    selectEmailQuery,
    selectEmailParams
  );
  connection.release();

  return emailRows;
}

async function userNicknameCheck(userName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                    SELECT userEmail
                    FROM User 
                    WHERE userName = ?;
                `;
  const selectNicknameParams = [userName];
  const [nicknameRows] = await connection.query(
    selectNicknameQuery,
    selectNicknameParams
  );
  connection.release();
  return nicknameRows;
}

async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserInfoQuery = `
        INSERT INTO User(userEmail,userPassword,userName)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  connection.release();
  return insertUserInfoRow;
}

//SignIn
async function selectUserInfo(userEmail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT userId, userEmail , userPassword, userName, status,
                userLatitude,userHardness
                FROM User
                WHERE userEmail = ?;
                `;

 let selectUserInfoParams = [userEmail];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  connection.release();
  return [userInfoRows];
}


//사용자 조회
async function UserInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoQuery = `
  select userName,
  userImageUrl,userPoint

  from User where userId = ?;
                `;
  const [showUserInfo] = await connection.query(
    userInfoQuery,
    userId
  );
  connection.release();

  return showUserInfo;
}

//찜한카페 조회
async function HeartedCafe(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const HeartedCafeQuery = `
  select CafeHearted.cafeId,cafeName,cafeStar,
       round((6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude)))),1)
    AS 'cafeDistance',cafeImgUrl
       from Cafe
inner join User
inner join CafeHearted where CafeHearted.userId = ? AND CafeHearted.cafeId=Cafe.cafeId
And User.userId = CafeHearted.userId
order by CafeHearted.createdAt desc;
                `;
  const [showUserInfo] = await connection.query(
    HeartedCafeQuery,
    userId
  );
  connection.release();

  return showUserInfo;
}

//찜한카페 체크
async function HeartedCheck(HeartedOnParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const HeartedCheckQuery = `

  select userId, cafeId from CafeHearted where userId =? and cafeId = ?
  
                `;
  const [showHeartedCheck] = await connection.query(
    HeartedCheckQuery,
    HeartedOnParams
  );
  connection.release();

  return showHeartedCheck;
}


// 카페 찜하기
async function HeartedCafeOn(HeartedOnParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const HeartedCafeOnQuery = `

  INSERT INTO CafeHearted(userId,cafeId)
        VALUES (?,?);
  
                `;
  const [showHeartedCafeOn] = await connection.query(
    HeartedCafeOnQuery ,
    HeartedOnParams
  );
  connection.release();

  return showHeartedCafeOn;
}

// 카페 찜 해제
async function HeartedCafeOff(HeartedOnParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const HeartedCafeOffQuery = `

  delete from CafeHearted where userId= ? and cafeId =?;
  
                `;
  const [showHeartedCafeOn] = await connection.query(
    HeartedCafeOffQuery ,
    HeartedOnParams
  );
  connection.release();

  return showHeartedCafeOn;
}

//유저의 찜한테마 조회
async function getHeartedTheme(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getHeartedThemeQuery = `

  select Theme.themeId,themeImgUrl,themeActivity,themeDevice,themeStar,themeDifficulty,timeLimit,
       themeName,themeGenre,cafeName
       from Theme
inner join User
inner join Cafe
inner join ThemeHearted where ThemeHearted.userId = ? AND ThemeHearted.themeId=Theme.themeId
                          and Cafe.cafeId = Theme.cafeId

And User.userId = ThemeHearted.userId
order by ThemeHearted.createdAt desc;
 
                `;
  const [showHeartedTheme] = await connection.query(
    getHeartedThemeQuery,
    userId
  );
  connection.release();

  return showHeartedTheme;
}

//찜한테마 체크
async function themeHeartedCheck(HeartedOnParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const HeartedCheckQuery = `

  select userId, themeId from ThemeHearted where userId =? and themeId = ?
  
                `;
  const [showHeartedCheck] = await connection.query(
    HeartedCheckQuery,
    HeartedOnParams
  );
  connection.release();

  return showHeartedCheck;
}

// 테마 찜하기
async function HeartingTheme(HeartedOnParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const HeartingThemeQuery = `

  INSERT INTO ThemeHearted(userId,themeId)
        VALUES (?,?);
  
                `;
  const [HeartedThemeOn] = await connection.query(
    HeartingThemeQuery ,
    HeartedOnParams
  );
  connection.release();

  return HeartedThemeOn;
}

// 테마 찜 해제
async function unheartingTheme(HeartedOnParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const unheartingThemeQuery = `

  delete from ThemeHearted where userId= ? and themeId =?;
  
                `;
  const [showUnheartingTheme] = await connection.query(
    unheartingThemeQuery ,
    HeartedOnParams
  );
  connection.release();

  return showUnheartingTheme;
}

module.exports = {
  userEmailCheck,
  userNicknameCheck,
  insertUserInfo,
  selectUserInfo,
  UserInfo,
  HeartedCafe,
  HeartedCheck,
  HeartedCafeOn,
  HeartedCafeOff,
  getHeartedTheme,
  themeHeartedCheck,
  HeartingTheme,
  unheartingTheme
};
