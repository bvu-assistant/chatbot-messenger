
const request = require('request');
const cheerio = require('cheerio');



//  Tin chính
async function scrapHeadlines()
{
    try
    {
        return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                strictSSL: false,
                url: 'https://sinhvien.bvu.edu.vn/'
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    return reject(err || body);
                }


				let items = [];
				let $ = cheerio.load(body, {decodeEntities: false});
				$('#main_container .col-left .mod').each((index, elem) =>
				{
					let headline = $(elem).find('.head >h3:contains("Tin tức Sinh viên - Học viên")');
					if (headline !== null && headline.text() !== "")
					{
						$(elem).find('.item').each((index, elem) =>
						{
							let title = $(elem).find('.title >a');
							// console.log('\n\n' + title.text());

							let href = 'https://sinhvien.bvu.edu.vn/' + title.attr('href');
							// console.log(href);

							let date = $(elem).find('.title >.date');
							// console.log(date.text().split(': ')[1]);


							items.push({
								Title: title.text(),
								Link: href,
								Date: date.text().split(': ')[1]
							});
						});
					}
				});


				// console.log(items);
				return resolve(items);
            });
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

(async()=>
{
	console.log(await scrapHeadlines());
})();