var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var PLAYER_SPEED_CHANGE = 15;
var BALL_SPEED_CHANGE = 40;

var platforms;
var player;
var ball;

function preload() {
	game.load.image('ground', 'assets/platform.png');
	game.load.image('player', 'assets/player.png');
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE)
	
	/*platforms = game.add.group();
    platforms.enableBody = true;
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2, 2);
    ground.body.immovable = true;*/
	
	
	player = game.add.sprite(16, game.world.height - 150, 'player');
    game.physics.arcade.enable(player);
    player.body.maxVelocity = new Phaser.Point(90, 90);
    player.body.drag = new Phaser.Point(20, 20);
    player.body.collideWorldBounds = true;
	
	ball = game.add.sprite(129, game.world.height - 150, 'player');
    game.physics.arcade.enable(ball);
	
    ball.scale = new Phaser.Point(0.7, 0.7);
	ball.body.bounce = new Phaser.Point(0.4, 0.4);
	ball.body.drag = new Phaser.Point(30, 30);
    ball.body.collideWorldBounds = true;
    ball.tint = Math.random() * 0xFFFFFF<<0;
}

function update() {
	game.physics.arcade.collide(player, ball);
	
	var cursors = game.input.keyboard.createCursorKeys();

    if (cursors.left.isDown){
        player.body.velocity.x -= PLAYER_SPEED_CHANGE;
    } else if (cursors.right.isDown){
        player.body.velocity.x += PLAYER_SPEED_CHANGE;
	}
    
    if (cursors.up.isDown){
        player.body.velocity.y -= PLAYER_SPEED_CHANGE;
    }else if(cursors.down.isDown){
		player.body.velocity.y += PLAYER_SPEED_CHANGE;
	}
    
    if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) && game.physics.arcade.distanceBetween(player, ball) < 46){
        var angle = game.physics.arcade.angleBetween(player, ball);
        var velX = Math.cos(angle) * BALL_SPEED_CHANGE;
        var velY = Math.sin(angle) * BALL_SPEED_CHANGE;
        ball.body.velocity.add(velX, velY);
    }
}