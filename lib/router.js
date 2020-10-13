'use strict';
const postHandler = require('./posts-handler');

function route(req, res) {
    switch (req.url) {
    case '/posts':
        postHandler.handle(req, res);
        break;
    default:
        break;
    }
}

module.exports = {
    route
};
