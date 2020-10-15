module.exports = { renderLiabilityTemplate }
const request = require('request');




async function getLiability(studentID)
{
    try
    {
        return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                url: `${process.env.SEARCHER_HOST}/?method=1&id=${studentID}`
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    return reject(err || body);
                }


                return resolve(body);
            });
        });
    }
    catch (err)
    {
        console.log(err);
    }   
}


async function renderLiabilityTemplate(studentID)
{
    try
    {
        let liability = await getLiability(studentID);
        if (liability.length === 2)
        {
            return {text: 'Không tìm được công nợ.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'};
        }


        let arr = Array.from(JSON.parse(liability));
        let response = '';
        response = response.concat(arr[0].ID + '.\n');
        response = response.concat(arr[0].FullName + '.\n\n');
        response = response.concat(arr[0].Term + '.\n');
        response = response.concat(arr[1]);

        return ({text: response});
    }
    catch (err)
    {
        console.log(err);
    }
}