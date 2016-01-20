'use strict';
var async = require('async');
var mongoose = require('mongoose'),
User = mongoose.model('User'),
Team = mongoose.model('Team'),
passport = require('passport');

exports.listUsers = function(req, res, next){
  User.find({}, function(err, users){
    if(err){return next(new Error('Failed to load list of users'));}
    var userProfiles = [];
    users.forEach(function(user){
      userProfiles.push(user.get('profile'));
    });
    if(userProfiles){
      res.send(userProfiles);
    }else{
      res.send(404, 'Users not found');
    }
  });
};

exports.deleteUser = function(req, res, next){
  var userId = req.params.id;
  var teamId = '';
  async.series([
    function(callback){
      User.findById(userId, function(error, user){
        if(error){callback(error)}
        teamId = user.teamId;
        callback();
      });
    },
    function(callback){
      async.parallel([
        function(callback){
          User.findByIdAndRemove(userId, function(err){
            if(err){return callback(err);}
            callback();
          });
        },
        function(callback){
          Team.findByIdAndRemove(teamId, function(err){
            if(err){return callback(err);}
            callback();
          });
        }
      ], function(err, results){
        if(err){return next(new Error('error in parallel delete'));}
        callback();
      });
    }
  ], function(err, results){
    if(err){return next(new Error('error in async.series call'));}
    User.find({}, function(err, users){
      if(err){return next(new Error('Failed to load list of users'));}
      var userProfiles = [];
      users.forEach(function(user){
        userProfiles.push(user.get('profile'));
      });
      if(userProfiles){
        res.send(userProfiles);
      }else{
        res.send(404, 'Users not found');
      }
    });
  });
};

exports.createUser = function(req, res, next){
  var userTeam = new Team({ownerName:req.body.name, newTeam:true, rosterSet:false});
  userTeam.save(function(err){
    if(err){return res.json(500,err);}
    if(!userTeam._id){return res.json(500, 'load did not produce id');}
    console.log('team id: '+userTeam._id);

    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.teamId = userTeam._id;
    newUser.save(function(err){
      if(err){
        if(err.errors.email.type === 'Value is not unique'){
          err.errors.email.type = 'The specified email address is already in use';
        }
        return res.json(400, err);
      }
      req.logIn(newUser, function(err){
        if(err){return next(err);}
        return res.json(req.user.userInfo);
      });
    });
  });
};

exports.show = function(req, res, next){
  var userId = req.params.id;
  User.findById(userId, function(err, user){
    if(err){return next(new Error('Failed to load User'));}
    if(user){
      res.send({profile:user.profile});
    }else{
      res.send(404, 'User Not Found');
    }
  });
};

exports.user = function(req, res, next, id){
  User.findById(id, function(err, user){
    if(err){return next(new Error('Failed to load User'));}
    if(err){
      return next(err);
    }
    if(!user){
      return next(new Error('Failed to load User '+ id));
    }
    req.user = user;
    next();
  });
};

exports.changePassword = function(req, res, next){
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function(err, user){
    if(user.authenticate(oldPass)){
      user.password = newPass;
      user.save(function(err){
        if(err){
          res.send(500,err);
        }else{
          res.send(200);
        }
      });
    }else{
      res.send(400);
    }
  });
};

exports.me = function(req, res){
  res.json(req.user || null);
};
