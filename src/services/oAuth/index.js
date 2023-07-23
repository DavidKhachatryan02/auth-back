const { OAuth2Client } = require("google-auth-library");

const oAuthClient = new OAuth2Client();

module.exports = {
  oAuthClient,
};
