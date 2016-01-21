'use strict';
var mongoose = require('mongoose'),
uniqueValidator = require('mongoose-unique-validator'),
Schema = mongoose.Schema,
crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'],
SALT_WORK_FACTORY = 10;

var UserSchema = new Schema({
  name:String,
  email:{type:String, unique:true},
  role:{type:String, default:'user'},
  teamId:{type:Schema.ObjectId, ref:'Team'},
  hashedPassword:String,
  provider:String,
  salt:String,
  facebook:{},
  twitter:{},
  github:{},
  google:{}
});

UserSchema.virtual('password').set(function(password){
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}).get(function(){
  return this._password;
});

UserSchema.virtual('userInfo').get(function(){
  return{
    'name':this.name,
    'role':this.role,
    'provider':this.provider,
    'teamId':this.teamId
  };
});

UserSchema.virtual('profile').get(function(){
  return{
    'name':this.name,
    'email':this.email,
    'role':this.role,
    'userId':this._id
  };
});

var validatePresenceOf = function(value){
  return value && value.length;
};

UserSchema.path('email').validate(function(email){
  if(authTypes.indexOf(this.provider)!== -1){return true;}
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('hashedPassword').validate(function(hashedPassword){
  if(authTypes.indexOf(this.provider)!== -1){return true;}
  return hashedPassword.length;
}, 'Password cannot be blank');

UserSchema.plugin(uniqueValidator, {message:'Value is not unique.'});

UserSchema.pre('save', function(next){
  if(!this.isNew){return next();}
  if(!validatePresenceOf(this.hashedPassword)&& authTypes.indexOf(this.provider)===-1){
    next(new Error('Invalid password'));
  }else{
    next();
  }
});

UserSchema.methods = {
  authenticate:function(plainText){
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  makeSalt:function(){
    return crypto.randomByted(16).toString('base64');
  },
  encryptPassword:function(password){
    if(!password || !this.salt){
      return '';
    }
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2sync(password, salt, 10000, 64).toString('base64');
  }
};
mongoose.model('User', UserSchema);
