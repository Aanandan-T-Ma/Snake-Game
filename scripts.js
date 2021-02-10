var snakePositions, direction, occupied, foodPosition, maxscore, score, snakeMoveId
const maxX = 40, maxY = 60

keyMoves = (event) => {
    if(event.key === ' ' || event.key === 'Enter')
        event.preventDefault()
    else if(event.key === 'ArrowUp'){
        if(direction !== 'D')
            direction = 'U'
    }
    else if(event.key === 'ArrowDown'){
        if(direction !== 'U')
            direction = 'D'
    }
    else if(event.key === 'ArrowLeft'){
        if(direction !== 'R')
            direction = 'L'
    }
    else if(event.key === 'ArrowRight'){
        if(direction !== 'L')
            direction = 'R'
    }
}

startGame = () => {
    document.querySelector('.startup').style.transform = 'scale(0)'

    occupied = new Array(maxX)
    maxscore = Number(localStorage.getItem('highscore')) || 0
    score = 0

    window.addEventListener('keydown', keyMoves)
    
    drawGrid()
    drawSnake()
    placeFood()
    updateScore()
    snakeMoveId = setInterval(moveSnake, 100)
}

gameOver = () => {
    document.querySelector('.content').innerHTML = 'Game Over!'
    document.getElementById('points').innerHTML = 'Your Score: ' + score + '<br>High Score: ' + maxscore
    document.getElementById('play-btn').innerHTML = 'Play Again'
    document.querySelector('.startup').style.transform = 'scale(1)'
    document.querySelector('.game-container').innerHTML = ''

    window.removeEventListener('keydown', keyMoves)
    clearInterval(snakeMoveId)
}

function drawGrid(){
    const container = document.querySelector('.game-container')
    for(let i=1;i<=maxX;i++){
        occupied[i-1] = new Array(maxY)
        for(let j=1;j<=maxY;j++){
            let div = document.createElement('div')
            div.id = 'cell-' + i + '-' + j
            div.classList.add('cell')
            container.appendChild(div)
            occupied[i-1][j-1] = false
        }
    }
}

function drawSnake(){
    snakePositions = []
    let randX = Math.floor(Math.random() * maxX) + 1
    let randY = Math.floor(Math.random() * maxY) + 1
    if(randX <= maxX/2){
        if(randY <= maxY/2){ 
            direction = 'R'
            for(let i=0;i<3;i++)
              snakePositions.push({ x: randX, y: randY+i })
        }
        else{ 
            direction = 'D'
            for(let i=0;i<3;i++)
              snakePositions.push({ x: randX+i, y: randY })
        }
    }
    else{
        if(randY <= maxY/2){ 
            direction = 'U'
            for(let i=0;i<3;i++)
              snakePositions.push({ x: randX-i, y: randY })
        }
        else{ 
            direction = 'L'
            for(let i=0;i<3;i++)
              snakePositions.push({ x: randX, y: randY-i })
        }
    }
    snakePositions.forEach((pos) => {
        document.querySelector('#cell-'+pos.x+'-'+pos.y).classList.add('active')
        occupied[pos.x-1][pos.y-1] = true
    })
}

function moveSnake(){
    let pos = snakePositions[snakePositions.length-1]
    let x = pos.x
    let y = pos.y
    if(direction === 'R')
        y = (y == maxY? 1 : y + 1)
    else if(direction === 'L')
        y = (y == 1? maxY : y - 1)
    else if(direction === 'D')
        x = (x == maxX? 1 : x + 1)
    else if(direction === 'U')
        x = (x == 1? maxX : x - 1)
    document.querySelector('#cell-'+x+'-'+y).classList.add('active')
    snakePositions.push({x,y})
    if(occupied[x-1][y-1]){
        gameOver()
    }
    else if(foodPosition.x === x && foodPosition.y === y){
        document.querySelector('#cell-'+foodPosition.x+'-'+foodPosition.y).classList.remove('food')
        placeFood()
        score++
        updateScore()
    }
    else{
        pos = snakePositions.shift()
        document.querySelector('#cell-'+pos.x+'-'+pos.y).classList.remove('active')
        occupied[pos.x-1][pos.y-1] = false
    }
    occupied[x-1][y-1] = true
}

function placeFood(){
    foodPosition = getFoodPosition()
    document.querySelector('#cell-'+foodPosition.x+'-'+foodPosition.y).classList.add('food')
}

function getFoodPosition(){
    let i = snakePositions[0].x-1, j = snakePositions[0].y-1
    while(occupied[i][j]){
        i = Math.floor(Math.random() * occupied.length)
        j = Math.floor(Math.random() * occupied[i].length)
    }
    return { x: i+1, y: j+1 }
}

function updateScore(){
    document.querySelector('.score').children[1].innerHTML = score
    if(score>maxscore){
        maxscore = score
        localStorage.setItem('highscore', maxscore)
    }
    document.querySelector('.max-score').children[1].innerHTML = maxscore
}