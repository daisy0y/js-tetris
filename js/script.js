const ROWS = 20;
const COLS = 10;
let scroe = 0;
let duration = 500;
let downInterval,tempMovingItem;
const BLOCKS = {
    tree: [
        [[0,0],[0,1],[1,0],[1,1]],
        [],
        [],
        [],
    ]
}
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

const renderBlocks = () => {
    const { type, direction , top, left } = tempMovingItem;
    const  movingBlocks = document.querySelectorAll('.moving');

    movingBlocks.forEach(moving => {
        moving.classList.remove(type,'moving');
    })

    BLOCKS[type][direction].forEach(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = gameBoard.childNodes[y] ? gameBoard.childNodes[y].childNodes[0].childNodes[x] : null;
        target.classList.add(type,"moving");
    })
}

const moveBlock = (type,amount) => {
    tempMovingItem[type] += amount;
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