'use strict';

const Parse = require('parse/node');
const _ = require('lodash');
const Q = require('q');
const Schema = require('../helpers/schema');

class BaseService {

    constructor(parseClassName, config) {
        this.config = config || {};
        this.parseClassName = parseClassName;
    }

    getById(id, includes) {
        var query = new Parse.Query(this.parseClassName);
        query.equalTo('objectId', id);
        if (includes && includes.length) {
            query.include(includes);
        }
        return query.first();
    }

    getAll(includes) {
        var query = new Parse.Query(this.parseClassName);
        if (includes && includes.length) {
            query.include(includes);
        }

        var findPromise = query.limit(9999).find();

        return Q.all([findPromise]).then(function (r) {
            var result = r[0];
            return {
                items: result
            };
        });
    }

    getPagedList(page, pageSize, keywords, match, includes, sort, order) {
        var self = this;

        sort = sort || 'createdAt';
        order = order || 'desc';

        var findQuery = new Parse.Query(this.parseClassName);
        var totalQuery = new Parse.Query(this.parseClassName);

        var orQueries = [];
        var andQueries = [];

        if (keywords) {
            var searchFields = this.searchFields ? this.searchFields() : [];
            var self = this;
            if (searchFields.length) {
                let orQueries = [];
                _.each(searchFields, function (k) {
                    findQuery.include(k);
                    var parts = k.split('.');
                    if (parts.length > 1) {
                        let fieldName = parts[0];
                        let pointerFieldName = parts[1];
                        let pointerType = Schema.getPointerType(self.parseClassName, fieldName);

                        let searchQuery = new Parse.Query(pointerType);
                        searchQuery.matches(pointerFieldName, new RegExp('.*' + decodeURIComponent(keywords) + '.*', 'i'));

                        let finalQuery = new Parse.Query(self.parseClassName);
                        finalQuery.matchesQuery(fieldName, searchQuery);

                        orQueries.push(finalQuery);

                        findQuery = Parse.Query.or.apply(null, orQueries);
                        totalQuery = Parse.Query.or.apply(null, orQueries);
                    } else {
                        // todo add to OR
                        findQuery.matches(k, new RegExp('.*' + decodeURIComponent(keywords) + '.*', 'i'))
                    }
                });
            }
        }

        if (match) {
            let self = this;
            let orQueries = [];
            _.each(match, function (v, k) {
                if (Array.isArray(v)) {
                    findQuery.containedIn(k, v);
                    totalQuery.containedIn(k, v);
                } else {
                    findQuery.equalTo(k, v);
                    totalQuery.equalTo(k, v);
                }
            });
        }

        findQuery.include(includes);

        var findPromise;
        if (order === 'desc' && sort) {
            findPromise = findQuery.descending(sort);
        }

        if (pageSize) {
            findPromise = findQuery
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        }

        findPromise = findQuery.find();
        var totalPromise = totalQuery.count();

        return Q.all([findPromise, totalPromise]).then(function (r) {
            var result = r[0];
            var count = r[1];
            return {
                totalCount: count,
                items: result
            };
        });
    }

    readFields(obj, entity) {
        _.each(obj, function (value, key) {
            if (key == 'createdAt' || key == 'updatedAt') {
                return;
            }

            if (key.indexOf('_') === 0) {
                return;
            }

            if (typeof (value) === 'object' && !Array.isArray(value)) {
                if (value.className) {
                    var Entity = Parse.Object.extend(value.className);
                    var e = new Entity();
                    e.id = value.objectId;
                    entity.set(key, e);
                }
            } else {
                entity.set(key, value);
            }
        });
    }

    _createQuery() {
        return new Parse.Query(this.parseClassName);
    }

    toParseObject(obj, className, acl) {
        var self = this;
        var parseObject = new Parse.Object(className);

        if (acl) {
            parseObject.setACL(acl);
        }

        var relatedObjects = [];
        _.each(obj, function (v, k) {
            if (k === 'createdAt' || k == 'updatedAt' || k === 'ACL' || k[0] === '_') {
                return;
            }

            if (Array.isArray(v)) {
                if (v.length) {
                    _.each(v, function (item, index) {
                        if (item.__type){
                            v[index] = Parse.Object.fromJSON(item).toPointer();
                        }
                    });
                }

                parseObject.set(k, v);
            } else if (typeof (v) === 'object') {
                let fieldInfo = Schema.getFieldInfo(className, k);
                if (!v){
                    parseObject.set(k, null);
                }
                else if (v.__type === 'Pointer') {
                    let parsed = Parse.Object.fromJSON(v);
                    parseObject.set(k, parsed.toPointer());
                } else if (v.__type === 'Object' || fieldInfo.targetClass) {
                    v.className = fieldInfo.targetClass;
                    let parsed = Parse.Object.fromJSON(v);
                    var converted = self.toParseObject(v, fieldInfo.targetClass);
                    parseObject.set(k, converted.targetObject);
                    if (v.objectId) {
                        relatedObjects.push(parsed);             
                    }

                    _.each(converted.relatedObjects, function(relatedObj){
                        relatedObjects.push(relatedObj);
                    });
                } 
            } else {
                parseObject.set(k, v);
            }
        });

        return {
            targetObject: parseObject,
            relatedObjects: relatedObjects
        };
    }

    save(entity) {
        var result = this.toParseObject(entity, this.parseClassName);
        var promises = [result.targetObject.save()];
        if (result.relatedObjects) {
            _.each(result.relatedObjects, function (obj) {
                promises.push(obj.save());
            });
        }
        return Q.all(promises).then(function (r) {
            return r[0];
        });
    }

    delete(id) {
        return this.getById(id).then(function (data) {
            return data.destroy();
        });
    }
}

module.exports = BaseService;