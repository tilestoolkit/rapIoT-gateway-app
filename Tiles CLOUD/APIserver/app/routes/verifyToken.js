/**
 * Created by Jonas on 29.10.2015.
 */
var jwt = require('jsonwebtoken');

/**
 * Verifies a token. used with a route (Express.Route().use(<>))
 * @param req request from user
 * @param res response to send back to connected user
 * @param next next function to call on success
 */
var tokenVerify = function (req, res, next) {
    //retrieve token from request
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {//if token is set..
        jwt.verify(token, req.app.get('secret'), function (error, decoded) {//verify it
            if (error)
                return res.json({error: true, message: 'Failed to authenticate token.'});
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(403).send({error: true, message: 'No token provided.'});
    }
};

/**
 * Creates a token
 * @param {{User}} user model
 * @param secret secret to create token from
 */
var tokenCreator=function(user,secret){
  return jwt.sign(user,secret,{expiresIn:43200});
};

module.exports={verify:tokenVerify,create:tokenCreator};