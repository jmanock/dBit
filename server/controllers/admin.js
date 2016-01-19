'use strict';
var async = require('async');
var request = require('request');
var extend = require('util')._extend;

var mongoose = require('mongoose'),
Player = mongoose.model('Player'),
Tournament = mongoose.model('Tournament'),
Team = mongoose.model('Team'),
League = mongoose.model('League');

var sumPlayerScores = function(playerArray){
  var teamScores = {
    modstable:0,
    stable:0,
    sc:0
  };

  playerArray.forEach(function(player){
    if(player){
      teamScores.modstable += player.modstable;
      teamScores.stable += player.stable;
      teamScores.sc += player.sc;
    }
  });

  return teamScores;
};
var flattenObject = function(item){
  if(item){
    item = item._id;
  }
  return item;
};

exports.setup = function(req,res){
  async.parallel([
    function(callback){
      Tournament.find({}).remove(function(err){
        if(err){
          console.log('deleted tourneys');
          callback(err);
        }
      });
    },
    function(callback){
      request({uri:'http://www.pgatour.com/data/r/current/leaderboard.json',json:true},
    function(err, response, body){
      console.log('got leaderboard');
      callback(err, body);
    });
    }
  ], function(err, results){
    if(err){
      return res.json(500, err);
    }
    var setupFile, leaderboard = {};
    setupFile = results[2];
    leaderboard = results[3];

    if(typeof setupFile.trn === 'undefined' || typeof leaderboard.lb.c.c === 'undefined'){
      return res.json(500, 'Tournament setup record retrieved but undefined');
    }
    var setupObj ={
      field:setupFile.trn.field,
      rounds:setupFile.trn.rnds,
      courses:leaderboard.lb.c.c,
      name:leaderboard.lb.tn,
      date:leaderboard.lb.lt,
      pgaStatus:leaderboard.lb.rs,
      ballstrickersStatus:'Editable',
      totalRounds:setupFile.trn.event.totalRnds,
      currentRound:setupFile.trn.event.currentRnd,
      fedex:setupFile.trn.event.cup,
      money:setupFile.trn.event.money,
      history:setupFile.trn.event.hiestory,
    };
    if(setupObj.field){
      setupObj.field.forEach(function(player){
        var fieldPlayer = new Player(player);
        fieldPlayer.save(player, function(err){
          if(err){
            return res.json(500, err);
          }
        });
      });
    }
    Tournament.create(setupObj, function(err, item){
      if(err){
        return res.json(500, 'setup file not saved: '+err);
      }
      return res.send(200, 'Setup file saved: '+item._id);
    });
  });
};

exports.refreshSetup = function(req, res){
  async.parallel([
    function(callback){
      Tournament.find({}).remove(function(err){
        if(err){
          console.log('deleted tourneys');
          callback(err);
        }
      });
    },
    function(callback){
      request({uri:'https://www.pgatour.com/data/r/current/setup.json', json:true},
    function(err, response, body){
      console.log('got setup');
      callback(err, body);
    });
  },
  function(callback){
    request({uri:'http://www.pgatour.com/data/r/current/leaderboard.json', json:true},
  function(err, response, body){
    console.log('got leaderboard');
    callback(err, body);
  });
  }
], function(err, results){
  if(err){
    return res.json(500, err);
  }
  var setupFile, leaderboard = {};
  setupFile = results[1];
  leaderboard = results[2];

  if(typeof setupFile.trn === 'undefined' || typeof leaderboard.lb.c.c === 'undefined'){
    return res.json(500, 'Tournament setup record retrieved but undefined');
  }
  var setupObj = {
    event:setupFile.trn.even,
    field:setupFile.trn.field,
    rounds:setupFile.trn.rnds,
    courses:leaderboard.lb.c.c,
    name:leaderboard.lb.tn,
    date:leaderboard.lb.lt,
    pgaStatus:leaderboard.lb.rs,
    ballstrikersStatus:'Editable',
    totalRounds:setupFile.trn.event.currentRnd,
    currentRounds:setupFile.trn.event.currentRnd,
    fedex:setupFile.trn.event.cup,
    money:setupFile.trn.event.money,
    history:setupFile.trn.event.hiestory
  };

  Tournament.create(setupObj, function(err, item){
    if(err){
      console.log('setup file not savved: '+err);
      return res.json(500, 'setup file not saved: '+err);
    }
    return res.send(200, 'setup record saved: '+item._id);
  });
});
};

