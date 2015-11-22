var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var PLAYER_SPEED_CHANGE = 15;
var BALL_SPEED_CHANGE = 2;
var MAX_PLAYER_VELOCITY = 100;

//Players
var playerOne;
var playerTwo;

//Static objects
var playerOneGoal;
var playerTwoGoal;
var ball;

//Game data
var playerOneScore = 0;
var playerTwoScore = 0;
var text;
var bigText;
var resetting;

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
	game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.stage.backgroundColor = '#009933';
    
    stateManager = new Phaser.StateManager(this.game);
    timer = game.time.create(false);
    
    text = game.add.text(game.width / 2, 100, playerOneScore + " - " + playerTwoScore, {"fill":"white"});
    bigText = game.add.text(game.width / 2, game.height / 2, "", {"fill":"white", "fontSize": 64});
    
    text.anchor.set(0.5, 0.5);
    bigText.anchor.set(0.5, 0.5);
    
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var goalCollisionGroup = game.physics.p2.createCollisionGroup();
    var ballCollisionGroup = game.physics.p2.createCollisionGroup();
    
    playerOneGoal = game.add.sprite(50, game.height / 2, 'ground');
    playerTwoGoal = game.add.sprite(1125, game.height / 2, 'ground');
    playerOne = game.add.sprite(playerOneGoal.x + 100, game.height / 2, 'player');
    playerTwo = game.add.sprite(playerTwoGoal.x - 100, game.height / 2, 'player');
    ball = game.add.sprite(game.width / 2,game.height / 2, 'ball');
    
    game.physics.p2.enable(ball);
    game.physics.p2.enable(playerOne);
    game.physics.p2.enable(playerTwo);
    game.physics.p2.enable(playerOneGoal);
    game.physics.p2.enable(playerTwoGoal);
    
    game.physics.p2.updateBoundsCollisionGroup();
    
    playerOneGoal.body.setCollisionGroup(goalCollisionGroup);
    playerTwoGoal.body.setCollisionGroup(goalCollisionGroup);  
    playerOneGoal.body.collides(ballCollisionGroup);
    playerTwoGoal.body.collides(ballCollisionGroup);
    playerOneGoal.body.static = true;
    playerTwoGoal.body.static = true;
    
    playerOne.body.setCollisionGroup(playerCollisionGroup);
    playerTwo.body.setCollisionGroup(playerCollisionGroup);
    playerOne.body.collides([ballCollisionGroup, playerCollisionGroup]);
    playerTwo.body.collides([ballCollisionGroup, playerCollisionGroup]);
    
    ball.body.setCollisionGroup(ballCollisionGroup);
    ball.body.collides([goalCollisionGroup, playerCollisionGroup]);
    ball.body.createGroupCallback(goalCollisionGroup, setGameOver, this)
   
    playerOne.body.damping = 0.4;
    playerOne.body.fixedRotation = true;
    
    playerTwo.body.damping = 0.4;
    playerTwo.body.fixedRotation = true;
    
	ball.body.damping = 0.4;
    ball.tint = Math.random() * 0xFFFFFF<<0;
    ball.body.fixedRotation = true;
    
}

function update() {
	var cursors = game.input.keyboard.createCursorKeys();
    
    if (cursors.left.isDown && playerOne.body.velocity.x > -MAX_PLAYER_VELOCITY){
        playerOne.body.velocity.x -= PLAYER_SPEED_CHANGE;
    } else if (cursors.right.isDown && playerOne.body.velocity.x < MAX_PLAYER_VELOCITY){
        playerOne.body.velocity.x += PLAYER_SPEED_CHANGE;
	}
    
    if (cursors.up.isDown && playerOne.body.velocity.y > -MAX_PLAYER_VELOCITY){
        playerOne.body.velocity.y -= PLAYER_SPEED_CHANGE;
    }else if(cursors.down.isDown && playerOne.body.velocity.y < MAX_PLAYER_VELOCITY){
		playerOne.body.velocity.y += PLAYER_SPEED_CHANGE;
	}
    
    if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) && game.math.distance(playerOne.x, playerOne.y, ball.x, ball.y) < 46){
        var angle = game.math.angleBetween(playerOne.x, playerOne.y, ball.x, ball.y);
        var velX = -Math.cos(angle) * BALL_SPEED_CHANGE;
        var velY = -Math.sin(angle) * BALL_SPEED_CHANGE;
        
        ball.body.applyImpulseLocal([velX, velY], 0 ,0);
    }
}
    
function setGameOver(ball, goal, t, v){
    if(resetting)
        return;
    
    if(goal.id == playerOneGoal.body.id){
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
    
    ball.body.reset(game.width / 2, game.height / 2);
    playerOne.body.reset(playerOneGoal.x + 100,  game.height / 2);
    playerTwo.body.reset(playerTwoGoal.x - 100,  game.height / 2);
    
    resetting = false;
}