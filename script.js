function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

const grid = document.getElementById("grid");
const mazeBtn = document.getElementById("mazeBtn");

const visitedCountText = document.getElementById("visitedCount");
const pathLengthText = document.getElementById("pathLength");
const statusText = document.getElementById("status");
const algoNameText = document.getElementById("algoName");

let visitedCount = 0;
let pathLength = 0;


const cells = [];

let startCell = null;
let endCell = null;

let startSet = false;
let endSet = false;

for(let i = 0; i < 20; i++){

    cells[i] = [];

    for(let j = 0; j < 20; j++){

        const cell = document.createElement("div");
        cell.classList.add("cell");

        cells[i][j] = cell;

        cell.dataset.row = i;
        cell.dataset.col = j;

        cell.addEventListener("click", () => {

            if(!startSet){
                cell.classList.add("start");
                startSet = true;
                startCell = {row:i,col:j};
            }
            else if(!endSet && !cell.classList.contains("start")){
                cell.classList.add("end");
                endSet = true;
                endCell = {row:i,col:j};
            }
            else if(!cell.classList.contains("start") && !cell.classList.contains("end")){
                cell.classList.toggle("wall");
            }
        });

        grid.appendChild(cell);
    }
}

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {

    for(let i=0;i<20;i++){
        for(let j=0;j<20;j++){

            cells[i][j].classList.remove(
                "start",
                "end",
                "wall",
                "visited",
                "path"
            );
        }
    }

    startCell = null;
    endCell = null;

    startSet = false;
    endSet = false;

    visitedCount = 0;
    pathLength = 0;

    statusText.textContent = "Ready";
    visitedCountText.textContent = "0";
    pathLengthText.textContent = "0";
});

async function bfs() {

    let queue = [];
    let visited = Array(20).fill().map(() => Array(20).fill(false));

    let parent = Array(20).fill().map(() => Array(20).fill(null));

    let visitedCount = 0;

    queue.push([startCell.row, startCell.col]);
    visited[startCell.row][startCell.col] = true;

    let directions = [[-1,0],[1,0],[0,-1],[0,1]];

    while(queue.length > 0){

        let [row,col] = queue.shift();

        if(!cells[row][col].classList.contains("start") && !cells[row][col].classList.contains("end")){
            cells[row][col].classList.add("visited");
            visitedCount++;
            visitedCountText.textContent = visitedCount;
            await sleep(30);
        }    

        if(row === endCell.row && col === endCell.col){

            let pathLength = 0;
            let current = [row,col];
            while(current){
                let [r,c] = current;

                pathLength++;
                pathLengthText.textContent = pathLength;

                if(!cells[r][c].classList.contains("start") && !cells[r][c].classList.contains("end")){
                    cells[r][c].classList.add("path");
                    await sleep(50);
                }
                current = parent[r][c];
            }
            statusText.textContent = "Path Found";
            return;
        }

        for(let [dr,dc] of directions){

            let nr = row + dr;
            let nc = col + dc;

            if(nr >= 0 && nr < 20 && nc >= 0 && nc < 20 && !visited[nr][nc] && !cells[nr][nc].classList.contains("wall")){
                visited[nr][nc] = true;
                parent[nr][nc] = [row,col];
                queue.push([nr,nc]);
            }
        }
    }
    statusText.textContent = "No Path";
}

async function dfs(row, col, visited, parent){

    if(
        row < 0 || row >= 20 ||
        col < 0 || col >= 20 ||
        visited[row][col] ||
        cells[row][col].classList.contains("wall")
    ){
        return false;
    }

    visited[row][col] = true;

    visitedCount++;
    visitedCountText.textContent = visitedCount;

    if(
        !cells[row][col].classList.contains("start") &&
        !cells[row][col].classList.contains("end")
    ){
        cells[row][col].classList.add("visited");
        await sleep(30);
    }

    if(row === endCell.row && col === endCell.col){
        return true;
    }

    let directions = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];

    for(let [dr,dc] of directions){

        let nr = row + dr;
        let nc = col + dc;

        if(
            nr >= 0 &&
            nr < 20 &&
            nc >= 0 &&
            nc < 20 &&
            !visited[nr][nc] &&
            !cells[nr][nc].classList.contains("wall")
        ){

            parent[nr][nc] = [row,col];

            let found = await dfs(
                nr,
                nc,
                visited,
                parent
            );

            if(found) return true;
        }
    }

    return false;
}

async function runDFS(){

    statusText.textContent = "Running";

    visitedCount = 0;
    pathLength = 0;

    visitedCountText.textContent = "0";
    pathLengthText.textContent = "0";

    let visited = Array(20)
        .fill()
        .map(() => Array(20).fill(false));

    let parent = Array(20)
        .fill()
        .map(() => Array(20).fill(null));

    let found = await dfs(
        startCell.row,
        startCell.col,
        visited,
        parent
    );

    if(found){

        let current = [
            endCell.row,
            endCell.col
        ];

        while(current){

            let [r,c] = current;

            if(
                !cells[r][c].classList.contains("start") &&
                !cells[r][c].classList.contains("end")
            ){
                cells[r][c].classList.add("path");

                pathLength++;
                pathLengthText.textContent = pathLength;

                await sleep(50);
            }

            current = parent[r][c];
        }

        statusText.textContent = "Path Found";
    }
    else{
        statusText.textContent = "No Path";
    }
}

const runBtn = document.getElementById("runBtn");

const algoSelect = document.getElementById("algo");

algoSelect.addEventListener("change", () => {

    algoNameText.textContent =
        algo.value.toUpperCase();

});

function generateMaze(){

    for(let i = 0; i < 20; i++){

        for(let j = 0; j < 20; j++){

            let cell = cells[i][j];

            if(
                cell.classList.contains("start") ||
                cell.classList.contains("end")
            ){
                continue;
            }

            cell.classList.remove(
                "wall",
                "visited",
                "path"
            );

            if(Math.random() < 0.3){
                cell.classList.add("wall");
            }
        }
    }
}

algoSelect.addEventListener("change", () => {

    if(algoSelect.value === "bfs"){
        runBtn.textContent = "Run BFS";
    }
    else if(algoSelect.value === "dfs"){
        runBtn.textContent = "Run DFS";
    }
});

runBtn.addEventListener("click", async() => {

    if(!startCell || !endCell){
        alert("Select Start and End Node First!");
        return;
    }
    
    statusText.textContent = "Running...";

    if(algoSelect.value === "bfs"){
        await bfs();
    }
    else{
        await runDFS();
    }
});

mazeBtn.addEventListener("click", () => {
    generateMaze();
});
