import BLOCKS from './blocks.js'
const ROWS = 20;
const COLS = 10;
let score = 0;
let duration = 500;
let downInterval,tempMovingItem;

const movingItem = {
    type:'',
    direction: 0,
    top: 0,
    left: 0,
}
const gameBoard = document.querySelector(".game-board > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restart = document.querySelector(".game-text > button");

const prependNewLine = () => {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        for(let j = 0; j <COLS; j++){
            const matrix = document.createElement('li');
            ul.prepend(matrix);
        }
        li.prepend(ul);
        gameBoard.prepend(li);
    
}

const renderBlocks = (moveType = '') => {
    const { type, direction , top, left } = tempMovingItem;
    const  movingBlocks = document.querySelectorAll('.moving');

    movingBlocks.forEach(moving => {
        moving.classList.remove(type,'moving');
    })

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = gameBoard.childNodes[y] ? gameBoard.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type,"moving") 
        } else  {
            tempMovingItem = { ...movingItem }
            if(moveType === 'retry'){
                clearInterval(downInterval);
                showGameOver();
            }
            setTimeout(()=>{
                renderBlocks('retry')
                moveType === 'top' && seizeBlock();
            },0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
const showGameOver = () => {
    gameText.style.display = 'flex'
}
const seizeBlock = () => {
    const  movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove('moving');
        moving.classList.add('seized');
    })
    checkMatch();
}

const checkMatch = () => {
    const childNodes = gameBoard.childNodes;
    console.log(childNodes)
    childNodes.forEach(child => {
        let isMatch = true;

        child.children[0].childNodes.forEach(li =>{
            if(!li.classList.contains('seized')){
                isMatch = false;
            }
        })

        if(isMatch) {
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML = score;
        }
    })
    generateNewBlock();
}
const generateNewBlock = () => {
    clearInterval(downInterval)
    downInterval = setInterval(()=>{
        moveBlock('top',1) ;
    },duration)
    const array = Object.entries(BLOCKS)
    const random = Math.floor(Math.random() * array.length);
    movingItem.type = array[random][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem }
    renderBlocks()
}
const checkEmpty = (target) => {
    if(!target || target.classList.contains('seized')) return false;
    return true;
}

const moveBlock = (type,amount) => {
    tempMovingItem[type] += amount;
    renderBlocks(type);
}

const dropBlock = () => {
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top',1)
    },10)
}

const changeDirection = () => {
    const direction = tempMovingItem.direction;
    direction === 3 
        ? tempMovingItem.direction = 0
        : tempMovingItem.direction += 1
    renderBlocks();
}
document.addEventListener('keydown',e =>{
    switch(e.keyCode){
        case 39:
            moveBlock('left', 1)
            break;
        case 37:
            moveBlock('left', -1)
            break;
        case 40:
            moveBlock('top', 1)
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock()
            break;
        default:
            break;
    }
})


const init = () => {
    tempMovingItem = {...movingItem}
    for(let i = 0; i < ROWS; i++){
        prependNewLine();
    }
    generateNewBlock();
}
init();

restart.addEventListener('click',()=>{
    gameBoard.innerHTML= '';
    gameText.style.display = 'none';
    init();
})