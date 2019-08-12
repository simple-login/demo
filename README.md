This is an example of a typical website that implements SimpleLogin. 
The code is deployed on https://simplelogin.now.sh/

Feel free to **remix** it 
on https://glitch.com/~simple-login-simplelogin-demo ✌️

Upon successful login, you will see the information that the website receives 
when you sign in with SimpleLogin.

This website also features Facebook login for comparison.

This is a front-end only web-app, none of your data is saved or used 🙂, even for analytics purpose. 

This project depends on:
- Bootstrap 4
- VueJS

It works immediately with SimpleLogin as SimpleLogin whitelists localhost to facilitate development.

For Facebook, unfortunately you would need to find a way to run a https server as Facebook SDK does not allow plain http on local:

* create a Facebook app on https://developers.facebook.com

* replace the facebook app id used in `index.html` by this appId 

```html
<script async defer crossorigin="anonymous"
    src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.3&appId=410139219846977&autoLogAppEvents=1"></script>  
```    

* run a https server and serve the code through this server. We recommend [ngrok](http://ngrok.com) as a quick way to run a http server.  

These steps are required because Facebook SDK does not allow http://localhost by default.

