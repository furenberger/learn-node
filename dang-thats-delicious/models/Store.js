'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String]
});

// needs to be a function so you can have this
storeSchema.pre('save', function(next){
    if(!this.isModified('name')){
        next();
        return;
    }
    // TODO: make better slugs
    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model('Store', storeSchema);