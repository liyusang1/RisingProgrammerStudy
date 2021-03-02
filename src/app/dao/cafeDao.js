const { pool } = require("../../../config/database");

//카페 검색 부분
async function Cafe1()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const cafe1Query = `
  select cafeId,cafeName ,cafeStar ,isPremium ,
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS 'cafeDistance',cafeImgUrl,isHearted

FROM Cafe
inner join User on User.userId = '1';
                `;
  //const selectEmailParams = [email];
  const [showCafe1] = await connection.query(
    cafe1Query,
  );
  connection.release();

  return showCafe1;
}

//카페 상세 조회 부분
async function CafeDetailedInfo1(getCafeDetailedInfoParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const CafeDetailedInfo1Query = `
  select Cafe.cafeId,cafeName ,cafeStar,
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS 'cafefDistance',
       cafeImgUrl,cafeInfoOneLine,
       cafeInfo,cafeFee,cafeLocation,
       cafelocationImgUrl, cafePhoneNumber,
       cafeReservationPage

FROM Cafe
inner join User on User.userId = '1'  -- 유저 1 기준
where cafeId = ?; 
                `;
  const [showCafeDetailedInfo1] = await connection.query(
    CafeDetailedInfo1Query,
    getCafeDetailedInfoParams
  );
  connection.release();

  return showCafeDetailedInfo1;
}

//카페 테마 조회 부분
async function CafeDetailedInfo2(getCafeDetailedInfoParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const CafeDetailedInfo2Query = `
  select themeName,
  (case
          when themeDifficulty = '0' then '매우 쉬움'
          when themeDifficulty = '1' then '쉬움'
          when themeDifficulty = '2' then '보통'
          when themeDifficulty = '3' then '어려움'
          when themeDifficulty = '4' then '아주 어려움'
          else 'error'
          end
  )as 'themeDifficulty', themeImgUrl, themeStar,themeGenre
  
  FROM Theme where cafeId = ?; -- 카페 1기준
                `;
  const [showCafeDetailedInfo2] = await connection.query(
    CafeDetailedInfo2Query,
    getCafeDetailedInfoParams
  );
  connection.release();

  return showCafeDetailedInfo2;
}

module.exports = {
  Cafe1,
  CafeDetailedInfo1,
  CafeDetailedInfo2
}; 
 