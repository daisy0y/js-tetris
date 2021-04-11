import BLOCKS from './blocks.js'
const ROWS = 20;
const COLS = 10;
let scroe = 0;
let duration = 500;
let downInterval,tempMovingItem;

const movingItem = {
    type:'tree',
    direction: 0,
    top: 0,
    left: 0,
}
const gameBoard = document.querySelector(".game-board > ul");

const makeList = () => {
    for(let i = 0; i < ROWS; i++){
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        for(let j = 0; j <COLS; j++){
            const matrix = document.createElement('li');
            ul.append(matrix);
        }
        li.append(ul);
        gameBoard.append(li);
    }
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
            tempMovingItem = { ...movingItem },
            setTimeout(()=>{
                renderBlocks()
                moveType === 'top' && seizeBlock();
            },0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
const seizeBlock = () => {
    const  movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove('moving');
        moving.classList.add('seized');
    })
    generateNewBlock()
}
const generateNewBlock = () => {
    const array = Object.entries(BLOCKS)
    const random = Math.floor(Math.random() * array.length);
    console.log(array, random , array[random][0])
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
        default:
            break;
    }
})


const init = () => {
    tempMovingItem = {...movingItem}
    makeList();
    renderBlocks();
}
init();