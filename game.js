var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var PLAYER_SPEED_CHANGE = 15;
var BALL_SPEED_CHANGE = 16.5;

var platforms;
var playerOne;
var PlayerTwo;
var ball;
var score = 0;

var playerOneGoal;
var playerTwoGoal;

var text;

function preload() {
	game.load.image('ground', 'assets/platform.png');
	game.load.image('player', 'assets/player.png');
    game.load.image('ball', 'assets/ball.png');
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE)
	
    ball = game.add.sprite(game.world.width/2, game.world.height/2, 'ball');
    playerOne = game.add.sprite(game.world.width/2 - 100, game.world.height/2 - 16, 'player');
    playerOneGoal = game.add.sprite(50, 100, 'ground');
    playerTwoGoal = game.add.sprite(1125, 100, 'ground');
    
    game.physics.arcade.enable(playerOne);
    game.physics.arcade.enable(playerOneGoal);
    game.physics.arcade.enable(playerTwoGoal);
    game.physics.arcade.enable(ball);
    
    playerOneGoal.body.immovable = true;
    playerTwoGoal.body.immovable = true;
    
    playerOne.body.maxVelocity = new Phaser.Point(160, 160);
    playerOne.body.drag = new Phaser.Point(300, 300);
	
	ball.body.bounce = new Phaser.Point(0.4, 0.4);
	ball.body.drag = new Phaser.Point(35, 35);
    ball.body.collideWorldBounds = true;
    ball.tint = Math.random() * 0xFFFFFF<<0;
    
    text = game.add.text(200, 200, score, {"fill":"white"});
    
}

function setGameOver(){
    text.setText(score++);
}

function update() {
	game.physics.arcade.collide(playerOne, ball);
    game.physics.arcade.collide(ball, playerOneGoal, setGameOver);
    game.physics.arcade.collide(ball, playerTwoGoal, setGameOver);
    
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
        
        console.log(angle + " :: " + velX  + " :: " + velY)
        ball.body.velocity.add(velX, velY);
    }
}