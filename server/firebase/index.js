const admin = require("firebase-admin");
const serviceAccount = require("./gulo-234107-firebase-adminsdk-pdpne-df8bcc003f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gulo-234107.firebaseio.com"
});

module.exports = admin;
