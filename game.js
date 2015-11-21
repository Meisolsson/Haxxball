var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var PLAYER_SPEED_CHANGE = 15;
var BALL_SPEED_CHANGE = 16.5;

//Players
var playerOne;
var PlayerTwo;

//Static objects
var playerOneGoal;
var playerTwoGoal;
var ball;

//Game data
var playerOneScore = 0;
var playerTwoScore = 0;
var text;
var bigText;
var resetting

//
var timer;
var stateManager;

var text;

function preload() {
	game.load.image('ground', 'assets/platform.png');
	game.load.image('player', 'assets/player.png');
    game.load.image('ball', 'assets/ball.png');
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE)
	
    stateManager = new Phaser.StateManager(this.game);
    timer = game.time.create(false);
    
    
    text = game.add.text(game.width / 2, 100, playerOneScore + " - " + playerTwoScore, {"fill":"white"});
    bigText = game.add.text(game.width / 2, game.height / 2, "", {"fill":"white", "fontSize": 64});
    ball = game.add.sprite(128, game.world.height - 150, 'ball');
    playerOne = game.add.sprite(1, game.world.height - 150, 'player');
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

    ball.body.maxVelocity = new Phaser.Point(200, 200);
	ball.body.bounce = new Phaser.Point(0.4, 0.4);
	ball.body.drag = new Phaser.Point(35, 35);
    ball.body.collideWorldBounds = true;
    ball.tint = Math.random() * 0xFFFFFF<<0;
    
    text.anchor.set(0.5, 0.5);
    bigText.anchor.set(0.5, 0.5);
}

function update() {
    if(resetting)
        return;
    
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
        
        ball.body.velocity.add(velX, velY);
    }
}
    
function setGameOver(ball, goal){
    if(goal == playerOneGoal){
        playerTwoScore++;
        bigText.setText("Player two scored");
    }else{ 
        playerOneScore++;
        bigText.setText("Player one scored");
    }
    text.setText(playerOneScore + " - " + playerTwoScore);
    resetting = true;
    
    timer.add(3000, resetField, this);
    timer.start();
    
}

function resetField(){
    bigText.setText("");
    var ballCenterX = (game.width / 2) - (ball.width / 2);
    var ballCenterY = (game.height / 2) - (ball.height / 2);
    ball.position.set(ballCenterX, ballCenterY);
    
    var playerCenterY = (game.height / 2) - (playerOne.height / 2);
    playerOne.position.set(playerOneGoal.x + 100, playerCenterY);
    resetting = false;
}