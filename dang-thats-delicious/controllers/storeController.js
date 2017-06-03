'use strict';
const debug = require('debug')('dang:controllers:storeController');

exports.homePage = (req, res) => {
    debug('homePage');
    res.render('index');
}