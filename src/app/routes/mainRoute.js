module.exports = function(app){
    const main = require('../controllers/mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/main',main.getMain);
}; 
