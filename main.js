var app = new Vue({
    el: '#app',
    data: {
        fb_user: {
            email: "",
            name: "",
            avatar_url: ""
        },
        fb_login: false
    }
})

/*** SimpleLogin, using OIDC library ***/

// SimpleLogin as identity provider
var providerInfo = OIDC.discover('https://app.simplelogin.io');

OIDC.setProviderInfo(providerInfo);
OIDC.storeInfo(providerInfo, clientInfo);

// OAuth2 client info. Please replace "client-id" here by your SimpleLogin OAuth2 client-id
var clientInfo = {
    client_id: 'client-id',
    redirect_uri: 'http://localhost:8000'
};

OIDC.setClientInfo(clientInfo);

// Restore configuration information.
OIDC.restoreInfo();

// Get Access Token
var token = OIDC.getAccessToken();

// Make userinfo request using access_token.
if (token !== null) {
    $.get('https://app.simplelogin.io/oauth2/userinfo/?access_token=' + token, function (data) {
        alert('USERINFO: ' + JSON.stringify(data));
        console.log(JSON.stringify(data));
    });
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
function checkLoginState() {
    debugger;
    FB.getLoginStatus(function (response) {
        FB.api('/me?fields=id,name,email,picture{url}', function (response) {
            // response has this form {"id":"1234","name":"First Last","email":"abcd@gmail.com","picture":{"data":{"url":"https://avatar.png"}}}
            app.fb_login = true;
            app.fb_user = {
                email: response.email,
                name: response.name,
                avatar_url: response.picture.data.url
            }
        });
    });
}

/*** END Facebook ***/
