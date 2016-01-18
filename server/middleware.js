'use strict';
module.exports = {
  auth: function auth(req, res, next){
    if(req.isAuthenticated()) return next();
    res.send(401);
  },
  admin:function auth(req, res, next){
    if(req.isAuthenticated()&&req.user.role === 'admin')return next();
    res.send(401);
  },
  setUserCookie:function(req, res, next){
    if(req.user){
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  }
};
