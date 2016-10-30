'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global  $, api, auth */


(function(exports) {


	
	var CLIENT_ID = '';
	var REDIRECT_URI = '';

	if (/localhost[:]9000/.test(location.href)) {
		CLIENT_ID =	'71aac3cffd9648a889c174c4b32f7d57';
		REDIRECT_URI = 'http://localhost:9000/callback.html';
	} else {
		CLIENT_ID =	'71aac3cffd9648a889c174c4b32f7d57';
		REDIRECT_URI = 'http://nelson.works/spotify/callback.html';
		// CLIENT_ID = '9714921402b84783b2a207f1b6e82612';
		// REDIRECT_URI = 'http://lab.possan.se/thirtify/callback.html';
	}

	function getLoginURL(scopes) {
		return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID
			+ '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
			+ '&scope=' + encodeURIComponent(scopes.join(' '))
			+ '&response_type=token';
	}

	return exports.auth = {
		openLogin: function(callback) {
			var url = getLoginURL([
				'user-read-private',
				'playlist-read-private',
				'playlist-modify-public',
				'playlist-modify-private',
				'user-library-read',
				'user-library-modify',
				'user-follow-read',
				'user-follow-modify'
			]);

			var width = 450,
					height = 730,
					left = (screen.width / 2) - (width / 2),
					top = (screen.height / 2) - (height / 2);

			var w = window.open(url,
					'Spotify',
					'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
			);
			$(window).one("message", function(event) {
				console.log('got postmessage', event);
				var hash = JSON.parse(event.originalEvent.data);
				if (hash.type == 'access_token') {
					auth.setAccessToken(hash.access_token, hash.expires_in || 60);
					api.setAccessToken(hash.access_token, hash.expires_in || 60);
					auth.checkUser(true);
					if(typeof callback === 'function'){
						callback();
					}
				}
			});

		},
		getAccessToken: function() {
			var expires = 0 + localStorage.getItem('pa_expires', '0');
			if ((new Date()).getTime() > expires) {
				return '';
			}
			var token = localStorage.getItem('pa_token', '');
			return token;
		},
		setAccessToken: function(token, expires_in) {
			localStorage.setItem('pa_token', token);
			localStorage.setItem('pa_expires', (new Date()).getTime() + expires_in);
			// _token = token;
			// _expires = expires_in;
		},
		getUsername: function() {
			var username = localStorage.getItem('pa_username', '');
			return username;
		},
		setUsername: function(username) {
			localStorage.setItem('pa_username', username);
		},
		getUserCountry: function() {
			var userCountry = localStorage.getItem('pa_usercountry', 'US');
			return userCountry;
		},
		setUserCountry: function(userCountry) {
			localStorage.setItem('pa_usercountry', userCountry);
		},
		checkUser: function (redirectToLogin) {
			api.getMe().then(function(userInfo) {
				auth.setUsername(userInfo.id);
				auth.setUserCountry(userInfo.country);
				console.log(userInfo);
				var text = $('.user-info').html();
				$('.user-info').html(
					text.replace(/[{][{]display_name[}][}]/, userInfo.display_name)
					.replace(/[{][{]country[}][}]/, userInfo.country)
				);
				// if (redirectToLogin) {
				// 	auth.openLogin();
				// }
			}, function(err) {
				auth.openLogin(err);
			});
		}
};
})(window || this);
