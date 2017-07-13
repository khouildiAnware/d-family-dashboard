angular.module('karizma.shared')
    .filter('translateContractStage', function () {
        return function (stage) {
            if (!stage) {
                return '';
            }

            if (stage === 'Application') {
                return 'طلب ترشح';
            }
            else if (stage === 'Interviewing') {
                return 'نقاش';
            }
            else if (stage === 'Cancelled') {
                return 'ملغى';
            }
            else if (stage === 'Started') {
                return 'بدأ العمل';
            }
            else if (stage === 'Disputed') {
                return 'في نزاع';
            }
            else if (stage === 'Ended') {
                return 'تم';
            }
            else if (stage === 'Suspended') {
                return 'مغلق';
            }
            return 'غير معروف';
        };
    });