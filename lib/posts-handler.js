'use strict';
const pug = require('pug');
const post = require('./post');

function handle(req, res) {
    const today = new Date();

    switch (req.method) {
    case 'GET':
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        const today_string = getDateString(today, 'MM/DD');

        let data = getUserData4Display(req.user, today);
        res.end(pug.renderFile('./views/posts.pug', { today: today_string, user_name: req.user, data}));
        res.end();
        break;
    case 'POST':
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const weight = Number(decodeURIComponent(Buffer.concat(body).toString()).split('weight=')[1]);
            registerUserData(req.user, today, weight);
            console.info('登録されました: ', weight);
            handleRedirectPosts(req, res);
        });
        break;
    default:
        break;
    }
}

function handleRedirectPosts(req, res) {
    res.writeHead(303, {
        'Location': '/posts'
    });
    res.end();
}

function getDateString(date, format_str='YYYY/MM/DD', padding_str='') {
    format_str = format_str.replace(/YYYY/g, date.getFullYear());
    format_str = format_str.replace(/MM/g, (padding_str + (date.getMonth() + 1)).slice(-2));
    format_str = format_str.replace(/DD/g, (padding_str + (date.getDate())).slice(-2));
    return format_str;
}

/**
 * 表示用の一週間分のデータを返す
 * @param { String } user_name
 * @param { Date } today 基準の日付
 * @return { Array } ７日分の user, date, day, and value
 */
function getUserData4Display(user_name, today)
{
    let ans_data = new Array();
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    for (let i = 0; i < 7; i++) {
        let day_i = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + i)
        let user_data = post.getUserData(user_name, day_i);

        let date_str = getDateString(user_data.date, 'MM/DD');
        let weight = Number(user_data.value).toFixed(1);
        if (day_i < today) {
            ans_data.push({date: date_str, day: days[i], weight: weight});
        } else {
            ans_data.push({date: date_str, day: days[i]});
        }
    }
    return ans_data;
}

/**
 * ユーザデータを登録する
 * @param { string } user_name
 * @param { Date } today 日付
 * @param { float } value 登録する値
 */
function registerUserData(user_name, today, value) {
    post.registerUserData(user_name, today, value);
    return;
}


module.exports = {
    handle
}
