module.exports = function(app){
    const board = require('../controllers/BoardController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/board',board.getBoard);
    app.get('/app/board1',board.Board);
}; 


