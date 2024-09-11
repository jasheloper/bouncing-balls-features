// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

let ballCount = 0;


// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

/* we use constructor parameters to initialize properties with "this". This is common when we want each instance to have potentially different values for these properties.
However, it's also valid to set properties in a constructor without them being parameters. This is useful when you want all instances of a class to have the same initial value for a property.
In the EvilCircle case, color and size are set to specific values that are the same for all EvilCircle instances.
Think of it as defining characteristics of the EvilCircle that don't need to vary between instances.
Consider how this might be different from properties like x and y, which do need to vary for each instance. */
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });    
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkBounds() {
    /* 
    we want to instead change the value of x/y so the evil circle is bounced back onto the screen slightly. 
    Adding or subtracting (as appropriate) the evil circle's size property would make sense.
    */
    if (this.x + this.size >= width) {
      // this.velX = -Math.abs(this.velX);
      this.x = width - this.size;
    }

    if (this.x - this.size <= 0) {
      // this.velX = Math.abs(this.velX);
      this.x = 0 + this.size;
    }

    if (this.y + this.size >= height) {
      // this.velY = -Math.abs(this.velY);
      this.y = height - this.size;
    }

    if (this.y - this.size <= 0) {
      // this.velY = Math.abs(this.velY);
      this.y = 0 + this.size;
    }
  }
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCount--;
        }
      }
    }

  }
}

const balls = [];

while (balls.length < 10) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
  ballCount++;
}


const evilCircle = new EvilCircle(50, 50);

function loop() {

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  const para = document.querySelector("p");
 para.textContent = `Ball Count: ${ballCount}`;

  requestAnimationFrame(loop);
}

loop();


/* 
Create a variable that stores a reference to the paragraph.

Keep a count of the number of balls on screen in some way.

Increment the count and display the updated number of balls each time a ball is added to the scene.

Decrement the count and display the updated number of balls each time the evil circle eats a ball (causes it not to exist).
*/

