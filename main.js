/*** Init VUE ***/
const app = new Vue({
  el: '#app',
  data: {
    authenticated: false,
    user: {
      email: "",
      name: "",
      avatar_url: ""
    },
    provider: "",
    googleSdkReady: false
  },
  methods: {
    logout: function () {
      this.authenticated = false;
      if (this.provider == "Facebook") {
        FB.logout(function (response) {
          history.pushState({}, null, "/");
        });
      } else if (this.provider == "Google") {
        gapi.auth2.getAuthInstance().signOut().then(
          function (response) {
            history.pushState({}, null, "/");
          }
        );
      } else { // SimpleLogin
        history.pushState({}, null, "/");
      }
    }
  }
});

/*** SimpleLogin, using JSO library ***/

// Make an authorization request if the user click the login button.

SL.init("demo");

function simpleLogin() {
  SL.login(function(user){
    app.authenticated = true;
      app.provider = "SimpleLogin";
      app.user = {
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url
      };
  });
}

/*** END SimpleLogin ***/

/*** Facebook ***/
function getFBUserData() {
  FB.api('/me?fields=id,name,email,picture{url}', function (response) {
    // response has this form {"id":"1234","name":"First Last","email":"abcd@gmail.com","picture":{"data":{"url":"https://avatar.png"}}}

    app.authenticated = true;
    app.provider = "Facebook";
    app.user = {
      email: response.email,
      name: response.name,
      avatar_url: response.picture.data.url
    };
  });
}

function fbLogin() {
  FB.login(function (response) {
    if (response.status === 'connected')
      getFBUserData();
  });

}

FB.getLoginStatus(function (response) {
  if (response.status === 'connected')
    getFBUserData();
});

/*** END Facebook ***/

/*** Google ***/

function googleLogin() {
  gapi.auth2.getAuthInstance().signIn().then(
    function (googleUser) {
      var profile = googleUser.getBasicProfile();

      app.authenticated = true;
      app.provider = "Google";
      app.user = {
        email: profile.getEmail(),
        name: profile.getName(),
        avatar_url: profile.getImageUrl()
      };
    },
    function (error) {
      console.log(error);
    }
  );
}


function initGoogle() {
  gapi.load('auth2', function () {
    gapi.auth2.init({
      client_id: '606630287997-3jlo7tlte0jktmavbv3rj0nav71fiec2.apps.googleusercontent.com'
    }).then(function () {
      console.log("Google Sdk finally ready");
      app.googleSdkReady = true;
    });
  });
}

initGoogle();

/*** End Google ***/