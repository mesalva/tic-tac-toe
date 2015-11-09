function Game(jQuery, Front, Messages) {
	this.jquery = jQuery;
	this.front = Front;
	this.messages = Messages;
	this.sounds = Sounds;
	this.config = {
		ended:				false,
		max_players:		2,
		round_delay:		500,
		round_interval: 	null,
		round_count:		0,
		round_turns:		['x', 'o'],
		plays_count:		1,
		game_pattern:		[0,0,0,0,0,0,0,0,0],
		win_patterns:		Array(7, 73, 292, 448, 273, 84, 56, 146),
		array_map:			Array(0, '0,2', '0,1', '0,0', '1,2', '1,1', '1,0', '2,2', '2,1', '2,0'),
		manual_input_turn:	false
	};
	this.player = {};
};

Game.prototype.getConfig = function() {
	return this.config;
};

Game.prototype.getTurn = function() {
	return this.config.round_turns[this.config.round_count];
};

Game.prototype.getArrayXY = function() {
	var xy = Array(Array(0, 0, 0), Array(0, 0, 0), Array(0, 0, 0));
	var index;
	for(index in this.config.game_pattern) {
		if(this.config.game_pattern[index] == 'x' || this.config.game_pattern[index] == 'o') {
			var map = this.config.array_map[parseInt(index)+1].toString();
			if(map.search(',') > -1) {
				xy[parseInt(map.split(',')[0])][parseInt(map.split(',')[1])] = this.config.game_pattern[index];
			}
		}
	}
	return xy;
};

Game.prototype.setPlayer = function(p) {
	if(Object.sizeof(this.player) >= this.config.max_players) {
		throw this.messages.max_players;
	}
	this.jquery(this.front.player[p.id].name).html(p.name);
	this.player[p.id] = p;
};

Game.prototype.play = function(cords) {
	cords = this.convertCordsIfIsArray(cords);
	var player_id = this.config.round_turns[this.config.round_count];
	if(this.checkIfMovementIsValid(cords)) {
		this.saveMovement(player_id, cords);
		this.checkForWinner();
		this.callATieIfNoSpace();
		this.checkIfGameEnded();
		this.writeBlocksAndLog(player_id, cords);
		this.incrementPlaysAndRound();
	} else {
		this.showBlockError(cords);
	}
};

Game.prototype.convertCordsIfIsArray = function(cords) {
	if(Object.prototype.toString.call(cords) == '[object Array]') {
		var map = cords[0] + ',' + cords[1];
		cords = this.config.array_map.indexOf(map);
	}
	return cords;
};

Game.prototype.incrementRoundCountAndResetIfMoreThen2 = function() {
	if(++this.config.round_count >= 2) {
		this.config.round_count = 0;
	}
};

Game.prototype.incrementPlaysCount = function() {
	this.config.plays_count++;
};

Game.prototype.writeBlocksAndLog = function(player_id, cords) {
	this.writeBlocks(player_id, cords);
	this.writeLog(player_id, cords);
};

Game.prototype.incrementPlaysAndRound = function() {
	this.incrementPlaysCount();
	this.incrementRoundCountAndResetIfMoreThen2();
};

Game.prototype.writeBlocks = function(player_id, cords) {
	this.jquery(this.front.game.item.id + cords).
		children(this.front.game.item.class).
		removeClass(this.front.game.item.empty).
		addClass(this.front.game.item.xo + player_id);
};

Game.prototype.writeLog = function(player_id, cords) {
	var span = this.jquery(this.front.game.log.element).html('#'+this.config.plays_count + ' [' + this.config.array_map[cords] + ']');
	this.jquery(this.front.game.log.id + player_id).append(span);
};

Game.prototype.checkIfMovementIsValid = function(cords) {
	if(this.config.game_pattern[cords-1]) {
		return false;
	}
	return true;
};

Game.prototype.saveMovement = function(player_id, cords) {
	this.config.game_pattern[cords-1] = player_id;
};

Game.prototype.showBlockError = function(cords) {
	var block = this.jquery(this.front.game.item.id + cords).children(this.front.game.item.class);
	block.addClass(this.front.game.item.error);
	self = this;
	setTimeout(function() {
		block.removeClass(self.front.game.item.error);
	}, 400);
	this.sounds.play('btn-click-error');
};

/* refatorar */
Game.prototype.checkForWinner = function() {
	for(var ai in this.config.game_pattern) {
		if(this.config.game_pattern[ai] != 0) {
			var type = this.config.game_pattern[ai];
			for(var bi in this.config.game_pattern) {
				if(this.config.game_pattern[bi] == type && ai != bi) {
					for (var ci in this.config.game_pattern) {
						if(this.config.game_pattern[ci] == type && ai != ci && ai != bi) {
							var sum = Math.pow(2, ai) + Math.pow(2, bi) + Math.pow(2, ci);
							if(this.config.win_patterns.indexOf(sum) >= 0) {
								this.endGameWithWinner(ai, bi, ci, type);
								return false;
							}
						}
					}
				}
			}
		}
	}
};

