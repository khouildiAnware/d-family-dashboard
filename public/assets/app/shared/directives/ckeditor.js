angular.module('karizma.shared')
    .directive('ckeditor', [function () {

        function setupEditor(editor, config, height, scope, ngModel) {

            CKEDITOR.dtd.$removeEmpty.span = 0;
            CKEDITOR.dtd.$removeEmpty.i = 0;

            editor.config.allowedContent = true;

            if (height) {
                editor.config.height = height;
            }

            if (!ngModel) return;
            editor.on('instanceReady', function () {
                editor.setData(ngModel.$viewValue);
            });
            editor.on('mode', function () {
                var fn = function () {
                    ngModel.$setViewValue(editor.getData());
                };

                if (!scope.$$phase)
                    scope.$apply(fn);
                else
                    fn();
            });

            editor.on('pasteState', function () {
                var fn = function () {
                    ngModel.$setViewValue(editor.getData());
                };

                if (!scope.$$phase)
                    scope.$apply(fn);
                else
                    fn();
            });

            editor.on('focus', function () {
            });

            editor.on('key', function (e) {
                var fn = function () {
                    var data = editor.getData();
                    ngModel.$setViewValue(data);
                };

                if (!scope.$$phase)
                    scope.$apply(fn);
                else
                    fn();
            });

            editor.on('paste', function (e) {
                var fn = function () {
                    var data = editor.getData();
                    ngModel.$setViewValue(data);
                };
                if (!scope.$$phase)
                    scope.$apply(fn);
                else
                    fn();
            });

            ngModel.$render = function (value) {
                editor.setData(ngModel.$viewValue);
            };
        }

        return {
            require: '?ngModel',
            restrict: "A",
            link: function (scope, element, attr, ngModel) {
                var el = element[0];
                var $editor = $(el);
                var name = attr.ngCkeditor;
                var height = $editor.attr("height");
                $editor.attr("name", name);
                var config = {
                    contentsLangDirection: 'rtl'
                };
                CKEDITOR.basePath = '/assets/template/js/plugins/editors/ckeditor/';

                var initiliazed = false;
                var init = function () {
                    var editor = CKEDITOR.replace(el, { contentsLangDirection: 'rtl', toolbar: 'basic', resize_enabled: false });
                    setupEditor(editor, config, height, scope, ngModel);
                    initiliazed = true;
                };


                if (!attr.$attr.delay)
                    init();
                else {
                    attr.$observe('delay', function (val) {
                        if (initiliazed)
                            return;
                        if (val) {
                            init();
                        }
                    })
                }
            }
        };
    }]);