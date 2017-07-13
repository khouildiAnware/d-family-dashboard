angular.module('karizma.shared')
    .provider('ValidationService',
        function () {
            var working = false;
            var formatError = function (msg, fieldName) {
                return msg.replace('%f', fieldName);
            };
            this.$get = ['$parse', function ($parse) {
                return {
                    validate: function ($scope, object, validationRules, errors) {
                        _.each(validationRules, function (v, k) {
                            var expression = $parse(k);
                            var val = expression(object);
                            if (v.required) {
                                if (v.multiLang) {
                                    if (!val || !val.arabicLabel) {
                                        errors.push({
                                            field: k,
                                            message: formatError('الترجمة العربية للحقل "%f" إلزامية', v.arabicName)
                                        });
                                    }
                                    if (!val || !val.englishLabel) {
                                        errors.push({
                                            field: k,
                                            message: formatError('الترجمة الانجليزية للحقل "%f" إلزامية', v.arabicName)
                                        });
                                    }
                                } else if (v.isImage) {
                                    var queue = $scope[v.queueKey];
                                    if ((!v || !v.length) && !queue.length) {
                                        errors.push({
                                            field: k,
                                            message: formatError('حقل "%f" إلزامي', v.arabicName)
                                        });
                                    }
                                } else if (!val) {
                                    errors.push({
                                        field: k,
                                        message: formatError('حقل "%f" إلزامي', v.arabicName)
                                    });
                                }
                            }
                        });

                        return !errors.length;
                    }
                };
            }];
        });