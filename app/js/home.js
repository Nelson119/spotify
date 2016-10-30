'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, api, auth, $ */
app.partial.home = function(){

	$('#login').click(function(){
		
		auth.openLogin(function(){
			api.getUserPlaylists('spotifytaiwan')
			.then(function(data) {
				
				$('select').html('');
				$(data.items).each(function(i, d){
					var option = $('<option></option>')
						.html(d.name)
						.on('click', function(){
							api.getPlaylistTracks('spotifytaiwan', d.id)
							.then(function(r) {
								$('.list-1 ol').html('');
								$(r.items).each(function(){
									var li = $('<li></li>').addClass('col-lg-4 col-md-4 col-sm-4 col-xs-4');
									li.append($('<p></p>').html(this.track.name + '-' + this.track.album.name));
									var artists = [];
									$.each(this.track.artists,function(){
										artists.push(this.name);
									});
									li.append($('<p></p>').html(artists.join(', ')));
									$('.list-1 ol').append(li);
								});
							}, function(err) {
								console.error(err);
							});
						});
					$('select').append(option);
				});
				$('select option:eq(0)').trigger('click');
			}, function(err) {
				console.error(err);
			});
		});
	});
	// auth.openLogin();
	// checkUser(true);
	var playlists = [];
	$('select').on('change', function(){
		$('option:selected', this).trigger('click');
	});

	$('#top50').on('click', function(){
		auth.openLogin(function(){
			api.getRecommendations({limit: 50, target_mode: 1,market: 'TW', seed_genres: 'mandopop, cantopop', min_popularity: 15})
			.then(function(data) {
				console.log(data);
				$('.list-3 ol').html('');
				$(data.tracks).each(function(){
					var li = $('<li></li>').addClass('col-lg-4 col-md-4 col-sm-4 col-xs-4');
					li.append($('<p></p>').html(this.name + '-' + this.album.name));
					var artists = [];
					$.each(this.artists,function(){
						artists.push(this.name);
					});
					li.append($('<p></p>').html(artists.join(', ')));
					$('.list-3 ol').append(li);
				});
			}, function(err) {
				console.error(err);
			});
		});
	});

	$('[name=search]').on('input', function(e){
		$('.list-2 ol').html('');
		api.searchTracks($(this).val(), {limit: 50, type: 'track'})
		    .then(function(data) {
				$(data.tracks.items).each(function(){
					var li = $('<li></li>').addClass('col-lg-4 col-md-4 col-sm-4 col-xs-4');
					li.append($('<p></p>').html(this.name + '-' + this.album.name));
					var artists = [];
					$.each(this.artists,function(){
						artists.push(this.name);
					});
					li.append($('<p></p>').html(artists.join(', ')));
					$('.list-2 ol').append(li);
				});
		    }, function(err) {
		      console.error(err);
		    });
	});
};
