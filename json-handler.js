const fs = require("fs");

/**
 * Reads the entire contents of a JSON file.
 * @param {*} path A path to a file
 */
function read(path)
{
    return new Promise((resolve, reject) =>
    {
        fs.readFile(path, (err, data) =>
        {
            if (err)
            {
                return reject(err);
            }
    
            return resolve(JSON.parse(data));
        });
    });
}



function writeFromObject(path, object)
{
    return new Promise((resolve, reject) =>
    {
        fs.writeFile(path, JSON.stringify(object), error =>
        {
            if (error)
            {
                return reject(error);
            }
            else
            {
                return resolve();
            }
        });
    });
}

function update(path, key, value)
{
    return new Promise( (resolve, reject) =>
    {
        read(path)
            .then( async json =>
                {
                    json[key] = value;
                    await writeFromObject(path, json);
                    return resolve('Successfully');
                })
            .catch(err =>
                {
                    return reject(err);
                })
    });
}


module.exports = {read, writeFromObject, update};