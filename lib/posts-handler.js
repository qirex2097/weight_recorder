'use strict';
const pug = require('pug');
const weights = [];

function handle(req, res) {
    switch (req.method) {
    case 'GET':
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end(pug.renderFile('./views/posts.pug'));
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
