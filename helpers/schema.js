'use strict';

const MongoClient = require('mongodb').MongoClient;
const request = require('request');
const _ = require('lodash');

var schema = null;

class DbSchema {
    set(s) {
        schema = s;
    }

    get() {
        return schema;
    }

    getClassSchema(className) {
        return _.find(schema, {
            className: className
        });
    }

    getFieldInfo(className, fieldName) {
        var classSchema = this.getClassSchema(className);
        var field = _.find(classSchema.fields, function (v, k) {
            return k === fieldName;
        });
        return field;
    }

    getPointerType(className, fieldName) {
        var classSchema = this.getClassSchema(className);
        var fieldSchema = _.find(classSchema.fields, function (v, k) {
            return k === fieldName;
        });

        if (fieldSchema.type !== 'Pointer') {
            throw new Error('field is not a pointer');
        }

        return fieldSchema.targetClass;
    }

    validate(className, req) {
        var classSchema = this.getClassSchema(className);
        _.each(classSchema.fields, function (fieldInfo, fieldName) {
            var validation = req.checkBody(fieldName).optional();
            if (fieldInfo.type === 'Number') {
                validation.isInt();
                req.sanitizeQuery(fieldName).toInt();
            }
        });
    }

    init(parseUrl, appId, masterKey) {
        return function (req, res, next) {
            if (schema) {
                return next();
            }

            var options = {
                uri: parseUrl + '/schemas',
                method: 'POST',
                json: {
                    "_method": "GET",
                    "_ApplicationId": appId,
                    "_MasterKey": masterKey
                }
            };

            request(options, function (error, response, body) {
                if (error) {
                    return next(error);
                }
                if (response.statusCode !== 200) {
                    return next(new Error('Cannot get the database schema'));
                }
                schema = body.results;
                next();
            });
        };
    }
}

module.exports = new DbSchema();