Game.prototype.endGame = function() {
	this.config.ended = true;
};

Game.prototype.endGameWithWinner = function(ai, bi, ci, type) {
	this.writeAndShowWinnerMask(ai, bi, ci, type);
	this.jquery(this.front.game.item.id + (parseInt(ai)+1) + ',' + this.front.game.item.id + (parseInt(bi)+1) + ',' + this.front.game.item.id + (parseInt(ci)+1)).
		children(this.front.game.item.class).
		addClass(this.front.game.item.success);

	this.endGame();
	this.sounds.play('win');
};

Game.prototype.endGameWithATie = function() {
	this.writeAndShowATieMask();
	this.closeManualInput();
	this.endGame();
	this.sounds.play('tie');
};

Game.prototype.checkIfGameEnded = function() {
	if(this.config.ended || this.config.plays_count >= 9) {
		clearInterval(this.config.round_interval);
	}
};

Game.prototype.callATieIfNoSpace = function() {
	if(this.config.ended) {
		return false;
	}
	var has_space = false;
	for(var i in this.config.game_pattern) {
		if(!this.config.game_pattern[i]) {
			has_space = true;
		}
	}
	if(!has_space) {
		this.endGameWithATie();
	}
};

Game.prototype.setRoundInterval = function(interval) {
	this.config.round_interval = interval;
};

Game.prototype.writeAndShowWinnerMask = function(ai, bi, ci, type) {
	var self = this;
	this.jquery(this.front.game.mask.class_winner).html('[' + type + '] '+ this.player[type].name);
	setTimeout(function() {
		self.jquery(self.front.game.mask.class).show().removeClass(self.front.game.mask.class_hidden);
	}, 2000);
};

Game.prototype.writeAndShowATieMask = function() {
	var self = this;
	this.jquery(this.front.game.mask.class_winner).html('Empate!');
	setTimeout(function() {
		self.jquery(self.front.game.mask.class).show().removeClass(self.front.game.mask.class_hidden);
	}, 2000);
};

Game.prototype.start = function(conf) {
	if(conf.manual_input == 'manual') {
		this.runManualInputGame();
	} else if (conf.manual_input == 'custom') {
		this.runCustom();
	} else if(conf.manual_input == 'normal') {
		this.runGame();
	}
};

Game.prototype.runCustom = function(conf) {
	var self = this;

	this.play(4);
	this.play(2);
	this.play(1);
	this.play(5);
	this.play(8);
	this.play(7);
	this.play(window['Eu'](self.getArrayXY(), self.config.game_pattern, self.getTurn()));
};

Game.prototype.runGame = function(conf) {
	var self = this;
	this.setRoundInterval(setInterval(function() {
		var player = self.player[self.getTurn()];
		var move = window[player.name](self.getArrayXY(), self.getTurn());
		self.play(move);
	}, self.getConfig().round_delay));
};

Game.prototype.runManualInputGame = function() {
	this.tryToPlayXOnManualInputMode(this);
	this.openToUserClickOnManualInputMode(this);
};

Game.prototype.tryToPlayXOnManualInputMode = function(self) {
	var try_x = setInterval(function() {
		if(self.config.ended) {
			clearInterval(try_x);
			return false;
		}
		var player = self.player[self.getTurn()];
		var move = window[player.name](self.getArrayXY(), self.config.game_pattern, self.getTurn());
		self.config.manual_input_turn = true;
		self.play(move);
		self.jquery('div.item').find('span:not(.item-piece-o, .item-piece-x)').parent().addClass('item-clickable');
		if(self.getTurn() == 'o') {
			clearInterval(try_x);
		}
	}, self.getConfig().round_delay);
};

Game.prototype.openToUserClickOnManualInputMode = function(self) {
	self.jquery(function() {
		self.jquery('div.item').click(function() {
			var move = self.jquery(this).attr('id').substr(5,1);
			if(!self.config.manual_input_turn) {
				return false;
			} else if(self.jquery(this).find('.item-piece-o, .item-piece-x').size()) {
				self.showBlockError(move);
				return false;
			} else if(self.config.ended) {
				clearInterval(try_x);
				return false;
			}
			self.config.manual_input_turn = false;
			self.jquery('div.item').removeClass('item-clickable');
			self.play(move);
			setTimeout(function() {
				self.tryToPlayXOnManualInputMode(self);
			}, self.getConfig().round_delay);
		});
	});
};

Game.prototype.closeManualInput = function() {
	this.config.manual_input_turn =  false;
};