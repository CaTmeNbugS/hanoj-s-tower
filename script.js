const frame  = document.querySelector('.frame')
const width  = 240
const height = 240
const point  = 10
const range  = 100
const step   = width / (range/point)
const fixScale  = step/point
const lineWidth = 1
const axisWidth = 3
const colors = ['brown', 'darkgreen', 'midnightblue','mediumvioletred','darkgoldenrod', 'darkmagenta', 'rebeccapurple', 'tomato', 'tan','steelblue']

let target = []
let stack  = []
let queue  = [[],[],[]]
let lastTransfer = 0
let queueHistory = []
let complete     = false
let i = 1

const n     = prompt()
const turns = Math.pow(2, n) - 1

makeQueue(n)
makeStack()

while(!complete){
    stackTransfer()
    makeCanvas(i, queue)
    if(i == turns){
        complete = true
    }
    i++
}

console.log("Turns:", i - 1)
console.log("Queue:", queue)
console.log("QueueHistory:", queueHistory) 

for(let g = 1; g <= queueHistory.length; g++){
    renderTower(g)
}

function makeQueue(n){
    for(let i = 1; i <= n; i++){
        queue[0].push(i)
        target.push(i)
    }
}

function makeStack(){
    stack = [queue[0][0], queue[1][0], queue[2][0]]
    return stack
}

function round(i){
    if(i > 2){ return i - 3 }
    else if(i < 0){ return i + 3 }
    return i
}

function stackTransfer(){
    que: for(let i =  0; i <= 2; i++){
             for(let j = -1; j <= 1; j+=2){
                 let j_ = round(i+j)
                 if((stack[i] < stack[j_] || (stack[j_] == undefined && stack[i] != undefined)) && lastTransfer != stack[i]){    
                     lastTransfer = stack[i]
                     queue[j_].unshift(stack[i])
                     queue[i].shift()
                     makeStack()
                     queueHistory.push(JSON.parse(JSON.stringify(queue)))
                     break que   
            }
        }
    }
}

function drawGrid(color, ctx){
    ctx.strokeStyle = color;
    for(let i = 0; i < (width/step) + 1;i++){
        ctx.beginPath()
        ctx.moveTo(step*i, 0)
        ctx.lineTo(step*i, width)
        ctx.stroke()
        ctx.closePath()    
    }
    for(let i = 0; i < (height/step) + 1;i++){
        ctx.beginPath()
        ctx.moveTo(0, step*i)
        ctx.lineTo(width, step*i)
        ctx.stroke()
        ctx.closePath()
        }    
}

function drawAxis(color, ctx){
    ctx.beginPath()
    ctx.fillStyle = color;
    ctx.fillRect(width / 2 - axisWidth / 2, 0, axisWidth, width);
    // ctx.fillRect(0, width/2-axisWidth/2, width, axisWidth);
    ctx.closePath()
}

function makeCanvas(i){
    frame.innerHTML += `
    <div class="canvasBox">
        <canvas class="canvas" id="canvas${i}_0"></canvas>
        <canvas class="canvas" id="canvas${i}_1"></canvas>
        <canvas class="canvas" id="canvas${i}_2"></canvas>
    </div>
    `
}

function renderTower(i){
    for(let j = 0; j <= 2; j++){

        const canvas = document.querySelector(`#canvas${i}_${j}`)
        const ctx = canvas.getContext('2d')
        
        canvas.width  = width
        canvas.height = height

        ctx.lineWidth   = lineWidth
        ctx.strokeStyle = '#2b2b2b'

        //drawGrid('#585d62', ctx)  
        //drawAxis('#585d62', ctx)

        let queue_ = queueHistory[i-1][j].reverse()

        if(queue_.length > 0){
            for(let a = 0; a < queue_.length; a++){
                renderDisk((point / -2) * queue_[a], ((range / -2) + point) + (a * point), queue_[a], colors[queue_[a]-1], ctx)
            } 
        }
    }
}

function renderDisk(xA, yA, length, color, ctx){
    ctx.fillStyle = color
    ctx.fillRect((xA * fixScale+width / 2), (yA * ((-1) * fixScale) + width / 2), step * length, step)
}