const moment = require('moment');
const converter = require('json-2-csv');
const fs = require('fs');
const path = require('path');


function periodToTime(period) {
  const first = period.split('->')[0];
  const last = period.split('->')[1];

  return {
    first: getTimeByIndex(first).start,
    last: getTimeByIndex(last).end,
  }


  function getTimeByIndex(index) {
    const incresingMinutes = 50;
    let breakTime = 0;

    for (let i = 1; i <= index; ++i) {
      switch (i) {
        case 3: case 5: case 9: case 11: case 13: case 15: {
          breakTime += 10;
          break;
        }
    
        case 7: {
          breakTime += 40;
          break;
        }
      }
    }

    const start = moment('06:45', 'HH:mm').add((index - 1) * incresingMinutes + breakTime, 'minutes')
    return {
      start: start.format('HH:mm'),
      end: start.add(incresingMinutes, 'minutes').format('HH:mm'),
    };
  }
}

function getScheduleData(scheduleArr) {

  const csvData = Array.from(scheduleArr.details).map((value, index, arr) => {
    const theDate = value.Date.split('(')[1].split(')')[0];
    const theTime = periodToTime(value.Period);

    return {
      'Subject': value.Subject,
      'Start Date': theDate,
      'End Date': theDate,
      'Start Time': theTime.first,
      'End Time': theTime.last,
      'Location': value.Room,
      'Description': `Type: ${value.TestType}\nGroup: ${value.Group}\nNotes: ${value.Notes}\nFrom ordinal: ${value.FromOrdinal}`
    }
  });

  return csvData;
}


module.exports = function saveCSV(studentID, scheduleArr) {
  return new Promise((resolve, reject) => {

    converter.json2csv(getScheduleData(scheduleArr), (err, csv) => {
      if (err) {
        console.log(err);
        return reject('error while creating csv...');
      }
  
      // console.log(csv);
      fs.writeFile(path.resolve(__dirname, './test-schedules-csv/', `${studentID}.csv`), '\uFEFF' + csv, {encoding: 'utf8'}, (err) => {
        if (err) {
          console.log(err);
          return reject('error while saving csv...');
        }
        else {
          console.log('csv saved.');
          return resolve(`${studentID}.csv`);
        }
      });
    });
  });
}