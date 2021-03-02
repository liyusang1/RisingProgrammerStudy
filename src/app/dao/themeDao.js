const { pool } = require("../../../config/database");

//테마 검색 부분
async function SearchTheme()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const SearchThemeQuery = `
  select themeId,themeDevice,themeActivity,
       recommendedPerTwoOn,recommendedPerThreeOn,recommendedPerFourOn,
           themeImgUrl,themeName,
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as 'themeDifficulty',
themeStar,timeLimit,cafeName,themeGenre
from Theme
inner join Cafe where Cafe.cafeId = Theme.cafeId;
                `;
  //const selectEmailParams = [email];
  const [showSearchTheme] = await connection.query(
    SearchThemeQuery,
  );
  connection.release();

  return showSearchTheme;
}

//테마 상세 조회 부분
async function ThemeDetailInfo1(getThemeDetailParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const ThemeDetailedInfo1Query = `
  select Theme.themeId,themeDevice,themeActivity,
       recommendedPerTwoOn,recommendedPerThreeOn,recommendedPerFourOn,
           themeImgUrl,themeName,
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as 'themeDifficulty',
themeStar,timeLimit,cafeName,themeInfo

from Theme
inner join ThemeHearted
inner join Cafe where Cafe.cafeId = Theme.cafeId And Theme.themeId=?
                  And UserId = '1' And ThemeHearted.themeId =? -- 유저 1 기준
                `;
  const [showThemeDetailedInfo1] = await connection.query(
    ThemeDetailedInfo1Query,
    getThemeDetailParams
  );
  connection.release();

  return showThemeDetailedInfo1;
}

//테마 상세 조회 리뷰 조회
async function getThemeReview(getThemeDetailParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getThemeReviewQuery = `
  select content,
  date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdTime',

  likeCount,themeStar,
  (case
   when themeDifficulty = '0' then '매우 쉬움'
   when themeDifficulty = '1' then '쉬움'
   when themeDifficulty = '2' then '보통'
   when themeDifficulty = '3' then '어려움'
   when themeDifficulty = '4' then '아주 어려움'
   else 'error'
   end
)as 'themeDifficulty',
useHintCount, userName,
escapeSuccess, remainTime
from ThemeReview
inner join User on User.userId = ThemeReview.userId
where themeId = ?
order by ThemeReview.createdAt desc;
                `;
  const [showgetThemeReview] = await connection.query(
    getThemeReviewQuery,
    getThemeDetailParams
  );
  connection.release();

  return showgetThemeReview;
}

//테마 상세 조회 리뷰상세 조회 부분 (리뷰 더 보기 부분) getthemereview
async function getMoreThemeReview(getThemeReviewParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getMoreThemeReviewQuery = `
  select reviewId,content,
  date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdTime',

  likeCount,themeStar,
  (case
   when themeDifficulty = '0' then '매우 쉬움'
   when themeDifficulty = '1' then '쉬움'
   when themeDifficulty = '2' then '보통'
   when themeDifficulty = '3' then '어려움'
   when themeDifficulty = '4' then '아주 어려움'
   else 'error'
   end
)as 'themeDifficulty',
useHintCount, userName,
escapeSuccess, remainTime
from ThemeReview
inner join User on User.userId = ThemeReview.userId
where themeId = ?
order by ThemeReview.createdAt desc;
                `;
  const [showGetMoreThemeReview] = await connection.query(
    getMoreThemeReviewQuery,
    getThemeReviewParams 
  );
  connection.release();

  return showGetMoreThemeReview;
}

//테마 리뷰 생성
//post theme review
async function insertThemeReview(insertThemeReviewParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertThemeReviewQuery = `
  
  INSERT INTO ThemeReview
  (content, themeStar,themeDifficulty,useHintCount,userId,escapeSuccess,remainTime,themeId)
  VALUES (?,?,?,?,?,?,?,?);
    `;
  const showThemeReviewRow = await connection.query(
    insertThemeReviewQuery,
    insertThemeReviewParams
  );
  connection.release();
  return showThemeReviewRow;
}

//테마 리뷰 수정
//patch theme review
async function patchThemeReview(PatchThemeReviewParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchThemeReviewQuery = `

  update ThemeReview set content=? ,themeStar=?, themeDifficulty=?,useHintCount=?,
  escapeSuccess=?,remainTime=?,updatedAt=current_time
  
  where reviewId = ?;
    `;
  const showpatchThemeReviewRow = await connection.query(
    patchThemeReviewQuery,
    PatchThemeReviewParams
  );
  connection.release();
  return showpatchThemeReviewRow
}

//테마 리뷰 삭제
//delete theme review
async function deleteThemeReview(deleteThemeReviewParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteThemeReviewQuery = `

  delete from ThemeReview where reviewId = ?;
    `;
  const showDeleteThemeReviewRow = await connection.query(
    deleteThemeReviewQuery,
    deleteThemeReviewParams
  );
  connection.release();
  return showDeleteThemeReviewRow
}

// 리뷰 수정 권한 체크
async function ReviewAccessCheck(reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const ReviewAccessCheckQuery = `
  select userId from ThemeReview where reviewId =?;
    `;
  const patchCafeReviewQueryRow = await connection.query(
    ReviewAccessCheckQuery,
    reviewId
  );
  connection.release();
  return patchCafeReviewQueryRow  ;
}

module.exports = {
  SearchTheme,
  ThemeDetailInfo1,
  getThemeReview,
  getMoreThemeReview,
  insertThemeReview,
  patchThemeReview,
  deleteThemeReview,
  ReviewAccessCheck
}; 
 