const board = document.querySelector('canvas');
const size = 25, rows = 30, cols = 20;
board.width = size * rows;
board.height = size * cols;
let intervalId = null;

const c = board.getContext('2d');

const snake = {
    body: [{
        x: Math.floor(rows/2) * size,
        y: Math.floor(cols/2) * size
    }],
    direction: {dx: 1, dy: 0},
    length: 1
};

const food = {
    x: null,
    y: null,
    placeFood: function() {
        this.x = Math.floor(1 + Math.random() * (rows - 2)) * size;
        this.y = Math.floor(1 + Math.random() * (cols - 2)) * size;
        
    }
};

function draw() {
    // Очистка поля
    c.clearRect(0, 0, board.width, board.height);

    //Рисуем еду
    c.fillStyle = 'red';
    c.fillRect(food.x, food.y, size, size);
    // Рисуем змейку
    c.fillStyle = 'orange';
    for(let i = 0; i < snake.body.length; i++) {
        const segment = snake.body[i];
        c.fillRect(segment.x, segment.y, size, size);
    }

    // Двигаем змейку
    const newHead = {
        x: snake.body[0].x + (snake.direction.dx * size),
        y: snake.body[0].y + (snake.direction.dy * size)
    };

    // Проверка на столкновение новой головы
    if(collision(newHead, snake.body)) {
        clearInterval(intervalId);
        gameOver();
        return;
    } 

    //Добавляем новую голову в начало массива
    snake.body.unshift(newHead);

         // Проверка на съедение еды
         if(snake.body[0].x == food.x && snake.body[0].y == food.y) {
            snake.length++;
            food.placeFood();
         } else {
            snake.body.pop();
         }
}

function collision(head, tail) {
    // Змея врезается в границы фрейма
    if  (head.x < 0 || head.y < 0 ||
         head.y + size > board.height ||
         head.x + size > board.width) {
            return true;
         }

         // Змея сталкивается со своим хвостом
         for(let i = 0; i < tail.length; i++) {
            if(head.x == tail[i].x && head.y == tail[i].y) {
                return true;
        }
    }

    // Столкновение не произошло
    return false;
}

function gameOver() {
    console.log('Score:', snake.length)
}

food.placeFood();
intervalId = setInterval(draw, 100);

document.addEventListener('keydown', function(e){
const dir = snake.direction;
if ((e.key == 'ArrowUp' || e.key == 'w') && dir.dy != 1) {
    dir.dx = 0;
    dir.dy = -1;
} else if ((e.key == 'ArrowDown' || e.key == 's') && dir.dy != -1){
    dir.dx = 0;
    dir.dy = 1;
} else if ((e.key == 'ArrowLeft' || e.key == 'a') && dir.dx != 1){
    dir.dx = -1;
    dir.dy = 0;
} else if ((e.key == 'ArrowRight' || e.key == 'd') && dir.dx != -1){
    dir.dx = 1;
    dir.dy = 0;
}
});