exports.calcPlayers = function(req, res){
  async.parallel([
    function(callback){
      Tournament.findOne({}).exec(function(err, setup){
        console.log('got setup');
        callback(err, setup);
      });
    },
    function(callback){
      Player.find({}).exec(function(err, players){
        console.log('got players');
        callback(err, players);
      });
    }
  ], function(err, results){
    var setup = results[0];
    var players = results[1];
    if(!players || !setup){
      return console.log('no players or courses found');
    }
    var scorecardTemplate = setup.courses[0].h;
    async.each(players, function(player, callback){
      player.rounds = [];
      player.sc = 0;
      player.stable = 0;
      player.modstable = 0;

      request({uri:'http://www.pgatour.com/data/r/current/scorecards/'+player.id+'.json', json:true}, function(err, response, body){
        if(err){return console.log(err);}
        if(typeof body.p.rnds === 'undefined'){return console.log('player record undfined');}
        body.p.rnds.forEach(function(rawRound){
          var scorecard = JSON.parse(JSON.stringify(scorecardTemplate));
          var processedRound = {
            modStablefordTotal:0,
            stablefordTotal:0,
            standardTotal:0,
            holes:scorecard
          };

          processedRound.holes.forEach(function(processedHole, pHoleIndex){
            processedHole.score = '';
            processedHole.modstable = 0;
            processedHole.stable = 0;
            rawRound.holes.forEach(function(rawHole){
              if(rawHole.cNum === processedHole.n){
                processedHole.score = rawHole.sc;
                if(processedHole.score === ''){
                  processedHole.score = '-';
                  processedHole.modstable = '-';
                  processedHole.stable = '-';
                }else{
                  var diff = processedHole.score - processedHole.p;
                  if(diff > 1){
                    processedHole.modstable = -3;
                  }else if(diff === 1){
                    processedHole.modstable = -1;
                  }else if(diff === 0){
                    processedHole.modstable = 0;
                  }else if(diff === -1){
                    processedHole.modstable = 2;
                  }else if(diff === -2){
                    processedHole.modstable = 5;
                  }else if(diff < -2){
                    processedHole.modstable = 8;
                  }
                  if(diff > 1){
                    processedHole.stable = 1;
                  }else if(diff === 1){
                    processedHole.stable = 1;
                  }else if(diff === 0){
                    processedHole.stable = 2;
                  }else if(diff === -1){
                    processedHole.stable = 3;
                  }else if(diff === -2){
                    processedHole.stable = 4;
                  }else if(diff === -3){
                    processedHole.stable = 5;
                  }else if(diff > -3){
                    processedHole.stable = 6;
                  }
                  processedRound.standardTotal += Number(processedHole.score);
                  processedRound.stablefordTotal += processedHole.stable;
                  processedRound.modStaablefordTotal += processedHole.modstable;
                }
              }
            });
            processedRound.holes[pHoleIndex] = processedHole;
          });
          player.sc += processedRound.standardTotal;
          player.stable += processedRound.stablefordTotal;
          player.modstable += processedRound.modStablefordTotal;
          player.rounds.push(processedRound);
        });
        player.save(function(err){
          if(err){
            return console.log(err);
          }
          console.log('player score saved: '+player.id);
          return callback();
        });
      });
    }, function(err){
      if(err){
        res.send(500, err);
      }else{
        res.send(200, 'all players updated');
      }
    });
  });
};

exports.calcTeams = function(req, res){
  Team.find({}).populate('player1').populate('player2').populate('player3').populate('player4').exec(function(err, teams){
    if(err){return console.log(err);}
    if(!teams){return console.log('calc: did notload teams');}
    console.log('Calc: teams: '+teams.length);

    async.each(teams, function(team, callback){
      team.modstable = 0;
      team.stable = 0;
      team.sc = 0;

      var teamScore = sumPlayerScores([team.player1, team.player2, team.player3, team.player4]);
      team.modstable = teamScore.modstable;
      team.stable = teamScore.stable;
      team.sc = teamScore.sc;

      team.player1 = flattenObject(team.player1);
      team.player2 = flattenObject(team.player2);
      team.player3 = flattenObject(team.player3);
      team.player4 = flattenObject(team.player4);
      team.save(function(err){
        if(err){
          console.log(err);
          return res.send(500, err);
        }
        console.log('team saved');
        return callback();
      });
    }, function(err){
      if(err){return res.send(500,err);}
      return res.send(200, 'teams updated');
    });
  });
};

exports.calcLeagues = function(req, res){
  League.find({}).populate('teams').exec(function(err, leagues){
    if(err){return console.log(err);}
    if(!leagues){return console.log('calc: did not load teams');}
    console.log('calc leagues: '+leagues.length);
    async.each(leagues, function(league, callback){
      league.leaderboard = [];
      league.teams.forEach(function(team){
        league.leaderboard.push({
          teamName:team.teamName,
          ownerName:team.ownerName,
          teamId:team._id,
          score:team.modstable
        });
      });
      league.save(function(err){
        if(err){
          console.log(err);
          return res.send(500, err);
        }
        console.log('league saved');
        return callback();
      });
    },function(err){
      if(err){return res.send(500, err);}
      return res.send(200,'leagues updated');
    });
  });
};
