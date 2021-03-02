module.exports = function(app){
    const cafeReview = require('../controllers/cafeReviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.post('/cafe/:cafeid/review', jwtMiddleware, cafeReview.postReview); //리뷰 생성
    
    app.route('/cafe/:cafeid/review').get(cafeReview.getReview); // 리뷰 조회

    app.patch('/cafe/review/:reviewid',jwtMiddleware,cafeReview.patchReview); //리뷰 수정

    app.delete('/cafe/review/:reviewid',jwtMiddleware,cafeReview.deleteReview); //리뷰 삭제


};