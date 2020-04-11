
require('dotenv').config();
const request = require('request');
const mongoClient = require('mongodb').MongoClient;
let connectionString = process.env.MONGO_CONNSTR;



class User
{
    // ID = null;
    // Session = null;
    // FirstName = null;
    // LastName = null;
    // FullName = null;
    // AvatarLink = null;


    constructor(userID)
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                this.ID = userID;
                mongoClient.connect(connectionString, (err, db) =>
                {
                    if (err) throw err;
    
    
                    let dbo = db.db("FacebookUsers");
                    dbo.collection('Profile').findOne({ID: `${this.ID}`}, async (err, result) =>   //  Tìm kiếm người dùng Facebook theo ID trong bảng Profile
                    {
                        if (err) throw err;
                        if (result === null) //  Không tìm thấy người dùng ==> Là người dùng mới
                        {
    
                            let profile = await this.getNewUserProfile();
                            if (profile === undefined)
                            {
                                console.log('Can\'t get profile of:', this.ID);
                            }
                            else
                            {
                                //  Assingning new user profile
                                this.Session = '';
                                this.FirstName = profile.first_name;
                                this.LastName = profile.last_name;
                                this.FullName = profile.name;
                                this.AvatarLink = profile.profile_pic;
                                console.log('Successfully getted new user profile:', this.ID);
    
    
                                //  Saving the new user profile
                                db.close();
                                this.saveNewUserProfile(dbo)
                                .then( ()=>
                                {
                                    return resolve(this);
                                })
                                .catch(err =>
                                    {
                                        console.log('user.js:58 - Error', err);
                                    });
                            }
                        }
                        else
                        {
                            this.Session = result.Session;
                            this.FirstName = result.FirstName;
                            this.LastName = result.LastName;
                            this.FullName = result.FullName;
                            this.AvatarLink = result.AvatarLink;
                            console.log('Detected old user:', this);
                        }
        
        
                        return resolve(this);
                    });
                });
            }
            catch (err)
            {
                console.log('user.js - constructor - error:', err);
            }
        });
    }



    async getNewUserProfile()
    {
        return new Promise((resolve, reject) =>
        {
            console.log('Getting new user profile:', this.ID);
            request
            (
                {
                    method: 'GET',
                    url: `https://graph.facebook.com/${this.ID}`,
                    qs:
                    {
                        fields: 'name, first_name, last_name, profile_pic',
                        access_token: process.env.PAGE_ACCESS_TOKEN
                    },
                    headers:
                    {
                        'Accept': 'application/json',
                        'Accept-Charset': 'utf-8'
                    }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log('getNewUserProfile() - Error:', err);
                        return reject(undefined);
                    }
    
    
                    let bodyJSONstring = JSON.stringify(JSON.parse(body));
                    return resolve(JSON.parse(bodyJSONstring));
                }
            );
        });
    }

    saveNewUserProfile()
    {
        return new Promise((resolve, reject) =>
        {
            console.log('Saving new user profile:', this.ID);
            mongoClient.connect(connectionString, (err, db) =>
            {
                if (err)
                {
                    db.close();
                    return reject(err);
                }

                let dbo = db.db("FacebookUsers");
                dbo.collection('Profile').insertOne(this, (err, result) =>
                {
                    if (err)
                    {
                        db.close();
                        return reject(err);
                    }

                    console.log('Saved new user:', this.ID);
                    db.close();
                    return resolve();
                });
            });
        });
    }

    changeSession(sessionContent)
    {
        mongoClient.connect(connectionString, (err, db) =>
        {
            if (err) throw err;


            let dbo = db.db("FacebookUsers");
            dbo.collection("Profile").updateOne({ID: `${this.ID}`}, {$set: {Session: `${sessionContent}`}}, (err, result) =>
            {
                if (err)
                {
                    db.close();
                    throw err;
                }

                console.log(`Changed session to: "${sessionContent}" for: ${this.ID}`);
                db.close();
            });
        });
    }



    static getAllUserIDs()
    {
        return new Promise((resolve, reject) =>
        {
            mongoClient.connect(connectionString, (err, db) =>
            {
                if (err)
                {
                    return reject(err);
                }
                else
                {
                    let dbo = db.db("FacebookUsers");
                    dbo.collection("Profile").distinct("ID", (err, result) =>   // Get all ID field(s) of the Profile collection
                    {
                        if (err)
                        {
                            db.close();
                            return reject(err);
                        }
                        else
                        {
                            db.close();
                            return resolve(result);
                        }
                    });
                }
            })
        });
    }
}


module.exports = User;