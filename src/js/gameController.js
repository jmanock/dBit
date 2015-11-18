(function(){
  var DJANGO_SERVER_URL;
  var FIREBASE_SERVER_URL;

  angular.module('tanks-for-waiting').controller('GameController', GameController);
  GameController.$inject = ['$scope', '$http', '$interval', '$firebaseObject', '$firebaseArray'];

  function GameController($scope, $http, $interval, $firebaseObject, $firebaseArray){
    var firebasePlayerRef = null;
    var playerID = null;
    var gameID = null;
    $scope.gameRunning = false;
    $scope.score = 0;

    $scope.startGame = function(){
      $http.post(DJANGO_SERVER_URL +'/player/')
      .then(function(response){
        playerID = response.data.player_id;
        $http.post(DJANGO-SERVER_URL + '/games/',{
          player_id:playerID
        }).then(function(reponse){
          gameID = response.data.game_id;
          firebasePlayerRef = new Firebase(FIREBASE_SERVER_URL +'/games/'+gameID+'/tanks/' +playerID);
          var playerObj = $firebaseObject(firebasePlayerRef);
          playerObj.$bindTo($scope, 'player').then(function(){
            console.log($scope.player);
            new Game('screen');
          });
          firebaseScoreRef = new Firebase(FIREBASE_SERVER_URL +'/games/' +gameID+'/scores/'+playerID);
          var scoreObj = $firebaseObject(firebaseScoreRef);
          scoreObj.$bindTo($scope, 'score').then(function(){
            console.log($scope.score);
          });
        },function(errobj){
          alert('Game request failed: '+JSON.stringify(errobj,null,2));
        });
      },function(errobj){
        alert('Player request failed: '+JSON.stringify(errobj));
      });
      console.log('click');
    };

    var Game = function(canvasId){
      var canvas = documnet.getElementById(canvasId);
      var screen = canvas.getContext('2d');
      var gameSize = {
        x:canvas.width,
        y:canvas.height
      };
      var self = this;
      firebaseTargetsRef = new Firebase(FIREBASE_SERVER_URL + '/games/'+gameID+'/targets/');
      var targetObj = $firebaseObject(firebaseTargetsRef);
      $firebaseArray(firebaseTaretsRef).$loaded().then(function(targets){
        self.targets = self.refreshTargets(this, targets);
        $scope.gameRunning = true;
        $interval(function(){
          if(self.isReady){
            self.update();
            self.draw(screen, gameSize);
          }
        },16.7);
      },function(){
        console.log('Failed to load targets');
      });

      var targetAdded = function(){
        if($scope.gameRunning){
          console.log('it was hit');
          $firebaseArray(firebaseTargetsRef).$loaded().then(function(targets){
            self.targets = self.refreshTarget(this, targets);
          });
        }
      };
      var targetRemoved = function(dataSnapshot){
        var destroyedTarget = dataSnapshot.val();
      };
      firebaseTargetsRef.on('child_added', targetAdded, function(err){
        console.log('Failed');
      });
      firebaseTargetsRef.on('child_removed', targetRemoves, function(err){
        console.log('Failed');
      });

      this.tanks = [new Player(this,$scope.player)];
      this.walls = [
        new Wall(this, 40, 40, 45, 460),
        new Wall(this, 40, 400, 225, 45),
        new Wall(this, 40, 460, 225, 255),

        new Wall(this, 275, 40, 460, 45),
        new Wall(this, 460, 40, 455, 460),
        new Wall(this, 275, 455, 455, 460),

        new Wall(this, 80, 80, 420, 85),
        new Wall(this, 80, 80, 85, 225),
        new Wall(this, 415, 80, 420, 225),

        new Wall(this, 80, 275, 85, 420),
        new Wall(this, 85, 415, 420, 420),
        new Wall(this, 415, 275, 420, 420),

        new Wall(this, 225, 145, 230, 350),
        new Wall(this, 120, 250, 225, 255),

        new Wall(this, 275, 145, 280, 350),
        new Wall(this, 275, 250, 380, 255)
      ];
    };
    Game.prototype = {
      isReady:true,
      update:function(){
        for(var i = 0; i<this.tanks.length; i++){
          this.tanks[i].update();
        }
        var thisPlayer = this.tanks[0];
        var deletError = function(errobj){
          console.log('Error deleting target: '+JSON.stringify(errobj));
        };
        var deleteSuccess = function(response){
          console.log(response);
          if(response.none){

          }else{

          }
        };
        $scope.player.x = thisPlayer.location().x;
        $scope.player.y = thisPlayer.location().y;
        $scope.player.direction = thisPlayer.direction;

        for(i = 0; i<this.tragets.length; i++){
          if(collidingTarget(thisPlayer, this.targets[i])){
            this.targets[i].fillStyle = 'black';
            console.log(this.targets[i].target_id);
            if(this.targets[i].is_hit === 0){
              console.log(playerID);
              this.targets[i].is_hit = 1;
              $http.delete(DJANGO_SERVER_URL +'/games/'+gameID+'/targets/'+this.targets[i].target_id+'/',{
                data:playerID
              }).then(deleteSuccess, deleteError);
            }
          }
        }
        this.tanks = this.tanks.slice(0,1);
      },
      draw:function(screen, gameSize){
        screen.clearRect(0,0, gameSize.x, gameSize.y);
        for(i = 0; i<this.targets.length; i++){
          drawTarget(screen, this.targets[i]);
        }
      }
    }
  }
})()
