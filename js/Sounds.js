function Sounds() {
	this.autoload = {
		'btn-hover': {
			file:		'btn-hover.wav',
			hover:		'div.item',
			volume:		0.4
		},
		'btn-click-error': {
			file: 		'btn-click-error.wav',
			volume:		0.4
		},
		'btn-click': {
			file: 		'btn-click.wav',
			click:		'div.item',
			volume:		0.3
		},
		'win': {
			file:		'win.wav',
			volume:		0.3
		},
		'tie': {
			file:		'tie.wav',
			volume:		0.4
		},
		'_blank': {
			file:		'btn-click-error.wav',
			volume:		0
		},
	};
	this.runAutoload(this);
}

Sounds.prototype.runAutoload = function(self) {
	for(var id in self.autoload) {
		if(self.autoload[id].hover) {
			var i = id;
			$(self.autoload[i].hover).mouseenter(function() {
				self.play(i);
			});
		} else if(self.autoload[id].click) {
			var j = id;
			$(self.autoload[j].click).click(function () {
				self.play(j);
			});
		} else if(self.autoload[id].autoplay) {
			var element = self.play(id);
			setInterval(function() {
				self.play(id);
			}, self.autoload[id].autoplay * 1000);
			$('div.sound-volume').click(function() {
				$('div.sound-volume').toggleClass('sound-volume-off');
				if(element[0].volume) {
					element[0].volume = 0;
					self.autoload[id]._volume = self.autoload[id].volume;
					self.autoload[id].volume = 0;
				} else {
					element[0].volume = self.autoload[id]._volume;
					self.autoload[id].volume = self.autoload[id]._volume;
				}
			});
		}
	}
};

Sounds.prototype.play = function(id) {
	var $element = $('<audio></audio>').attr({
		'id': 			id,
		'src': 			'sounds/' + this.autoload[id].file,
		'autoplay':		'autoplay'
	}).prop({'volume': this.autoload[id].volume});
	if(this.autoload[id].autoplay) {
		$element[0].currentTime = this.autoload[id].autoplay;
	}
	return $element;
};