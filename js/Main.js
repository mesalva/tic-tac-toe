var Front = new Front(),
	Messages = new Messages(),
	Sounds = new Sounds();
	Game = new Game(jQuery, Front, Messages, Sounds),

Game.setPlayer(new Player({
	id: 			'x',
	name: 			'Eu'
}));
Game.setPlayer(new Player({
	id: 			'o',
	name: 			'PC'
}));

// 'custom', 'manual', 'normal'
Game.start({manual_input: 'manual'});


