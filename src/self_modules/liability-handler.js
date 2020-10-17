module.exports = { renderLiabilityTemplate }
const request = require('request');
require('dotenv/config');



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
                    console.log('\n\n\n\n', err || body);
                    return resolve('Student not found.');
                }


                return resolve(JSON.parse(body));
            });
        });
    }
    catch (err)
    {
        console.log(err);
        return undefined;
    }   
}


async function renderLiabilityTemplate(studentID)
{
    try
    {
        let json = await getLiability(studentID);
        switch (json) {
            case 'Student not found.': {
                return {text: 'Không tìm được công nợ.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'};
            }
            case undefined: //  lỗi xử lý từ hàm getLiability()
                return ({text: process.env.ERROR_MESSAGE});
        }


        let response = '';
        response = response.concat(json.info.id + ' - ');
        response = response.concat(json.info.fullName + '.\n\n');
        response = response.concat(json.info.term + '.\n');
        response = response.concat(json.details);

        return ({text: response});
    }
    catch (err)
    {
        console.log(err);
        return ({text: process.env.ERROR_MESSAGE});
    }
}