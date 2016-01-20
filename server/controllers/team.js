var mongoose = require('mongoose'),
Team = mongoose.model('Team'),
User = mongoose.model('User'),
Player = mongoose.model('Player'),
passport = require('passport');

exports.createTeam = function(req, res){
  var response = {};
  var newTeam = new Team(req.body);
  newTeam.save(function(err){
    if(err){return res.json(400, err);}
    User.findById(newTeam.userId, function(err, user){
      if(err){return res.json(500, err);}
      if(!user){return res.json(400, 'could not find user '+newTeam.userId);}
      user.teamId = newTeam._id;
      user.save(function(err){
        if(err){return res.json(400, err);}
      });
      response.team = req.body;
      response.teamId = user.teamId;
      res.json(200, response);
    });
  });
};

exports.getTeam = function(req, res, next, id){
  Team.findOne({_id:id}).populate('player1').populate('player2').populate('player3').populate('player4').populate('leagues').exec(function(err, team){
    if(err){return res.json(500, err);}
    if(!team){return res.json(400, 'did not load team '+ id);}
    req.team = team;
    next();
  });
};

exports.showTeam = function(req, res){
  res.jsonp(req.team);
};

exports.updateTeam = function(req, res){
  Team.findById(req.team._id, function(err, team){
    if(err){res.send(500, err);}
    if(!team){res.send(500, 'Failed to load team '+ req.team._id);}
    team.ownerName = req.body.ownerName;
    team.teamName = req.body.teamName;
    team.player1 = req.body.player1._id;
    team.player2 = req.body.player2._id;
    team.player3 = req.body.player3._id;
    team.player4 = req.body.player4._id;
    team.rosterSet = true;
    team.newTeam = false;
    team.save(function(err){
      if(err){res.send(500, err);}
      else{
        Team.fidOne({_id:team._id}).populate('leagues').populate('player1').populate('player2').populate('player3').populate('player4').exec(function(err, team){
          if(err){return res.json(500, err);}
          if(!team){return res.json(400, 'did not load team '+team._id);}
          res.send(200, team);
        });
      }
    });
  });
};

exports.deleteTeam = function(req, res){
  var team = req.team;
  team.remove(function(err){
    if(err){
      res.render('error', {status:500});
    }else{
      res.jsonp(1);
    }
  });
};
