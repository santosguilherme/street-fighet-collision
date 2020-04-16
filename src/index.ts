const backgroundImage = new Image();
backgroundImage.src = './public/images/background-2.jpg';

const kenSprites = new Image();
kenSprites.src = './public/images/ken-sprite.png';

const initialSound = new Audio('./public/sounds/start.mp3');
const victoryIsMineSound = new Audio('./public/sounds/changelevel.mp3');
const fightSound = new Audio('./public/sounds/fight.mp3');
const backgroundSound = new Audio('./public/sounds/backgroundSong.mp3');
backgroundSound.loop = true;

const canvas = document.querySelector('canvas');
const canvasContext = canvas?.getContext('2d');

const canvasWidth: number = canvas?.width || 1280;
const canvasHeight: number = canvas?.height || 720;

const initialMessage = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  draw(){
    canvasContext?.fillText('Click to start', initialMessage.x, initialMessage.y);
  }
};

const background = {
  draw(){
    canvasContext?.drawImage(
      backgroundImage,
      0, 0,
      canvasWidth, canvasHeight
    );
  }
};

const ken = {
  spriteX: 0,
  spriteY: 0,
  width: 100,
  height: 100,
  x: 10,
  y: 50,
  draw(){
    canvasContext?.drawImage(
      kenSprites,
      ken.spriteX, ken.spriteY, // Sprite X, Sprite Y
      ken.width, ken.height, // Tamanho do recorte na sprite
      ken.x, ken.y,
      ken.width, ken.height,
    );
  }
};

interface Screen {
  click?(): void,
  draw(): void,
  update(): void,
  start?(): void,
}

const world = {
  activeScreen: Screen
};

function changeActiveScreen(screen: Screen) {
  world.activeScreen = screen;

  world.activeScreen.start?.();
}

const Screens = {
  INITIAL: {
    start(): void {
    },
    draw(): void {
      background.draw();
      initialMessage.draw();
      ken.draw();
    },
    update(): void {

    },
    click(): void {
      console.log('click no initial');

      // @ts-ignore
      changeActiveScreen(Screens.STAGE);
    }
  },
  STAGE: {
    start(): void {
      victoryIsMineSound.play();
      victoryIsMineSound.addEventListener('ended', () => {
        initialSound.play();
        initialSound.addEventListener('ended', () => {
          backgroundSound.play();
          fightSound.play();
        });
      });
    },
    draw(): void {
      background.draw();
    },
    update(): void {

    },
    click(): void {
      backgroundSound.pause();
      // @ts-ignore
      changeActiveScreen(Screens.INITIAL);
    }
  },
};

function gameLoop(){
  world.activeScreen.draw();
  world.activeScreen.update?.();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('click', () => {
  world.activeScreen.click?.();
});

// @ts-ignore
changeActiveScreen(Screens.INITIAL);
gameLoop();


// http://localhost:5000/old/principal2.htm
