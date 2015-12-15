var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

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
var contactMaterial;

//Misc
var timer;
var stateManager;
var text;

function preload() {
	game.load.image('ground', 'assets/platform.png');
	game.load.image('player', 'assets/player.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('side_line_tb', 'assets/sideLineTB.png');
    game.load.image('side_line_lr', 'assets/sideLineLR.png');
}

function create() {
	game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.stage.backgroundColor = '#009933';
    
    stateManager = new Phaser.StateManager(this.game);
    timer = game.time.create(false);
    
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var goalCollisionGroup = game.physics.p2.createCollisionGroup();
    var ballCollisionGroup = game.physics.p2.createCollisionGroup();
    var sideLineCollisionGroup = game.physics.p2.createCollisionGroup();
    
    var ballMaterial = game.physics.p2.createMaterial('ballMaterial');
    var fieldMaterial = game.physics.p2.createMaterial('fieldMaterial');
    
    game.physics.p2.updateBoundsCollisionGroup();
    
    createStaticObject(game.width / 2, 50, 'side_line_tb', sideLineCollisionGroup, ballCollisionGroup, fieldMaterial);
    createStaticObject(game.width / 2, game.height - 50, 'side_line_tb', sideLineCollisionGroup, ballCollisionGroup, fieldMaterial);
    createStaticObject(50, game.height / 2, 'side_line_lr', sideLineCollisionGroup, ballCollisionGroup, fieldMaterial);
    createStaticObject(game.width - 50, game.height / 2, 'side_line_lr', sideLineCollisionGroup, ballCollisionGroup, fieldMaterial);
    
    playerOneGoal = createStaticObject(150, game.height / 2, 'ground', goalCollisionGroup, ballCollisionGroup);
    playerTwoGoal = createStaticObject(game.width - 150, game.height / 2, 'ground', goalCollisionGroup, ballCollisionGroup);

    playerOne = createPlayer(playerOneGoal.x + 100, game.height / 2, 'player', playerCollisionGroup, [ballCollisionGroup, playerCollisionGroup]);
    playerTwo = createPlayer(playerTwoGoal.x - 100, game.height / 2, 'player', playerCollisionGroup, [ballCollisionGroup, playerCollisionGroup]);
    ball = createObject(game.width / 2, game.height / 2, 'ball', ballCollisionGroup, [goalCollisionGroup, playerCollisionGroup, sideLineCollisionGroup], ballMaterial);
   

    
    ball.body.createGroupCallback(goalCollisionGroup, PlayerScores, this) 
	ball.body.damping = 0.4;
   
    ball.body.fixedRotation = true;
    var contactMaterial = game.physics.p2.createContactMaterial(ballMaterial, fieldMaterial);
    contactMaterial.restitution = 0.4;

    
    text = game.add.text(game.width / 2, 100, playerOneScore + " - " + playerTwoScore, {"fill":"white"});
    bigText = game.add.text(game.width / 2, game.height / 2, "", {"fill":"white", "fontSize": 64});
    
    text.anchor.set(0.5, 0.5);
    bigText.anchor.set(0.5, 0.5);
    
}

function update() {
	var cursors = game.input.keyboard.createCursorKeys();
    
    //playertwo
     if (game.input.keyboard.isDown(Phaser.KeyCode.A) && playerOne.body.velocity.x > -MAX_PLAYER_VELOCITY){
        playerOne.body.velocity.x -= PLAYER_SPEED_CHANGE;
    } if (game.input.keyboard.isDown(Phaser.KeyCode.D) && playerOne.body.velocity.x < MAX_PLAYER_VELOCITY){
        playerOne.body.velocity.x += PLAYER_SPEED_CHANGE;
	}
    
    if (game.input.keyboard.isDown(Phaser.KeyCode.W) && playerOne.body.velocity.y > -MAX_PLAYER_VELOCITY){
        playerOne.body.velocity.y -= PLAYER_SPEED_CHANGE;
    }else if(game.input.keyboard.isDown(Phaser.KeyCode.S) && playerOne.body.velocity.y < MAX_PLAYER_VELOCITY){
		playerOne.body.velocity.y += PLAYER_SPEED_CHANGE;
	}
    //playerone
    if (cursors.left.isDown && playerTwo.body.velocity.x > -MAX_PLAYER_VELOCITY){
        playerTwo.body.velocity.x -= PLAYER_SPEED_CHANGE;
    } else if (cursors.right.isDown && playerTwo.body.velocity.x < MAX_PLAYER_VELOCITY){
        playerTwo.body.velocity.x += PLAYER_SPEED_CHANGE;
	}
    
    if (cursors.up.isDown && playerTwo.body.velocity.y > -MAX_PLAYER_VELOCITY){
        playerTwo.body.velocity.y -= PLAYER_SPEED_CHANGE;
    }else if(cursors.down.isDown && playerTwo.body.velocity.y < MAX_PLAYER_VELOCITY){
		playerTwo.body.velocity.y += PLAYER_SPEED_CHANGE;
	}
    
    
    if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) && game.math.distance(playerOne.x, playerOne.y, ball.x, ball.y) < 46){
        var angle = game.math.angleBetween(playerOne.x, playerOne.y, ball.x, ball.y);
        var velX = -Math.cos(angle) * BALL_SPEED_CHANGE;
        var velY = -Math.sin(angle) * BALL_SPEED_CHANGE;
        
        ball.body.applyImpulseLocal([velX, velY], 0 ,0);
    }
    
    if(game.input.keyboard.isDown(Phaser.KeyCode.SHIFT) && game.math.distance(playerTwo.x, playerTwo.y, ball.x, ball.y) < 46){
        var angle = game.math.angleBetween(playerTwo.x, playerTwo.y, ball.x, ball.y);
        var velX = -Math.cos(angle) * BALL_SPEED_CHANGE;
        var velY = -Math.sin(angle) * BALL_SPEED_CHANGE;
        
        ball.body.applyImpulseLocal([velX, velY], 0 ,0);
    }
}
    
function PlayerScores(ball, goal, t, v){
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

function createStaticObject(x, y, sprite, collisionGroup, collides, material){
    var obj = createObject(x, y, sprite, collisionGroup, collides, material)
    obj.body.static = true;
    
    return obj;
}

function createObject(x, y, sprite, collisionGroup, collides, material){
    var obj = game.add.sprite(x, y, sprite);
    game.physics.p2.enable(obj);
    obj.body.setCollisionGroup(collisionGroup);
    obj.body.collides(collides);
    if(material != null)
        obj.body.setMaterial(material);
    
    return obj;
}

function createPlayer(x, y, sprite, collisionGroup, collides){
    var player = createObject(x, y, sprite, collisionGroup, collides);
    player.body.damping = 0.4;
    player.body.fixedRotation = true;
    player.tint = Math.random() * 0xFFFFFF<<0;
    
    return player;
}