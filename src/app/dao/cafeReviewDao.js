const { pool } = require("../../../config/database");

//리뷰 생성
//post review
async function insertCafeReview(insertCafeReviewParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertCafeReviewQuery = `
  
  INSERT INTO CafeReview(content,cafeStar,cafeId,userId)
  VALUES (?,?,?,?);
    `;
  const insertCafeReviewRow = await connection.query(
    insertCafeReviewQuery,
    insertCafeReviewParams
  );
  connection.release();
  return insertCafeReviewRow ;
}

//리뷰 조회
//get review
async function getReview1(getCafeReviewParams)  {
  const connection = await pool.getConnection(async (conn) => conn);
  const getReview1Query = `
  select reviewId,User.userId,
       content, date_format(CafeReview.createdAt,'%Y.%m.%d')as 'createdTime',
       CafeReview.cafeStar,User.userName

       from CafeReview
inner join User on User.userId = CafeReview.userId
where CafeReview.cafeId = ?
order by CafeReview.createdAt desc;
                `;
  const [showGetReview1] = await connection.query(
    getReview1Query,
    getCafeReviewParams
  );
  connection.release();

  return showGetReview1;
}

// 리뷰 수정
//patch review
async function patchCafeReview(patchCafeReviewParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchCafeReviewQuery = `
  update CafeReview set content=? , cafeStar=?,updatedAt=current_time 
  where reviewId = ?;
    `;
  const patchCafeReviewQueryRow = await connection.query(
    patchCafeReviewQuery,
    patchCafeReviewParams
  );
  connection.release();
  return patchCafeReviewQueryRow  ;
}

// 리뷰 삭제
//delete review
async function deleteCafeReview(deleteCafeReviewParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteCafeReviewQuery = `
  delete from CafeReview where reviewId = ?;
    `;
  const deleteCafeReviewQueryRow = await connection.query(
    deleteCafeReviewQuery,
    deleteCafeReviewParams
  );
  connection.release();
  return deleteCafeReviewQueryRow ;
}


// 리뷰 수정 권한 체크
async function cafeReviewAccessCheck(reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cafeReviewAccessCheckQuery = `
  select userId from CafeReview where reviewId =?;
    `;
  const patchCafeReviewQueryRow = await connection.query(
    cafeReviewAccessCheckQuery,
    reviewId
  );
  connection.release();
  return patchCafeReviewQueryRow  ;
}


module.exports = {
  insertCafeReview,
  getReview1,
  patchCafeReview,
  deleteCafeReview,
  cafeReviewAccessCheck
};

