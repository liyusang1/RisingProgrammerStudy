const { pool } = require("../../../config/database");


//테마예약확인
async function reservationCheck(ReservationCheckParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reservationCheckQuery = `

  select * from Reservation where reservationDate=? and 
  reservationTime=? and themeId =?;
  
                `;
  const [reservationCheck] = await connection.query(
    reservationCheckQuery,
    ReservationCheckParams
  );
  connection.release();

  return reservationCheck;
}

//테마 예약
async function reservation(ReservationParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reservationQuery = `

  insert into Reservation(reservationDate, reservationTime, themeId, userId)
  values (?,?,?,?);

    `;
  const Reservation = await connection.query(
    reservationQuery,
    ReservationParams
  );
  connection.release();
  return Reservation;
}

//예약한 테마 조회
async function getReservation(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getReservationQuery = `

  select cafeName,themeName,reservationDate,
       (case
          when reservationTime = 1 then '11:00 예약'
          when reservationTime = 2 then '12:00 예약'
          when reservationTime = 3 then '13:00 예약'
          when reservationTime = 4 then '14:00 예약'
          when reservationTime = 5 then '15:00 예약'
          when reservationTime = 6 then '16:00 예약'
          when reservationTime = 7 then '17:00 예약'
          when reservationTime = 8 then '18:00 예약'
          when reservationTime = 9 then '19:00 예약'
          when reservationTime = 10 then '20:00 예약'
          else 'error'
          end
       )as 'reservationTime',reserveId
from Reservation
inner join Cafe
inner join Theme
where Theme.themeId = Reservation.themeId and Theme.cafeId = Cafe.cafeId
and userId = ?;

    `;
  const [Reservation] = await connection.query(
    getReservationQuery,
    userId
  );
  connection.release();
  return Reservation;
}

//예약 수정 권한 조회
async function AccessCheck(reserveId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const AccessCheckQuery = `

  select userId from Reservation where reserveId =?;

    `;
  const AccessCheck = await connection.query(
    AccessCheckQuery,
    reserveId
  );
  connection.release();
  return AccessCheck;
}

//예약 삭제
async function delReservation(reserveId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const delReservationQuery = `

  delete from Reservation where reserveId = ?;

    `;
  const [deleteReservation] = await connection.query(
    delReservationQuery,
    reserveId
  );
  connection.release();
  return deleteReservation
}

// 예약된 모든 테마 조회 
async function getAllReservation(themeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getAllReservationQuery = `

  select cafeName,themeName,reservationDate,themeImgUrl,
       (case
          when reservationTime = 1 then '11:00 예약'
          when reservationTime = 2 then '12:00 예약'
          when reservationTime = 3 then '13:00 예약'
          when reservationTime = 4 then '14:00 예약'
          when reservationTime = 5 then '15:00 예약'
          when reservationTime = 6 then '16:00 예약'
          when reservationTime = 7 then '17:00 예약'
          when reservationTime = 8 then '18:00 예약'
          when reservationTime = 9 then '19:00 예약'
          when reservationTime = 10 then '20:00 예약'
          else 'error'
          end
       )as 'reservationTime',reserveId
from Reservation
inner join Cafe
inner join Theme
where Theme.themeId = Reservation.themeId and Theme.cafeId = Cafe.cafeId
and Theme.themeId = ?
order by reservationDate;
`;
  const [Reservation] = await connection.query(
    getAllReservationQuery,
    themeId
  );
  connection.release();
  return Reservation;
}

module.exports = {
  reservationCheck,
  reservation,
  getReservation,
  AccessCheck,
  delReservation,
  getAllReservation
}; 
 

