const { pool } = require("../../../config/database");


async function selectBoard()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectBoardQuery = `
  select themeId,themeName as '테마 \이름',
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as '테마 난이도',
themeImgUrl as '테마 이미지',
themeStar as '테마 별점'
from Theme;
                `;
  //const selectEmailParams = [email];
  const [boardRows] = await connection.query(
    selectBoardQuery,
  );
  connection.release();

  return boardRows;
}

async function showBoard()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const showBoardQuery = `
  select cafeId,cafeName as '카페 이름',cafeStar as '카페 별점',
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS '카페 \까지 \거리',
       cafeImgUrl as '카페 사진'
FROM Cafe
inner join User on User.userId = '1'
                `;
  //const selectEmailParams = [email];
  const [Rows] = await connection.query(
    showBoardQuery,
  );
  connection.release();

  return Rows;
}

module.exports = {
  selectBoard,
  showBoard
}; 
 