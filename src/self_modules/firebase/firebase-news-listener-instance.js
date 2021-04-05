let admin = require('firebase-admin');
let serviceAccount = require('./bvuassistant-1585757109800-firebase-adminsdk-i7b3z-15daa9d6dd.json');


class FirebaseInstance {
    constructor() {
        
        this.admin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://bvuassistant-1585757109800.firebaseio.com'
        }, 'firestoreListener');;
    }
}


module.exports = new FirebaseInstance();