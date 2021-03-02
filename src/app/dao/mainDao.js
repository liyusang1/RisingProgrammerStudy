const { pool } = require("../../../config/database");

//이벤트 부분
async function Main1()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const Main1Query = `
  select eventId,eventName,eventImgUrl,eventPage,
       date_format(Event.createdAt,'%Y.%m.%d')as 'eventCreatedTime'
from Event
order by Event.createdAt desc;
                `;
  //const selectEmailParams = [email];
  const [showMain1] = await connection.query(
    Main1Query,
  );
  connection.release();

  return showMain1;
}

//카페 부분
async function Main2()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const Main2Query = `
  select cafeId,cafeName,cafeStar,
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS 'cafeDistance',
       cafeImgUrl
FROM Cafe
inner join User on User.userId = '1'
                `;
  //const selectEmailParams = [email];
  const [showMain2] = await connection.query(
    Main2Query,
  );
  connection.release();

  return showMain2;
}

//테마 부분
async function Main3()  {
  const connection = await pool.getConnection(async (conn) => conn);
  const Main3Query = `
  select themeId,themeName,themeDifficulty,themeImgUrl,themeStar
from Theme;
                `;
  //const selectEmailParams = [email];
  const [showMain3] = await connection.query(
    Main3Query,
  );
  connection.release();

  return showMain3;
}


module.exports = {
  Main1,
  Main2,
  Main3
}; 
 

