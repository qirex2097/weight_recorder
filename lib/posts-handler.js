'use strict';
const pug = require('pug');
const dates = [ '10/8','10/9','10/10', ];
const weights = [ 60.0, 61.0, 61.5 ];
const data = [
    {
        date: '10/8',
        weight: 68.0
    },
    {
        date: '10/9',
        weight: 69.0
    },
    {
        date: '10/10',
        weight: 70.5
    }
];

function handle(req, res) {
    switch (req.method) {
    case 'GET':
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end(pug.renderFile('./views/posts.pug', { today: '10/15', data}));
        res.end();
        break;
    case 'POST':
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const weight = Number(decodeURIComponent(Buffer.concat(body).toString()).split('weight=')[1]);
            console.info('登録されました: ', weight);
            weights.push(weight);
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

module.exports = {
    handle
}
