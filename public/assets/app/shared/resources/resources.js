(function () {

    var schema = [
        {
            "className": "_User",
            "fields": {
                "objectId": {
                    "type": "String"
                },
                "createdAt": {
                    "type": "Date"
                },
                "updatedAt": {
                    "type": "Date"
                },
                "ACL": {
                    "type": "ACL"
                },
                "username": {
                    "type": "String"
                },
                "password": {
                    "type": "String"
                },
                "email": {
                    "type": "String"
                },
                "emailVerified": {
                    "type": "Boolean"
                },
                "authData": {
                    "type": "Object"
                },
                "photo": {
                    "type": "String"
                },
                "type": {
                    "type": "String"
                },
                "fullName": {
                    "type": "String"
                },
                "blocked": {
                    "type": "Boolean"
                }
            },
            "classLevelPermissions": {
                "find": {
                    "*": true
                },
                "get": {
                    "*": true
                },
                "create": {
                    "*": true
                },
                "update": {
                    "*": true
                },
                "delete": {
                    "*": true
                },
                "addField": {
                    "*": true
                }
            }
        }, {
        "className": "_Installation",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "installationId": {
                "type": "String"
            },
            "deviceToken": {
                "type": "String"
            },
            "channels": {
                "type": "Array"
            },
            "deviceType": {
                "type": "String"
            },
            "pushType": {
                "type": "String"
            },
            "GCMSenderId": {
                "type": "String"
            },
            "timeZone": {
                "type": "String"
            },
            "localeIdentifier": {
                "type": "String"
            },
            "badge": {
                "type": "Number"
            },
            "appVersion": {
                "type": "String"
            },
            "appName": {
                "type": "String"
            },
            "appIdentifier": {
                "type": "String"
            },
            "parseVersion": {
                "type": "String"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {
                "*": true
            },
            "update": {
                "*": true
            },
            "delete": {
                "*": true
            },
            "addField": {
                "*": true
            }
        }
    }, {
            "className": "Album",
            "fields": {
                "objectId": {
                    "type": "String"
                },
                "createdAt": {
                    "type": "Date"
                },
                "updatedAt": {
                    "type": "Date"
                },
                "ACL": {
                    "type": "ACL"
                },
                "name": {
                    "type": "Pointer",
                    "targetClass": "Language"
                },
                "thumbnail": {
                    "type": "String"
                },
                 "nbPictures": {
                    "type": "Number"
                }
            },
            "classLevelPermissions": {
                "find": {
                    "*": true
                },
                "get": {
                    "*": true
                },
                "create": {},
                "update": {},
                "delete": {},
                "addField": {}
            }
        }, {
            "className": "AlbumPhoto",
            "fields": {
                "objectId": {
                    "type": "String"
                },
                "createdAt": {
                    "type": "Date"
                },
                "updatedAt": {
                    "type": "Date"
                },
                "ACL": {
                    "type": "ACL"
                },
                "name": {
                    "type": "Pointer",
                    "targetClass": "Language"
                },
                "thumbnail": {
                    "type": "String"
                },
                 "album": {
                    "type": "Pointer",
                    "targetClass": "Album"
                }
            },
            "classLevelPermissions": {
                "find": {
                    "*": true
                },
                "get": {
                    "*": true
                },
                "create": {},
                "update": {},
                "delete": {},
                "addField": {}
            }
        }, {
        "className": "News",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "title": {
                "type": "Pointer",
                "targetClass": "Language"
            },
            "content": {
                "type": "Pointer",
                "targetClass": "Language"
            },
            "thumbnail": {
                "type": "String"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Language",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "arabicLabel": {
                "type": "String"
            },
            "englishLabel": {
                "type": "String"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {
                "*": true
            }
        }
    }, {
            "className": "Work",
            "fields": {
                "objectId": {
                    "type": "String"
                },
                "createdAt": {
                    "type": "Date"
                },
                "updatedAt": {
                    "type": "Date"
                },
                "ACL": {
                    "type": "ACL"
                },
                "title": {
                    "type": "Pointer",
                    "targetClass": "Language"
                },
                "thumbnail": {
                    "type": "String"
                },
                 "rate": {
                    "type": "Number"
                },
                "user": {
                    "type": "Pointer",
                    "targetClass": "_User"
                },
                "nbrComments": {
                    "type": "Number"
                },
                "rates": {
                    "type": "Array"
                },
                "type": {
                    "type": "String"
                },
                "video": {
                    "type": "String"
                },
                "likes": {
                    "type": "Array"
                }
            },
            "classLevelPermissions": {
                "find": {
                    "*": true
                },
                "get": {
                    "*": true
                },
                "create": {},
                "update": {},
                "delete": {},
                "addField": {}
            }
        }, {
        "className": "Comment",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "comment": {
                "type": "String"
            },
            "user": {
                "type": "Pointer",
                "targetClass": "_User"

            },
             "work": {
                "type": "Pointer",
                "targetClass": "Work"

            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {
                "*": true
            }
        }
    }
    ];

    function extendParseQuery($q, $timeout) {
        var originalFind = Parse.Query.prototype.find;
        Parse.Query.prototype.find = function (options) {
            options = options || {};
            options.useMasterKey = true;

            var deferred = $q.defer();
            originalFind
                .apply(this, [options])
                .then(function (res) {
                    deferred.resolve(res);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        Parse.Query.prototype.paged = function (page, pageSize) {
            return this.skip((page - 1) * pageSize).limit(pageSize);
        };

        Parse.Query.prototype.search = function (keywords, fields, multiLanguage) {
            if (!keywords) {
                return this;
            }
            if (multiLanguage) {
                var arabicQuery = new Parse.Query('Language');
                arabicQuery.matches('arabicLabel', new RegExp(keywords, 'i'));

                var englishQuery = new Parse.Query('Language');
                englishQuery.matches('englishLabel', new RegExp(keywords, 'i'));

                var subQuery = Parse
                    .Query
                    .or(arabicQuery, englishQuery);

                return this.matchesQuery(fields[0], subQuery);
            }
            return this.matches(fields[0], new RegExp(keywords, 'i'));
        };
    }

    function extendParseObject() {
        // recursive revert
        var originalRevert = Parse.Object.prototype.revert;
        var newRevert = function (o) {
            originalRevert.apply(o);
            var classInfo = _.find(schema, {className: o.className});
            _.each(classInfo.fields, function (v, k) {
                if (v.type === 'Pointer' && o[k]) {
                    originalRevert.apply(o[k]);
                    newRevert(o[k]);
                }
            });
        };
        Parse.Object.prototype.revert = function () {
            newRevert(this);
        };
    }

    _
        .each(schema, function (classInfo) {
            var className = classInfo.className;
            var properties = {};

            var ClassType = Parse
                .Object
                .extend(className, {}, {
                    Query: function () {
                        var query = new Parse.Query(className);
                        return query;
                    },
                    get: function (id, includes, useMasterKey) {
                        var query = new Parse.Query(className);
                        query.equalTo('objectId', id);
                        if (includes) {
                            query.include(includes);
                        }
                        return query.first({
                            useMasterKey: !!useMasterKey
                        });
                    }
                });

            _.each(classInfo.fields, function (v, k) {
                if (k === 'ACL' || k === 'className') {
                    return;
                }

                Object.defineProperty(ClassType.prototype, k, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return this.get(k);
                    },
                    set: function (newValue) {
                        if (newValue === undefined || newValue === null) {
                            this.unset(k);
                        } else {
                            this.set(k, newValue);
                        }
                    }
                });
            });

            if (className === '_User') {
                className = 'User';
            } else if (className === '_Installation') {
                className = 'Installation';
            }

            angular
                .module('karizma.shared')
                .provider(className, function () {
                    this.$get = [function () {
                            return ClassType;
                        }
                    ];
                });
        });

    angular
        .module('karizma.shared')
        .run([
            '$q',
            '$timeout',
            function ($q, $timeout) {
                extendParseQuery($q, $timeout);
                extendParseObject();
            }
        ]);
})();