var mongoose = require('mongoose'),
async = require('async'),
League = mongoose.model('League'),
Team = mongoose.model('Team'),
passport = require('passport');

exports.allLeagues = function(req, res){
  League.find({}).populate('teams').exec(function(err, results){
    res.jsonp(results);
  });
};

exports.getLeague = function(req, res, next, id){
  League.findOne({_id:id}).populate('teams').exec(function(err, league){
    if(err){return next(err);}
    if(!league){return next(new Error('Failed to load league'+id));}
    req.league = league;
    next();
  });
};

exports.showLeague = function(req, res){
  res.jsonp(req.league);
};

exports.createLeague = function(req, res){
  var newLeague = new League(req.body);
  newLeague.save(function(err){
    if(err){return res.json(500,err);}
    League.find({}).populate('teams').exec(function(err, results){
      res.jsonp(results);
    });
  });
};

exports.addMessage = function(req, res){
  var leagueId;
  leagueId = req.body.leagueId;
  var teamId;
  teamId = req.body.teamId;
  var chatMessage = {};
  chatMessage.message = req.body.message;
  chatMessage.user = req.user._id;
  chatMessage.name = req.user.name;
  async.parallel([
    function(callback){
      League.update({_id:leagueId}, {$push:{chat:chatMessage}},{multi:false},function(err){
        if(err){console.log(err);}
        callback(err, 'ok');
      });
    }
  ], function(err){
    if(err){res.send(500,err);}
    Team.findOne({_id:teamId}).populate('player1').populate('player2').populate('player3').populate('player4').populate('leagues').exec(function(err, team){
      if(err){return res.json(500, err);}
      if(!team){return res.json(400, 'did not load team '+ teamId);}
      res.send(200, team);
    });
  });
};

exports.joinLeague = function(req, res){

}
