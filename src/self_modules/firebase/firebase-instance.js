
let admin = require('firebase-admin');
let serviceAccount = require('./firebase-admin-sdk.json');


class FirebaseInstance {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://bvu-assistant.firebaseio.com'
        });

        this.admin = admin;
        this.facebookRealtimeDbRef = this._getFacebookRealtimeDbRef();
    }

    _getFacebookRealtimeDbRef() {
        return admin.database().ref('facebook_users');
    }
}


module.exports = new FirebaseInstance();