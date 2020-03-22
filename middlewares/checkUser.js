// this middleware checks if the userInformation from the auth0 profile matches the vendor-id of the requested resource
const checkUser = (req, res, next) => {
  
    var AuthenticationClient = require('auth0').AuthenticationClient;
    var auth0 = new AuthenticationClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID
    });

    let authtoken = req.headers.authorization.replace("Bearer ", "")

    auth0.getProfile(authtoken, function (err, userInfo) {
      if (err) {
        console.log(err.message)
      }
      //TODO: check if userId can be found in vendor collection for request vendorId
      // then set req.body.userId
    
    });
    
    //req.body.date = new Date();
    next()
}

module.exports = checkUser