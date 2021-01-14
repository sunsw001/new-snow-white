const startScene = {
  key: 'startScene',
  preload: startPreload,
  create: startCreate,
  update: startUpdate,
};

const gameScene = {
  key: 'gameScene',
  preload: gamePreload,
  create: gameCreate,
  update: gameUpdate,
};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  banner: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 600,
      },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [startScene, gameScene],
};
const game = new Phaser.Game(config);

// set the move speed
var moveSpeed = 3;

var score = 0;

// when target score higher than 99, player will win
var goal = 99;

// maxmium Hp
var maxHp = 3;

// Health Points
var hp = maxHp;

// Loading
function loadFn() {
  const width = config.width;
  const height = config.height;
  const loadingText = this.make.text({
    x: width / 2,
    y: height / 2 - 60,
    text: 'Loading...',
    style: {
      font: '40px monospace',
      fill: '#dbb87d',
    },
  });

  const percentText = this.make.text({
    x: width / 2,
    y: height / 2,
    text: '0%',
    style: {
      font: '40px monospace',
      fill: '#dbb87d',
    },
  });

  this.load.on('progress', function (value) {
    percentText.setText(parseInt(value * 100) + '%');
  });

  this.load.on('complete', function () {
    loadingText.destroy();
    percentText.destroy();
  });
}

function startPreload() {
  this.load.image('bg01', 'assets/img/bg/bg.png');
  this.load.image('bg02', 'assets/img//bg/cloud.png');
  this.load.image('bg03', 'assets/img//bg/export.png');
  this.load.image('bg04', 'assets/img//bg/mountain.png');
  this.load.image('castle', 'assets/img//bg/castle.png');

  this.load.image('deadBg', 'assets/img/deadBg.png');
  this.load.image('winBg', 'assets/img/winBg.png');
  this.load.image('goBtn', 'assets/img/goBtn.png');

  this.load.image('floor', 'assets/img/platform.png');
  this.load.image('board', 'assets/img/board.png');

  this.load.image('apple', 'assets/img/apple.png');
  this.load.image('boom', 'assets/img/boom.png');

  this.load.audio('badApple', 'assets/audio/bad_apple.mp3');
  this.load.audio('BGM', 'assets/audio/bg_music.mp3');
  this.load.audio('redApple', 'assets/audio/gain-coin.mp3');
  this.load.audio('gameOver', 'assets/audio/game-over.wav');
  this.load.audio('winGame', 'assets/audio/win-sound.wav');

  this.load.spritesheet('player', 'assets/img/snowwhite.png', {
    frameWidth: 60,
    frameHeight: 60,
  });
  this.load.spritesheet('hp', 'assets/img/hp.png', {
    frameWidth: 34,
    frameHeight: 32,
  });

  loadFn.call(this);
}

