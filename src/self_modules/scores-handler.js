module.exports = { renderSummaryMarks }
const request = require('request');
require('dotenv/config');


async function renderSummaryMarks(studentID)
{
    try
    {
        let json = await getSummaryMark(studentID);
        switch (json) {
            case 'Student not found.': {
                return ({text: 'Không tìm được điểm.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'});
            }
            case undefined: //  lỗi xử lý từ hàm getSummaryMark()
                return ({text: process.env.ERROR_MESSAGE});
        }


        // console.log(summaryMarks);
        let response = '';
        response = response.concat(`${json.info.fullName} — ${json.info.id}.\n\n`);
        response = response.concat(`Tín chỉ đã đăng ký: ${json.details.SummaryTable.TotalCredits}.\n`);
        response = response.concat(`Tín chỉ đang nợ: ${json.details.SummaryTable.BorrowedCredits}.\n\n`);
        response = response.concat(`Điểm tích luỹ: ${json.details.SummaryTable.AverageMark}.\n`);
        response = response.concat(`Xếp loại tốt nghiệp: ${json.details.SummaryTable.GraduatingRank || 'Chưa'}.`);

        // console.log('response:', response);
        return {text: response};
    }
    catch (err)
    {
        console.error(err);
        return ({text: process.env.ERROR_MESSAGE});
    }
}


async function getSummaryMark(studentID)
{
    try
    {
        return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                uri: `${process.env.SEARCHER_HOST}/?method=0&id=${studentID}`
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    console.log(err || body);
                    return resolve('Student not found.');
                }

                // console.log(body);
                return resolve(JSON.parse(body));
            });
        });
    }   
    catch (err)
    {
        console.log(err);
        return resolve(undefined);
    }
}