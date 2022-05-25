const gameCanvas = document.getElementById("game-canvas");
const gameContent = gameCanvas.getContext("2d");
const scoreCard = document.getElementById("score");
gameContent.strokeRect(0, 0, 300, 300);

let dx = 10;
let dy = 0;
let foodX, foodY;
let score = 0;

let snake = [  
    {x: 150, y: 150},  
    {x: 140, y: 150},  
    {x: 130, y: 150},  
    {x: 120, y: 150},  
    {x: 110, y: 150},
];

drawSnakePart = (snakePart) => {
    gameContent.fillStyle = "#02bef7";
    gameContent.strokeStyle = "#022630";
    gameContent.fillRect(snakePart.x, snakePart.y, 10, 10);  
    gameContent.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

drawSnake = () => {
    snake.forEach((snakePart) => drawSnakePart(snakePart))
}


advanceSnake = (dx, dy) => {

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    if(head.x > gameCanvas.width - 10){ head.x = 0}
    if(head.x < 0){ head.x = gameCanvas.width - 10}
    if(head.y > gameCanvas.height - 10){ head.y = 0}
    if(head.y < 0){ head.y = gameCanvas.height - 10}


    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;  
    if (didEatFood) {    
        createFood();
        score += 10;  
        scoreCard.textContent = score;
    } else {    
        snake.pop();  
    }
}

clearCanvas = () => {
    gameContent.fillStyle="white";
    gameContent.strokeStyle="black";
    gameContent.fillRect(0, 0, gameCanvas.width, gameCanvas.height);  
    gameContent.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

changeDirection = (event) => {
    const LEFT_KEY = 37;  
    const RIGHT_KEY = 39;  
    const UP_KEY = 38;  
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;  
    const goingDown = dy === 10;  
    const goingRight = dx === 10;  
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {    
        dx = -10;    dy = 0;  
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {    
        dx = 10;    dy = 0;  
    }
    if (keyPressed === UP_KEY && !goingDown) {    
        dx = 0;    dy = -10;  
    }
    if (keyPressed === DOWN_KEY && !goingUp) {    
        dx = 0;    dy = 10;  
    }
}

didGameEnd = () => {
    for(let i = 4; i < snake.length; ++i){
        if((snake[i].x === snake[0].x) && (snake[i].y === snake[0].y)){
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;  
    const hitRightWall = snake[0].x > gameCanvas.width - 10;  
    const hitTopWall = snake[0].y < 0;  
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitBottomWall || hitLeftWall || hitRightWall || hitTopWall;
}

randomTen = (min, max) => {  
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

createFood = () => {  
    foodX = randomTen(0, gameCanvas.width - 10);  
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(isFoodOnSnake = (part) => {    
        const foodIsOnSnake = part.x == foodX && part.y == foodY    
        if (foodIsOnSnake){     
            createFood(); 
        } 
    });
}


main = () => {  
    setInterval(() => { 
        if(didGameEnd())  return; 
        clearCanvas(); 
        drawFood();
        advanceSnake(dx, dy);    
        drawSnake(); 
    }, 100)
}

createFood();
main();

document.addEventListener("keydown", (e) => {
    changeDirection(e);
})

drawFood = () => { 
    gameContent.fillStyle = 'red'; 
    gameContent.strokestyle = 'darkred'; 
    gameContent.fillRect(foodX, foodY, 10, 10); 
    gameContent.strokeRect(foodX, foodY, 10, 10);
}





