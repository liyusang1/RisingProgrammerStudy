module.exports = function(app){
    const cafe = require('../controllers/cafeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/cafe',cafe.getCafe);
    app.get('/cafe/:cafeid',cafe.getCafeDetailedInfo);
}; 

