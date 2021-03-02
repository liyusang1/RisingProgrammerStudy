const { pool } = require("../../../config/database");


//탈출일지 조회
//get escapelog
async function getEscapeLog(getEscapeLogParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getEscpaeLogQuery = `
  select

       Cafe.cafeName,Theme.themeName,
       ThemeReview.themeStar,
       ThemeReview.escapeSuccess, ThemeReview.remainTime ,
        (case
          when ThemeReview.themeDifficulty = '0' then '매우 쉬움'
          when ThemeReview.themeDifficulty = '1' then '쉬움'
          when ThemeReview.themeDifficulty = '2' then '보통'
          when ThemeReview.themeDifficulty = '3' then '어려움'
          when ThemeReview.themeDifficulty = '4' then '아주 어려움'
          else 'error'
          end
        )as 'themeDifficulty',
       date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdAt'

from ThemeReview
inner join Theme on Theme.themeId = ThemeReview.themeId
inner join Cafe on Cafe.cafeId = Theme.cafeId

where ThemeReview.userId = ?
order by ThemeReview.createdAt desc
;
                `;
  const [showEscpaeLog] = await connection.query(
    getEscpaeLogQuery,
    getEscapeLogParams
  );
  connection.release();

  return showEscpaeLog;
}

//성공률 관련
async function getEscapeLogRate(getEscapeLogParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getEscapeLogRateQuery = `

  select count(*) as reviewCount,
       count(case when escapeSuccess = 'Y' then 1 end) as 'successCount',
       count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) as 'successCountWithNoHint',

concat(round( count(case when escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentage,
       concat(round( count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentageWithNoHint

from ThemeReview where userId = ?
;
                `;
  const [showEscpaeLogRate] = await connection.query(
    getEscapeLogRateQuery,
    getEscapeLogParams
  );
  connection.release();

  return showEscpaeLogRate;
}

//탈출일지 엿보기
async function getOtherEscapeLog(userName)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getEscpaeLogQuery = `
  select

       Cafe.cafeName,Theme.themeName,
       ThemeReview.themeStar,
       ThemeReview.escapeSuccess, ThemeReview.remainTime ,
        (case
          when ThemeReview.themeDifficulty = '0' then '매우 쉬움'
          when ThemeReview.themeDifficulty = '1' then '쉬움'
          when ThemeReview.themeDifficulty = '2' then '보통'
          when ThemeReview.themeDifficulty = '3' then '어려움'
          when ThemeReview.themeDifficulty = '4' then '아주 어려움'
          else 'error'
          end
        )as 'themeDifficulty',
       date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdAt'

from ThemeReview
inner join Theme on Theme.themeId = ThemeReview.themeId
inner join Cafe on Cafe.cafeId = Theme.cafeId
inner join User

where User.userName= ? and User.userId=ThemeReview.userId
order by ThemeReview.createdAt desc
;
                `;
  const [showEscpaeLog] = await connection.query(
    getEscpaeLogQuery,
    userName
  );
  connection.release();

  return showEscpaeLog;
}

//탈출일지 엿보기 성공률 관련
async function getOtherEscapeLogRate(userName)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getEscapeLogRateQuery = `

  select count(*) as reviewCount,
       count(case when escapeSuccess = 'Y' then 1 end) as 'successCount',
       count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) as 'successCountWithNoHint',

concat(round( count(case when escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentage,
       concat(round( count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentageWithNoHint

from ThemeReview
inner join User
where User.userName=? and User.userId=ThemeReview.userId;
;
                `;
  const [showEscpaeLogRate] = await connection.query(
    getEscapeLogRateQuery,
    userName
  );
  connection.release();

  return showEscpaeLogRate;
}

module.exports = {
  getEscapeLog,
  getEscapeLogRate,
  getOtherEscapeLog,
  getOtherEscapeLogRate
};

