'use strict';

const BaseService = require('./BaseService');
const Parse = require('parse/node');

class PlaceService extends BaseService {

    constructor() {
        super('Place');
    }

    searchFields() {
        return ['name.arabicLabel', 'name.englishLabel'];
    }
}

module.exports = new PlaceService();