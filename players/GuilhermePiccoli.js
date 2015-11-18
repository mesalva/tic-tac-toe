function GuilhermePiccoli(game_array, player_id, game_pattern) {
	var ai = new Ai(game_array, game_pattern, player_id);
	return ai.getMove();
}

/* AI */
function Ai(game_array, game_pattern, player_id) {
	this.game_array 	= game_array;
	this.game_pattern 	= game_pattern;
	this.player_id 		= player_id;
	this.win_patterns	= Array(7, 73, 292, 448, 273, 84, 56, 146),
	this.move			= Array(Math.floor((Math.random() * 3) + 0), Math.floor((Math.random() * 3) + 0));
	this.block_trys 	= Array();
	this.win_trys 		= Array();
}

Ai.prototype.getMove = function() {
	if(this.tryToDefineNewMove()) {
		return this.move;
	}
	return this.backupMove();
};

Ai.prototype.tryToDefineNewMove = function() {
	if(this.tryWinMove('x')) {
		return true;
	} else if(this.tryBlockMove('o')) {
		return true;
	}
	return false;
};

Ai.prototype.tryWinMove = function(type) {
	for(var ai in this.game_pattern) {
		if(this.game_pattern[ai] != 0 && this.game_pattern[ai] == type) {
			for(var bi in this.game_pattern) {
				var sum = Math.pow(2, ai) + Math.pow(2, bi);
				if(this.game_pattern[bi] == type && ai != bi && this.win_trys.indexOf(sum) < 0) {
					this.newMove(sum, 'win');
					return true;
				}
			}
		}
	}
	return false;
};

Ai.prototype.tryWinMoveBackup = function(type) {
	for(var ai in this.game_pattern) {
		if(this.game_pattern[ai] != 0 && this.game_pattern[ai] == type) {
			for(var bi in this.game_pattern) {
				var sum = Math.pow(2, ai) + Math.pow(2, bi);
				if(this.game_pattern[bi] == type && ai != bi && this.win_trys.indexOf(sum) < 0) {
					this.newMove(sum, 'win_backup');
					return true;
				}
			}
		}
	}
	return false;
};

Ai.prototype.tryBlockMove = function(type) {
	for(var ai in this.game_pattern) {
		if(this.game_pattern[ai] != 0 && this.game_pattern[ai] == type) {
			for(var bi in this.game_pattern) {
				var sum = Math.pow(2, ai) + Math.pow(2, bi);
				if(this.game_pattern[bi] == type && ai != bi && this.block_trys.indexOf(sum) < 0) {
					this.newMove(sum, 'block');
					return true;
				}
			}
		}
	}
	return false;
};

Ai.prototype.backupMove = function() {
	var trys = [5, 0, 9, 7, 2, 4, 6];
	var map = [[1,1], [0,2], [2,0] [2,1], [0,1], [1,2], [1,0]];
	for(var i = 0; i < trys.length; i++) {
		if(this.game_pattern[trys[i]-1] == 0) {
			return map[i];
		}
	}
	return Array(Math.floor((Math.random() * 3) + 0), Math.floor((Math.random() * 3) + 0));
};

Ai.prototype.newMove = function(sum, move_type) {
	if(sum == 3 || sum == 6 || sum == 5) {
		var	starts_at	= Array(0,0),
			hypothesis	= Array(0,1);
	} else if(sum == 9 || sum == 72 || sum == 65) {
		var starts_at	= Array(0,2),
			hypothesis	= Array(1,0);
	} else if(sum == 192 || sum == 384 || sum == 320) {
		var starts_at	= Array(2,2),
			hypothesis	= Array(0,-1);
	} else if(sum == 36 || sum == 288 || sum == 260) {
		var starts_at	= Array(0,0),
			hypothesis	= Array(1,0);
	} else if(sum == 18 || sum == 144 || sum == 130) {
		var starts_at	= Array(0,1),
			hypothesis	= Array(1,0);
	} else if(sum == 24 || sum == 48 || sum == 40) {
		var starts_at	= Array(1,0),
			hypothesis	= Array(0,1);
	} else if(sum == 17 || sum == 272 || sum == 257) {
		var starts_at	= Array(0,2),
			hypothesis	= Array(1,-1);
	} else if(sum == 20 || sum == 80 || sum == 68 || sum == 18) {
		var starts_at	= Array(0,0),
			hypothesis	= Array(1,1);
	} else if(sum == 264) {
		var starts_at	= Array(0,2),
			hypothesis	= Array(0,-1);
	} else if(sum == 96) {
		var starts_at	= Array(2,0),
			hypothesis	= Array(-2,1);
	} else if(sum == 160) {
		var starts_at	= Array(0,2),
			hypothesis	= Array(1,-1);
	}

	if(starts_at) {
		var move = starts_at,
			i = 0;
		while(!this.isValidMove(move) && ++i < 10) {
			var x = move[0] + hypothesis[0],
				y = move[1] + hypothesis[1];
			if(x <= 2 && y <= 2) {
				move = Array(x, y);
			}
		}
		if(i < 10) {
			this.move = move;
			return false;
		}
	}


	if(move_type == 'win') {
		this.win_trys.push(sum);
		if(!this.tryWinMoveBackup('x')) {
			for(var i = 0; i < 9; i++) {
				this.tryBlockMove('o');
			}
		}
	} else if(move_type == 'block') {
		this.block_trys.push(sum);
	} else if(move_type == 'win_backup') {
		this.win_trys.push(sum);
		this.tryWinMove('x');
	}
};

Ai.prototype.isValidMove = function(move) {
	if(this.game_array[move[0]][move[1]] == 0) {
		return true;
	}
	return false;
};