function startCreate() {
  // background
  this.bg01 = this.add.tileSprite(0, 0, 800, 600, 'bg01').setOrigin(0, 0);
  this.bg02 = this.add.tileSprite(0, 0, 800, 600, 'bg02').setOrigin(0, 0);
  this.bg03 = this.add.tileSprite(0, 0, 800, 600, 'bg03').setOrigin(0, 0);
  this.bg04 = this.add.tileSprite(0, 0, 800, 600, 'bg04').setOrigin(0, 0);

  // add music
  this.redApple = this.sound.add('redApple');
  this.badApple = this.sound.add('badApple');
  this.bgm = this.sound.add('BGM');
  this.gameOver = this.sound.add('gameOver');
  this.winGame = this.sound.add('winGame');

  // create animation
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', {
      start: 0,
      end: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', {
      start: 5,
      end: 8,
    }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: 'hold',
    frames: [
      {
        key: 'player',
        frame: 4,
      },
    ],
    frameRate: 0,
  });
  this.anims.create({
    key: 'boom',
    frames: [
      {
        key: 'boom',
      },
    ],
    frameRate: 0,
  });

  // add floor
  this.floor = this.add.tileSprite(0, 559, 800, 600, 'floor').setOrigin(0, 0);
  this.physics.add.existing(this.floor, 'staticSprite');

  // add castle
  this.castle = this.add.sprite(config.width + 76, config.height / 2, 'castle');

  this.scoreText = this.add.text(580, 40, 'Score: ' + score);
  this.scoreText.setFontSize(32);

  // add board
  // this.startX is for board position
  this.startX = 500;
  this.boardY = 500;

  // first board
  this.board1 = this.add.sprite(this.startX, this.boardY, 'board');
  // phsics of first board
  this.physics.add.existing(this.board1, 'staticSprite');

  this.startX += 450;
  this.rndY = Phaser.Math.Between(1, 2);
  if (this.rndY == 1 && this.boardY != 400) {
    this.boardY -= 50;
  } else if (this.rndY == 1 && this.boardY == 400) {
    this.boardY += 50;
  } else if (this.rndY == 2 && this.boardY != 500) {
    this.boardY += 50;
  } else if (this.rndY == 2 && this.boardY == 500) {
    this.boardY -= 50;
  }

  // second board
  this.board2 = this.add.sprite(this.startX, this.boardY, 'board');
  this.physics.add.existing(this.board2, 'staticSprite');

  this.startX += 450;
  this.rndY = Phaser.Math.Between(1, 2);
  if (this.rndY == 1 && this.boardY != 400) {
    this.boardY -= 50;
  } else if (this.rndY == 1 && this.boardY == 400) {
    this.boardY += 50;
  } else if (this.rndY == 2 && this.boardY != 500) {
    this.boardY += 50;
  } else if (this.rndY == 2 && this.boardY == 500) {
    this.boardY -= 50;
  }

  // third board
  this.board3 = this.add.sprite(this.startX, this.boardY, 'board');
  this.physics.add.existing(this.board3, 'staticSprite');

  // add apples
  this.apples = this.add.group();
  for (let i = 0; i < 8; i++) {
    this.rndY = Phaser.Math.Between(350, 550);
    this.apple = this.physics.add.sprite(0, this.rndY, 'apple');
    this.apple.setGravityY(-600);
    this.apples.add(this.apple);
  }

  // set apples position
  this.apples.setX(950, 100);
  this.player = this.physics.add.sprite(50, 500, 'player', 4);

  // set collide
  this.player.body.setSize(29, 55, 0);
  this.player.body.setOffset(15, 2);
  // add collide
  this.physics.add.collider(this.player, this.floor);
  this.physics.add.collider(this.player, this.board1);
  this.physics.add.collider(this.player, this.board2);
  this.physics.add.collider(this.player, this.board3);

  this.physics.add.collider(this.apples, this.floor);
  this.physics.add.collider(this.apples, this.board1);
  this.physics.add.collider(this.apples, this.board2);
  this.physics.add.collider(this.apples, this.board3);
  this.physics.add.overlap(
    this.player,
    this.apples,
    (player, apple) => {
      // if apple turns into green deduct hp, if not add points
      if (this.boomChange) {
        apple.disableBody(true, true);

        hp -= 1;
        this.badApple.play();
        this.hpChange = true;
        if (hp == 0) {
          // dead
          this.deadBg.alpha = 1;
          this.goBtn.alpha = 1;

          this.dead = true;
          this.gameOver.play();
          this.bgm.pause();
        }
      } else {
        apple.disableBody(true, true);

        score += 10;
        this.scoreAdd += 10;
        this.scoreText.setText('Score: ' + score);

        this.redApple.play();
      }
    },
    null,
    this
  );

  // add keyboard
  this.keys = this.input.keyboard.addKeys('W,S,A,D');

  // keeo movement
  this.hasMove = 0;
  // add score to refresh booms
  this.scoreAdd = 0;

  // add Hp image
  this.hps = this.add.group();
  this.hpChange = true;

  // add dead images
  this.deadBg = this.add.image(400, 300, 'deadBg');
  this.deadBg.alpha = 0;
  this.winBg = this.add.image(400, 300, 'winBg');
  this.winBg.alpha = 0;
  this.goBtn = this.add.image(400, 440, 'goBtn');
  this.goBtn.setInteractive();
  this.goBtn.on('pointerdown', (pointer) => {
    // 用图片的alpha值来判断按钮有没有出现，防止误触
    if (this.goBtn.alpha == 1) {
      if (this.dead) {
        this.dead = false;

        this.deadBg.alpha = 0;
        this.goBtn.alpha = 0;
      } else if (this.win) {
        this.win = false;

        this.winBg.alpha = 0;
        this.goBtn.alpha = 0;
        // move castle
        this.castleMove = false;
        this.castle.x = config.width + 76;
      }
      this.bgm.resume();

      // clear score
      score = 0;
      this.scoreText.setText('Score: 0');
      hp = maxHp;
      this.hpChange = true;
      // 清除苹果和炸弹
      this.apples.clear(true, true);
    }
  });
  this.goBtn.alpha = 0;
  // dead
  this.dead = false;
  // win
  this.win = false;

  // play music
  this.bgm.play();
  this.bgm.setLoop(true);
  this.bgm.setVolume(0.3);
}

