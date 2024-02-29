"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const foodArray = [];
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let bacteria = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 10,
    keyPressed: {
        ArrowUp: false,
        ArrowLeft: false,
        ArrowRight: false,
        ArrowDown: false
    }
};
const getRandomNumberInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const drawRect = (x, y, w, h, color, ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
};
function drawCircle(ctx, x, y, radius, fillColor) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.stroke();
}
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
for (let i = 0; i < 200; i++) {
    const x = getRandomNumberInRange(20, window.innerWidth - 20);
    const y = getRandomNumberInRange(20, window.innerHeight - 20);
    const velocityX = getRandomNumberInRange(-5, 5);
    const velocityY = getRandomNumberInRange(-5, 5);
    const foodObject = { x, y, velocityX, velocityY };
    foodArray.push(foodObject);
}
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const speed = 6;
    if (bacteria.keyPressed.ArrowDown)
        bacteria.y += speed;
    if (bacteria.keyPressed.ArrowUp)
        bacteria.y -= speed;
    if (bacteria.keyPressed.ArrowLeft)
        bacteria.x -= speed;
    if (bacteria.keyPressed.ArrowRight)
        bacteria.x += speed;
    drawCircle(ctx, bacteria.x, bacteria.y, bacteria.size, 'blue');
    foodArray.forEach((foodObj, index) => {
        const distance = calculateDistance(bacteria.x, bacteria.y, foodObj.x, foodObj.y);
        if (distance < bacteria.size) {
            foodArray.splice(index, 1);
            bacteria.size += 2 / 3.14;
        }
        foodObj.velocityX += getRandomNumberInRange(-0.3, 0.3);
        foodObj.velocityY += getRandomNumberInRange(-0.3, 0.3);
        foodArray.forEach((obj) => {
            const foodDistance = calculateDistance(foodObj.x, foodObj.y, obj.x, obj.y);
            if (foodDistance <= 10) {
                if (foodObj.y < obj.y) {
                    foodObj.y += -1;
                }
                else {
                    foodObj.y += 1;
                }
            }
            if (foodDistance <= 10) {
                if (foodObj.x > obj.x) {
                    foodObj.x += 1;
                }
                else {
                    foodObj.x += -1;
                }
            }
            if (foodDistance < 50) {
                foodObj.velocityY += obj.velocityY * 0.08;
                foodObj.velocityX += obj.velocityX * 0.08;
            }
        });
        if (distance < 70) {
            if (foodObj.x > bacteria.x) {
                foodObj.velocityX = 5;
            }
            else {
                foodObj.velocityX = -5;
            }
        }
        if (distance < 70) {
            if (foodObj.y > bacteria.y) {
                foodObj.velocityY = 5;
            }
            else {
                foodObj.velocityY = -5;
            }
        }
        if (foodObj.velocityX > 5) {
            foodObj.velocityX = 1;
        }
        else if (foodObj.velocityX < -5) {
            foodObj.velocityX = -1;
        }
        if (foodObj.velocityY > 5) {
            foodObj.velocityY = 1;
        }
        else if (foodObj.velocityY < -5) {
            foodObj.velocityY = -1;
        }
        if (foodObj.x <= 30) {
            foodObj.velocityX = 3;
        }
        else if (foodObj.x >= window.innerWidth - 30) {
            foodObj.velocityX = -3;
        }
        if (foodObj.y <= 30) {
            foodObj.velocityY = 3;
        }
        else if (foodObj.y >= window.innerHeight - 30) {
            foodObj.velocityY = -3;
        }
        foodObj.x += foodObj.velocityX;
        foodObj.y += foodObj.velocityY;
        drawRect(foodObj.x, foodObj.y, 7, 7, 'rgb(0,255,224)', ctx);
    });
    requestAnimationFrame(gameLoop);
};
gameLoop();
window.addEventListener('keydown', (e) => {
    arrowKeys.forEach((button) => {
        if (button === e.key) {
            bacteria.keyPressed[button] = true;
        }
    });
});
window.addEventListener('keyup', (e) => {
    arrowKeys.forEach((button) => {
        if (button === e.key) {
            bacteria.keyPressed[button] = false;
        }
    });
});
//# sourceMappingURL=script.js.map