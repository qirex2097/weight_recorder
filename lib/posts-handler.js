'use strict';
const pug = require('pug');

function handle(req, res) {
    switch (req.method) {
    case 'GET':
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        const today = new Date();
        const today_string = getDateString(today, 'MM/DD');

        let data = retreiveData(today);
        res.end(pug.renderFile('./views/posts.pug', { today: today_string, data}));
        res.end();
        break;
    case 'POST':
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const weight = Number(decodeURIComponent(Buffer.concat(body).toString()).split('weight=')[1]);
            console.info('登録されました: ', weight);
            data.push({user: 'guest', date: getDateString(new Date()), weight: weight});
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

function retreiveData(today)
{
    let data = [];
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    for (let i = 0; i < 7; i++) {
        let day_i = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + i)
        let date_str = getDateString(day_i, 'MM/DD');
        if (day_i < today) {
            let weight = 60.0
            data.push({user: 'guest', date: date_str, day: days[i], weight: weight.toFixed(1)});
        } else {
            data.push({user: 'guest', date: date_str, day: days[i]});
        }
    }
    return data;
}

module.exports = {
    handle
}