function startUpdate() {
  // 判断人物是否能再次跳跃
  // 因为是通过判断y轴的速度来检测是否落地，但是在跳跃的最高点y轴速度也会=0，如果连按，就会多段跳
  // 因此检测下落阶段是否出现来刷新跳跃能力
  if (this.player.body.velocity.y > 0 || this.player.y == 540) {
    this.jumpable = true;
  }

  if (this.keys.A.isDown && !this.dead && !this.win) {
    // player cant go back
    if (this.player.x > 50) {
      this.player.x -= moveSpeed;
    }
    this.player.play('left', true);
  } else if (this.keys.D.isDown && !this.dead && !this.win) {
    // when play moves to rightside, background move
    // threshold value is 400
    if (this.player.x > 400) {
      // move back
      this.floor.tilePositionX += moveSpeed;
      this.bg01.tilePositionX += moveSpeed;
      this.bg02.tilePositionX += moveSpeed;
      this.bg03.tilePositionX += moveSpeed;
      this.bg04.tilePositionX += moveSpeed;
      // this.board1.x移动的是图像，this.board1.body.x移动的是碰撞体
      this.board3.x -= moveSpeed;
      this.board2.x -= moveSpeed;
      this.board1.x -= moveSpeed;
      this.board3.body.x -= moveSpeed;
      this.board2.body.x -= moveSpeed;
      this.board1.body.x -= moveSpeed;

      this.startX -= moveSpeed;

      this.apples.incX(-moveSpeed);
      // use y axle distance to decide refresh apple or not
      this.hasMove += moveSpeed;
      if (this.hasMove > 1600) {
        this.hasMove = 0;
        this.appleRefresh = true;
      }
      // use score to decide castle
      if (this.castleMove) {
        this.castle.x -= moveSpeed;
      }
    } else {
      this.player.x += moveSpeed;
    }
    this.player.play('right', true);
  } else {
    this.player.play('hold', true);
  }
  if (
    this.keys.W.isDown &&
    this.player.body.velocity.y == 0 &&
    this.jumpable &&
    !this.dead &&
    !this.win
  ) {
    this.player.setVelocityY(-350);
    this.jumpable = false;
  }

  // refresh the position of boards
  if (this.board1.x < -this.board1.width / 2) {
    this.startX += 450;
    this.rndY = Phaser.Math.Between(1, 2);
    if (this.rndY == 1 && this.boardY != 400) {
      this.boardY -= 50;
    } else if (this.rndY == 1 && this.boardY == 400) {
      this.boardY += 50;
    } else if (this.rndY == 2 && this.boardY != 500) {
      this.boardY += 50;
    } else if (this.rndY == 2 && this.boardY == 500) {
      this.boardY -= 50;
    }
    this.board1.x = this.startX;
    this.board1.y = this.boardY;
    this.board1.body.x = this.board1.x - this.board1.width / 2;
    this.board1.body.y = this.board1.y - this.board1.height / 2;
  }
  if (this.board2.x < -this.board2.width / 2) {
    this.startX += 450;
    this.rndY = Phaser.Math.Between(1, 2);
    if (this.rndY == 1 && this.boardY != 400) {
      this.boardY -= 50;
    } else if (this.rndY == 1 && this.boardY == 400) {
      this.boardY += 50;
    } else if (this.rndY == 2 && this.boardY != 500) {
      this.boardY += 50;
    } else if (this.rndY == 2 && this.boardY == 500) {
      this.boardY -= 50;
    }
    this.board2.x = this.startX;
    this.board2.y = this.boardY;
    this.board2.body.x = this.board2.x - this.board2.width / 2;
    this.board2.body.y = this.board2.y - this.board2.height / 2;
  }
  if (this.board3.x < -this.board3.width / 2) {
    this.startX += 450;
    this.rndY = Phaser.Math.Between(1, 2);
    if (this.rndY == 1 && this.boardY != 400) {
      this.boardY -= 50;
    } else if (this.rndY == 1 && this.boardY == 400) {
      this.boardY += 50;
    } else if (this.rndY == 2 && this.boardY != 500) {
      this.boardY += 50;
    } else if (this.rndY == 2 && this.boardY == 500) {
      this.boardY -= 50;
    }
    this.board3.x = this.startX;
    this.board3.y = this.boardY;
    this.board3.body.x = this.board3.x - this.board3.width / 2;
    this.board3.body.y = this.board3.y - this.board3.height / 2;
  }

  // refresh apples
  if (this.appleRefresh) {
    this.appleRefresh = false;

    // clear apples
    this.apples.clear(true, true);
    // new apples
    for (let i = 0; i < 8; i++) {
      this.rndY = Phaser.Math.Between(350, 550);
      this.apple = this.physics.add.sprite(0, this.rndY, 'apple');
      this.apple.setGravityY(-600);
      this.apples.add(this.apple);
    }
    this.apples.setX(950, 100);

    // change boom
    this.boomChange = false;
  }

  if (this.scoreAdd > 30) {
    this.scoreAdd = 0;

    // change apples from good to bad
    this.apples.playAnimation('boom');
    this.boomChange = true;
  }

  // refresh Hp
  if (this.hpChange) {
    this.hpChange = false;
    this.hps.clear(true, true);

    for (let i = 0; i < hp; i++) {
      this.redHp = this.add.sprite(0, 50, 'hp', 0);
      this.hps.add(this.redHp);
    }
    for (let i = hp; i < maxHp; i++) {
      this.greyHp = this.add.sprite(0, 50, 'hp', 1);
      this.hps.add(this.greyHp);
    }

    this.hps.setX(50, 50);
  }

  // detect score and show castle
  if (score > goal) {
    this.castleMove = true;
  }

  // when castle moves to
  if (this.castle.x < 400 && !this.win) {
    this.win = true;

    this.winBg.alpha = 1;
    this.goBtn.alpha = 1;

    this.bgm.pause();
    this.winGame.play();
  }
}

function gamePreload() {}

function gameCreate() {}

function gameUpdate() {}
