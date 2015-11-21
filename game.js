var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var PLAYER_SPEED_CHANGE = 15;
var BALL_SPEED_CHANGE = 10;

var platforms;
var playerOne;
var PlayerTwo;
var ball;
var score = 0;

var playerOneGoal;
var playerTwoGoal;

function preload() {
	game.load.image('ground', 'assets/platform.png');
	game.load.image('player', 'assets/player.png');
    game.load.image('ball', 'assets/ball.png');
}

function create() {
	//game.physics.startSystem(Phaser.Physics.ARCADE)
	
	/*platforms = game.add.group();
    platforms.enableBody = true;
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2, 2);
    ground.body.immovable = true;*/
	
	
	playerOne = game.add.sprite(1, game.world.height - 150, 'player');
    playerOneGoal = game.add.sprite(50,100, 'ground');
    playerTwoGoal = game.add.sprite(1125,100, 'ground');
    game.physics.arcade.enable(playerOne);
    game.physics.arcade.enable(playerOneGoal);
    game.physics.arcade.enable(playerTwoGoal);
    playerOneGoal.body.immovable = true;
    playerTwoGoal.body.immovable = true;
    playerOne.body.maxVelocity = new Phaser.Point(160, 160);
    playerOne.body.drag = new Phaser.Point(300, 300);
    //player.body.collideWorldBounds = true;
	
	ball = game.add.sprite(128, game.world.height - 150, 'ball');
    game.physics.arcade.enable(ball);
	
    ball.scale = new Phaser.Point(0.7, 0.7);
	ball.body.bounce = new Phaser.Point(0.4, 0.4);
	ball.body.drag = new Phaser.Point(50, 50);
    ball.body.collideWorldBounds = true;
    
    ball.tint = Math.random() * 0xFFFFFF<<0;
}
function setGameOver(){

}
function update() {
	game.physics.arcade.collide(playerOne, ball);
    game.physics.arcade.collide(ball, playerOneGoal);
    game.physics.arcade.collide(ball, playerTwoGoal);
    game.physics.arcade.collide(ball, playerOneGoal, setGameOver(), null, this);
	var cursors = game.input.keyboard.createCursorKeys();

    if (cursors.left.isDown){
        playerOne.body.velocity.x -= PLAYER_SPEED_CHANGE;
    } else if (cursors.right.isDown){
        playerOne.body.velocity.x += PLAYER_SPEED_CHANGE;
	}
    
    if (cursors.up.isDown){
        playerOne.body.velocity.y -= PLAYER_SPEED_CHANGE;
    }else if(cursors.down.isDown){
		playerOne.body.velocity.y += PLAYER_SPEED_CHANGE;
	}
    
    if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) && game.physics.arcade.distanceBetween(playerOne, ball) < 46){
        var angle = game.physics.arcade.angleBetween(playerOne, ball);
        var velX = Math.cos(angle) * BALL_SPEED_CHANGE;
        var velY = Math.sin(angle) * BALL_SPEED_CHANGE;
        ball.body.velocity.add(velX, velY);
    }
}