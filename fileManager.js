//file manager

let fileSystem = [
    {
        name: "something",
        data: "none"
    }
]

function create() {
    let fileName = prompt("Enter file name: ", "newCanvas");
    if(fileName !== null || fileName === "") {
        fileSystem.push({name: fileName, data: "none"});
        showFiles();
    }

}

function showFiles() {
    hideCanvas();
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    for(const file in fileSystem) {
        let div = document.createElement("div");
        div.title = fileSystem[file].name;
        div.innerHTML = "<button value=\""+file+"\" onclick=\"showCanvas(this.value)\">"+fileSystem[file].name+"</button>";
        fileList.appendChild(div);
    }
}

function showCanvas(file) {
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    drawCanvas.start(file);

}

function hideCanvas() {
    if(document.body.contains(drawCanvas.canvas)) {
        drawCanvas.canvas.removeEventListener("mousemove", draw);
        drawCanvas.canvas.removeEventListener("mousedown", mouseControls);
        window.removeEventListener("keydown", keyControls); 

        document.body.removeChild(drawCanvas.canvas);
    }
}

//drawCanvas

let canvasWidth = 500;
let canvasHeight = 500;

let pos = {x: 0, y: 0};
var startLine = true;
let mode = 0;

let drawCanvas = {
    canvas: document.createElement("canvas"),
    start: function(file) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.style.border = "5px solid black";

        document.body.appendChild(this.canvas);

        //manage file data
        this.file = file;
        if(fileSystem[file].data !== "none") {
            this.ctx.putImageData(fileSystem[file].data, 0, 0);
        }
        
        startControls();
    }
}

function drawLine(x, y, tx, ty, color, width) {

    drawCanvas.ctx.beginPath();
    drawCanvas.ctx.lineWidth = width;
    drawCanvas.ctx.strokeStyle = color;
    drawCanvas.ctx.lineCap = "round";
    
    drawCanvas.ctx.moveTo(x, y);
    drawCanvas.ctx.lineTo(tx, ty);

    drawCanvas.ctx.closePath();
    drawCanvas.ctx.stroke();
}

function draw(e) {

    if(e.buttons !== 1) return;

    switch(mode) {
        case 0:
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, "red", 5);
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            break;
        case 1:
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, "white", 5);
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            break;
        case 2:
            drawCanvas.ctx.globalAlpha = 0.15;
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, "yellow", 20);
            drawCanvas.ctx.globalAlpha = 1;
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            break;
    }
}

function mouseControls(e) {
    if(mode === 3) {
        if(startLine) {
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            startLine = false;
        } else {
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, "black", 5);
            startLine = true;
        }
    }
    pos.x = e.offsetX;
    pos.y = e.offsetY;
}

function keyControls(e) {
    switch(e.key) {
        case 'p':
            mode = 0;
            break;
        case 'e':
            mode = 1;
            break;
        case 'h':
            mode = 2;
            break;
        case 'l':
            mode = 3;
            startLine = true;
            break;
        case 's':
            save();
            break;
        case 'c':
            drawCanvas.ctx.clearRect(0, 0, canvasHeight, canvasWidth);
            break;
    }
}

function startControls() {
    drawCanvas.canvas.addEventListener("mousemove", draw);
    drawCanvas.canvas.addEventListener("mousedown", mouseControls);
    window.addEventListener("keydown", keyControls);    

}

function save() {
    let imageData = drawCanvas.ctx.getImageData(0, 0, canvasHeight, canvasWidth);
    fileSystem[drawCanvas.file].data = imageData;
}


