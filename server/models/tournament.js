'use strict';
var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var TournamentSchema = new Schema({
  modified:{type:Date, default:Date.now},
  event:{},
  courses:[],
  field:[],
  name:{type:String},
  date:{type:String},
  pgaStatus:{type:String},
  ballstrikersStatus:{type:String},
  totalRounds:{type:String},
  currentRound:{type:String},
  fedex:{},
  money:{},
  history:{}
});
mongoose.model('Tournament', TournamentSchema);
