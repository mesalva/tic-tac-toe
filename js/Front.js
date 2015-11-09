function Front() {
	this.game = {
		item: {
			class: 		'.item-piece',
			id: 		'div#item-',
			empty: 		'item-piece-empty',
			error: 		'item-piece-error',
			success:	'item-piece-success',
			xo: 		'item-piece-'
		},
		log: {
			element:	'<span>',
			id:			'div#player-log-',
			class: 		'div.player-log'
		},
		mask: {
			class: 			'div.winner-mask',
			class_hidden:	'winner-mask-hidden',
			class_winner:	'span.winner-name'
		}
	};

	this.player = {
		'x': {
			id:		'strong#player-x-id',
			name:	'strong#player-x-name'
		},
		'o': {
			id:		'strong#player-o-id',
			name:	'strong#player-o-name'
		}
	};

	this.maks = {

	};
};