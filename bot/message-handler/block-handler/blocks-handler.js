
let defaut_answer               = require('./collections/direct-replies/default-answer');
let reply_to_hi                 = require('./collections/direct-replies/reply-to-hi');
let getstarted_message          = require('./collections/direct-replies/getstarted-messages');
let show_functions              = require('./collections/direct-replies/show-functions');

let show_headlines              = require('./collections/sending/send-headlines');
let show_studentNews            = require('./collections/sending/send-student-news');
let send_test_schedule          = require('./collections/sending/send-test-schedule');
let send_liability              = require('./collections/sending/send-liability');
let send_summary_marks          = require('./collections/sending/send-summary-marks');

let get_student_id              = require('./collections/getting-answer/get-student-id');
let continue_test_schedule      = require('./collections/quick-replies/continue-testschedule-lookingup');



module.exports = 
{
    defaut_answer, reply_to_hi, getstarted_message,show_functions, 

    show_headlines, show_studentNews, send_test_schedule, send_liability, send_summary_marks, 

    get_student_id, 
    continue_test_schedule
};
