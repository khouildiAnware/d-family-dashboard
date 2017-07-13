angular.module('karizma.shared')
	.filter('language', function () {
		return function (label, language) {
			if (!label) {
				return '';
			}
			else if (!language || language === 'ar') {
				return label.arabicLabel;
			}
			else if (language === 'en') {
				return label.englishLabel;
			}
			else {
				return 'UNKNOWN LANGUAGE';
			}
		}
	});