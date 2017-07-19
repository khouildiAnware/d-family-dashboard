angular.module('karizma.home')
    .controller('HomeController', ['$scope', '$http', '$timeout', 'User', 'Installation',
        function ($scope, $http, $timeout, User, Installation) {
            var currentYear = new Date().getFullYear();
            $scope.filters = {
                year: currentYear
            };

            $scope.installationGroupBy = 'days';
            $scope.usersGroupBy = 'days';

            $scope.evaluationsFilters = {
                year: currentYear
            };

            var addFilters = function (query) {
                if ($scope.startDate) {
                    query.greaterThanOrEqualTo('createdAt', $scope.startDate);
                }
                if ($scope.endDate) {
                    query.lessThanOrEqualTo('createdAt', $scope.endDate);
                }
            };

            var refreshInstallationsChart = function () {
                $scope.installationUI.block();
                Parse.Cloud.run('GetInstallationStats', {
                    groupBy: $scope.installationGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {
                    $scope.installationUI.unblock();

                    $timeout(function () {
                        $scope.iosInstallationsCount = result.ios.length;
                        $scope.androidInstallationsCount = result.android.length;
                        $scope.installationsCount = result.ios.length + result.android.length;
                    });
                    $.plot($('#installation_statistics'), [{
                                data: result.ios,
                                lines: {
                                    lineWidth: 1
                                },
                                color: ['#BAD9F5']
                            }, {
                                data: result.ios,
                                points: {
                                    show: true,
                                    fill: false,
                                    radius: 2,
                                    lineWidth: 3
                                },
                                color: '#9ACAE6',
                                shadowSize: 0
                            },
                            {
                                data: result.android,
                                lines: {
                                    lineWidth: 1
                                },
                                color: ['#6ab344']
                            }, {
                                data: result.android,
                                points: {
                                    show: true,
                                    fill: false,
                                    radius: 2,
                                    lineWidth: 3
                                },
                                color: '#6ab344',
                                shadowSize: 0
                            }
                        ],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: 'categories',
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: 'normal',
                                    variant: 'small-caps',
                                    color: '#6F7B8A'
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: '#eee',
                                font: {
                                    lineHeight: 14,
                                    style: 'normal',
                                    variant: 'small-caps',
                                    color: '#6F7B8A'
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: '#eee',
                                borderColor: '#eee',
                                borderWidth: 1
                            }
                        });
                });
            };

            var refreshUsersChart = function () {
                $scope.usersUI.block();
                Parse.Cloud.run('GetUsersStats', {
                    groupBy: $scope.usersGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (data) {
                    $scope.usersUI.unblock();
                    $.plot($('#users_statistics'), [{
                            data: data,
                            lines: {
                                fill: 0.6,
                                lineWidth: 0
                            },
                            color: ['#BAD9F5']
                        }, {
                            data: data,
                            points: {
                                show: true,
                                fill: true,
                                radius: 2,
                                fillColor: '#9ACAE6',
                                lineWidth: 3
                            },
                            color: '#9ACAE6',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: 'categories',
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: 'normal',
                                    variant: 'small-caps',
                                    color: '#6F7B8A'
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: '#eee',
                                font: {
                                    lineHeight: 14,
                                    style: 'normal',
                                    variant: 'small-caps',
                                    color: '#6F7B8A'
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: '#eee',
                                borderColor: '#eee',
                                borderWidth: 1
                            }
                        });
                });
            };

            var refreshCategoriesSearchChart = function () {
                $scope.categoriesSearchUI.block();

                Parse.Cloud.run('GetCategoriesSearchStats', {
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {
                    $scope.categoriesSearchUI.unblock();

                    $timeout(function () {
                        $scope.categoriesSearchCount = result.count;
                    });

                    $.plot('#categories_search_statistics', [result.data], {
                        series: {
                            bars: {
                                show: true,
                                barWidth: 0.5,
                                align: 'center',
                                lineWidth: 0,
                                shadowSize: 0
                            }
                        },
                        xaxis: {
                            mode: 'categories',
                            tickLength: 0
                        },
                        grid: {
                            tickColor: '#eee',
                            borderColor: '#eee',
                            borderWidth: 1
                        }
                    });
                });
            };

           /* var refreshTop10Places = function () {
                $scope.top10UI.block();

                Parse.Cloud.run('GetMostVisitedPlaces', {
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {
                    $scope.top10UI.unblock();

                    $timeout(function () {
                        $scope.topPlaces = result;
                    });
                });
            };*/

            var refresh = function () {
                var userCountQuery = new User.Query();
                addFilters(userCountQuery);
                userCountQuery.count().then(function (totalUsers) {
                    $timeout(function () {
                        $scope.usersCount = totalUsers;
                    });
                });

                /*var adsCountQuery = new PlaceAdvertise.Query();
                addFilters(adsCountQuery);

                adsCountQuery.count({
                    useMasterKey: true
                }).then(function (totalAds) {
                    $timeout(function () {
                        $scope.adsCount = totalAds;
                    });
                });*/

                refreshInstallationsChart();
                refreshUsersChart();
                refreshCategoriesSearchChart();
                refreshTop10Places();
            };

            $scope.startDate = moment().startOf('week').toDate();
            $scope.endDate = moment().endOf('week').toDate();

            $scope.years = _.chain(_.range(1, 5)).map(function (n) {
                return currentYear - n;
            }).value();

            $scope.dateRangeChanged = function (startDate, endDate) {
                $scope.selectedRange = 'مخصص';
                $scope.startDate = startDate.toDate();
                $scope.endDate = endDate.toDate();
            };

            $scope.selectRange = function (rangeLabel, range) {
                if (range) {
                    $scope.selectedRange = rangeLabel;
                    $scope.startDate = range[0].toDate();
                    $scope.endDate = range[1].toDate();
                }
            };

            $scope.ranges = {
                'اليوم': [moment(), moment()],
                'أمس': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'هذا الأسبوع': [moment().startOf('week'), moment().endOf('week')],
                'هذا الشهر': [moment().startOf('month'), moment().endOf('month')],
                'الشهر الفارط': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            };

            $scope.selectedRange = 'هذا الأسبوع';

            $scope.$watch('startDate', function () {
                refresh();
            });

            $scope.changeUsersFilter = function (groupBy) {
                $scope.usersGroupBy = groupBy;
                refreshUsersChart();
            };

            $scope.changeInstallationFilter = function (groupBy) {
                $scope.installationGroupBy = groupBy;
                refreshInstallationsChart();
            };

            // TODO: REMOVE DOM ACCESS FROM CONTROLLER -> Create a directive
            function showChartTooltip(x, y, xValue, yValue) {
                $('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y - 10,
                    left: x - 10,
                    border: '0px solid #ccc',
                    padding: '2px 6px',
                    'background-color': '#fff'
                }).appendTo('body').fadeIn(200);
            }
            var previousPoint = null;
            $('#installation_statistics, #users_statistics').bind('plothover', function (event, pos, item) {
                $('#x').text(pos.x.toFixed(2));
                $('#y').text(pos.y.toFixed(2));
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;
                        $('#tooltip').remove();
                        var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2);
                        showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + '');
                    }
                }
            });

            $('#installation_statistics, #users_statistics').bind('mouseleave', function () {
                $('#tooltip').remove();
            });
        }
    ]);