const fs = require('fs');
const json = require('../json-handler');
const request = require('request');


class FacebookUser
{
    constructor(id)
    {
        this.ID = id;
        this.FullName = undefined;
        this.FirstName = undefined;
        this.LastName = undefined;
        this.ProfilePic = undefined;
        this.LastActive = null;
        this.LastResponse = null;
        this.ReplyFor = null;
        this.DoIng = null;


        return new Promise( async(resolve, reject) =>
        {
            try
            {
                if (this.isExists() === true)
                {
                    await this.getOldUserProfile();
                    return resolve(this);
                }
                else
                {
                    await this.getNewUserProfile(this);
                    return resolve(this);
                }
            }
            catch (err)
            {
                console.log(err);
            }
        });
    }


    isExists()
    {
        try
        {
            let path = require('path').join(__dirname, `profiles/${this.ID}.json`);
            fs.accessSync(path);
            return true;
        }
        catch (err)
        {
            return false;
        }
    }


    async getOldUserProfile()
    {
        try
        {
            let path = require('path').join(__dirname, `profiles/${this.ID}.json`);
            let profile = await json.read(path);

            console.log(`\n\n■■■ Detected old user: ${profile.ID} - ${profile.FullName}`);
            Object.assign(this, profile);
        }
        catch (err)
        {
            console.log(`■■■ Failed to get old user profile: ${this.ID}`, err);
        }
    }

    async getNewUserProfile(self)
    {
        try
        {
            console.log(`\n\n■■■ Getting new user profile: ${this.ID}...`);
            return new Promise((resolve, reject) =>
            {
                request
                ({
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
                async function(err, res, body)
                {
                    if (err)
                    {
                        return reject("■■■ Error at: getNewUserProfile(): " + err);
                    }
                    else
                    {
                        let profile = JSON.parse(JSON.stringify(JSON.parse(body)));


                        let formattedProfile = {};
                        formattedProfile.ID = profile.id;
                        formattedProfile.FirstName = profile.first_name;
                        formattedProfile.LastName = profile.last_name;
                        formattedProfile.FullName = profile.name;
                        formattedProfile.ProfilePic = profile.profile_pic;

                        console.log(`\n\n■■■ Getted new user profie:`, formattedProfile);
                        Object.assign(self, formattedProfile);
                        await self.saveNewUserProfile();
                        return resolve(formattedProfile);
                    }
                });
            });
        }
        catch (error)
        {
            console.log(error);
        }
    }

    async saveNewUserProfile()
    {
        try
        {
            console.log(`\n\n■■■ Saving new user profile: ${this.ID} — ${this.FullName}`)
            let path = require('path').join(__dirname, `profiles/${this.ID}.json`);

            await json.writeFromObject(path, this);
            console.log(`■■■ Saved new user profile: ${this.ID} — ${this.FullName}`);
        }
        catch (err)
        {
            console.log(err);
        }
    }


    async replyFor(variable, doing)
    {
        try
        {
            let path = require('path').join(__dirname, `profiles/${this.ID}.json`);
            
            await json.update(path, 'ReplyFor', variable);
            await json.update(path, 'DoIng', doing);


            console.log(`\n\nSuccessfully changed: ReplyFor: "${variable}" ——— DoIng: "${doing}"`, ' ——— for user:', this.ID);
        }
        catch (err)
        {
            console.log('\n\nUnable to change ReplyFor: ', this.ID, err);
        }

    }


    async getAllUsersID()
    {
        try
        {
            const path = require('path');
            const glob = require('glob');


            return new Promise((resolve, reject) =>
            {
                let absPath = path.join(__dirname, 'profiles/');
                glob(absPath + '*.json', (err, matches) =>
                {
                    if (err)
                    {
                        return reject(err);
                    }


                    let ids = [];
                    matches.forEach((filepath, index) =>
                    {
                        let filename = String(path.basename(filepath, path.extname(filepath)));     //  Không có đuôi file
                        ids.push(filename);
                    });


                    return resolve(ids);
                });
            });
        }
        catch (err)
        {
            console.log('\n\nError when get all users ID:', err);
        }
    }
}



module.exports = FacebookUser;