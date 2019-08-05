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
          location.href = "/";
        });
      } else if (this.provider == "Google") {
        gapi.auth2.getAuthInstance().signOut().then(
          function (response) {
            location.href = "/";
          }
        );
      } else {
        location.href = "/";
      }
    }
  }
});

/*** SimpleLogin, using OIDC library ***/
const providerInfo = OIDC.discover('https://app.simplelogin.io');

OIDC.setProviderInfo(providerInfo);

// OAuth2 client info. Please replace "client-id" here by your SimpleLogin OAuth2 client-id
const clientInfo = {
  client_id: 'client-id',
  redirect_uri: location.href
};
OIDC.storeInfo(providerInfo, clientInfo);

OIDC.setClientInfo(clientInfo);

// Restore configuration information.
OIDC.restoreInfo();

// Get Access Token
let token = OIDC.getAccessToken();

// Make userinfo request using access_token.
if (token !== null) {
  fetch('https://app.simplelogin.io/oauth2/userinfo/?access_token=' + token)
    .then(response => response.json())
    .then(res => {
      app.authenticated = true;
      app.provider = "SimpleLogin";
      app.user = {
        email: res.email,
        name: res.name,
        avatar_url: res.avatar_url
      };
    })
}

// Make an authorization request if the user click the login button.
function simpleLogin() {
  OIDC.login({
    scope: 'openid profile email',
    response_type: 'id_token token'
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