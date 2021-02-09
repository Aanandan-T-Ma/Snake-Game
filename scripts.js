var snakePositions = [{ x:10, y:10 }, { x:10, y:11}, { x:10, y:12}]
var direction = 'R'
const maxX = 40
const maxY = 60
var occupied = new Array(maxX)
var foodPosition
var maxscore = Number(localStorage.getItem('highscore')) || 0
var score = 0

readyFunction()

window.addEventListener('keydown', keyMoves)

function keyMoves(event){
    if(event.key === 'ArrowUp'){
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
    else if(event.code === 'Space')
        direction = 'X'
}

function readyFunction(){
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
    snakePositions.forEach((pos) => {
        document.querySelector('#cell-'+pos.x+'-'+pos.y).classList.add('active')
        occupied[pos.x-1][pos.y-1] = true
    })
    placeFood()
    updateScore()
    setInterval(moveSnake, 200)
}

function moveSnake(){
    if(direction === 'X') return
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
        window.removeEventListener('keydown', keyMoves)
        document.querySelector('.game-over').style.display = 'block'
        document.querySelector('.game-container').style.backgroundColor = 'black'
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
    return { x:i, y:j }
}

function updateScore(){
    document.querySelector('.score').children[1].innerHTML = score
    if(score>maxscore){
        maxscore = score
        localStorage.setItem('highscore', maxscore)
    }
    document.querySelector('.max-score').children[1].innerHTML = maxscore
}