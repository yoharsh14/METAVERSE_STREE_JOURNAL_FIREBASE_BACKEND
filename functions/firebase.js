const admin = require("firebase-admin");
const serviceAccount = require("./key/permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = db; // Export only the db instance
