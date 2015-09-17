(function(){
  angular
  .module('dBit')
  .controller('loginController', loginController);

  loginController.$inject = ['$firebaseAuth', '$firebaseObject', '$state', 'FirebaseUrl'];

  function loginController($firebaseAuth, $firebaseObject, $state, FirebaseUrl){
    var vm = this;

    vm.isLoggedIn = false;

    var ref = new Firebase(FirebaseUrl);
    var authObj = $firebaseAuth(ref);

    init();

    function init(){
      authObj.$onAuth(authDataCallback);
      if(authObj.$getAuth()){
        vm.isLoggedIn = true;
      }
    }

    function authDataCallback(authData){
      if(authData){
        console.log('user ' + authData.uid + 'is logged in with ' + authData.provider);
        vm.isLoggedIn = true;
        var user = $firebaseObject(ref.child('users').child(authData.uid));
        user.$loaded().then(function(){
          if(user.name === undefined){
            var newUser = {
              race:[]
            };
            if(authData.google){
              newUser.name = authData.google.displayName;
            }
            if(authData.github){
              newUser.name = authData.github.displayName;
              newUser.userName = authData.github.username;
              newUser.email = authData.github.email;
              newUser.race.name = authData.github.displayName;
              newUser.race.userName = authData.github.username;
              newUser.race.email = authData.github.email;

            }
            user.$ref().set(newUser);
          }
        });
      }else{
        console.log('user is logged out');
        vm.isLoggedIn = false;
      }
    }
    vm.logout = function(){
      ref.unauth();
      $state.go('home');
    };
    firebaseAuthLogin = function(provider){
      authObj.$authWithOAuthPopup(provider).then(function(authData){
        console.log('Authenticated successfully with provider ' + provider + ' with payload:', authData);
      }).catch(function(error){
        console.error('Authentication failed:', error);
      });
    };
    vm.googleLogin = function(){
      firebaseAuthLogin('google');
    };
    vm.githubLogin = function(){
      firebaseAuthLogin('github');
    };
  }
})();
