angular.module('karizma.shared')
    .directive('blockUi', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope[attr.blockUi] = {
                    block: function () {
                        element.block({
                            message: '<div class="icon-spinner9 icon-spin icon-lg"></div>',
                            overlayCSS: {
                                backgroundColor: '#FFF',
                                cursor: 'wait',
                            },
                            css: {
                                border: 0,
                                padding: 0,
                                backgroundColor: 'none'
                            }
                        });
                    },
                    unblock: function () {
                        element.unblock();
                    }
                };
            }
        };
    });