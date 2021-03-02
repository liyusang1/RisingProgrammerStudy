module.exports = function(app){
    const theme = require('../controllers/themeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/theme',theme.getTheme); //테마검색
    app.get('/theme/:themeid',theme.getThemeDetail); //테마 상세 검색
    app.get('/theme/:themeid/review',theme.getThemeReview); //테마 리뷰 상세조회

    app.post('/theme/:themeid/review',jwtMiddleware,theme.postThemeReview); //테마 리뷰 작성

    app.patch('/theme/review/:reviewid',jwtMiddleware,theme.patchThemeReview); //테마 리뷰 수정

    app.delete('/theme/review/:reviewid',jwtMiddleware,theme.deleteReview); //테마 리뷰 삭제
}; 
