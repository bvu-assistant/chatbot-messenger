module.exports = { renderSummaryMarks }


const request = require('request');



async function renderSummaryMarks(studentID)
{
    try
    {
        let summaryMarks = await getSummaryMark(studentID);
        if (summaryMarks === undefined)
        {
            return ({text: 'Không tìm được điểm.\n\nMã sinh viên sai hoặc máy chủ đang quá tải.'});
        }


        // console.log(summaryMarks);
        let response = '';
        response = response.concat(`${summaryMarks.FullName} — ${summaryMarks.ID}.\n\n`);
        response = response.concat(`Tín chỉ đã học: ${summaryMarks.TotalCredits}.\n`);
        response = response.concat(`Điểm trung bình: ${summaryMarks.AverageMark}.\n`);
        response = response.concat(`Tín chỉ đang nợ: ${summaryMarks.BorrowedCredits}.\n`);
        response = response.concat(`Xếp loại tốt nghiệp: ${summaryMarks.GraduatingRank || 'Chưa'}.`);

        // console.log('response:', response);
        return {text: response};
    }
    catch (err)
    {
        console.log(err);
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
                    return reject(err || body);
                }


                // console.log(body);
                return resolve((body.length === 2) ? undefined: (JSON.parse(body).SummaryTable));
            });
        });
    }   
    catch (err)
    {
        console.log(err);
    }
}