// this middleware checks if the userInformation from the auth0 profile matches the vendor-id of the requested resource
const checkUser = async (req, res, next) => {

    const Vendor = require('../models/vendor')
  
    var AuthenticationClient = require('auth0').AuthenticationClient;
    var auth0 = new AuthenticationClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID
    });

    let authtoken = req.headers.authorization.replace("Bearer ", "")

    auth0.getProfile(authtoken, async function (err, userInfo) {
      if (err) {
        console.log(err.message)
      }
      req.body.userId = "invalid"
      req.body.userInfo = userInfo

      var query  = Vendor.where({ email: userInfo.email });
      await query.findOne(function (err, vendor) {
        if (err) return handleError(err);
        if (vendor) {
          req.body.userId = vendor._id
        }
      });
      next()
    }); 
}

module.exports = checkUser