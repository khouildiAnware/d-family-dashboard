angular.module('karizma.shared')
    .filter('pictureSize', function() {
	return function(picture, size) {
		if (!picture){
			return '';
		}
		var url = null;
		if (size === 'f'){
			url = picture.full;
		}
		else if (size === 'm'){
			url = picture.medium || picture.full;
		}
		else if (size === 's'){
			url = picture.small || picture.medium || picture.full;
		}

		return url;
	}
});