'use strict';
const debug = require('debug')('dang:controllers:storeController');

exports.homePage = (req, res) => {
    debug('homePage');
    res.render('index');
};

exports.addStore = (req, res) => {
    debug('addStore');
    res.render('editStore', {title: 'Add Store'});
};

exports.createStore = (req, res) => {
    res.json(req.body);
};