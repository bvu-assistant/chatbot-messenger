
require('dotenv/config');
const request = require('request');
const firebaseAdmin = require('../self_modules/firebase/firebase-instance');
const db = require('../self_modules/firebase/firebase-instance').admin.database();



class User {
    constructor(id) {
        let self = this;

        this.id = id;
        this.is_exist = false;
        this.info = {
            id: '',
            name: '',
            first_name: '',
            last_name: '',
            profile_pic: '',
            session: {
                reply_for: '',
                payload: '',
                last_response: '',
            }
        };


        return new Promise( (resolve, reject) => {
            try {

                //  tìm trên RealtimeDB
                const foundUser = firebaseAdmin.facebookRealtimeDbRef.child(id);
                foundUser.on('value', async (snapshot) => {
                    if (snapshot.val() === null) {    // user chưa tồn tại trên RealtimeDB
                        console.log('\nUser with the given id is not exists');

                        // gọi request để lấy profile từ Facebook UserProfileAPI
                        self.getProfile(id)
                            .then(info => {
                                self.info = info;
                                self.is_exist = true;

                                //  lưu vào realtime
                                firebaseAdmin.facebookRealtimeDbRef.child(id).set(self.info);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                            .finally(()=> {
                                return resolve(self);
                            });
                    }
                    else {
                        self.is_exist = true;
                        self.info = snapshot.val();
                        resolve(self);
                    }
                });
            }
            catch (err) {
                console.log('\nError when retrieving user profile for id:', id);
                console.log(err);
                return resolve(this);
            }
        });
    }


    getProfile(id) {
        return new Promise((resolve, reject) => {
            request({
                method: 'GET',
                url: `https://graph.facebook.com/${id}`,
                qs: {
                    access_token: process.env.PAGE_ACCESS_TOKEN,
                    fields: 'name, first_name, last_name, profile_pic'
                }
            },
            (err, res, body) => {
                if (err || res.statusCode !== 200) {
                    return reject(err || body);
                }

                body = JSON.parse(body);
                if (body.error) {
                    return resolve({
                        id: 'null',
                        name: '',
                        first_name: '',
                        last_name: '',
                        profile_pic: '',
                        session: {
                            reply_for: '',
                            payload: '',
                            last_response: '',
                        }
                    });
                }

                body['session'] = { reply_for: '', payload: '', last_response: '' };
                return resolve(body);
            });
        });
    }

    updateSelf() {
        return firebaseAdmin.facebookRealtimeDbRef.child(this.id).update(this.info);
    }
}

module.exports = User;