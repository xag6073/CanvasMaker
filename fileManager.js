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

        let fileButton = createFileButton(file);

        div.appendChild(fileButton);
        fileList.appendChild(div);
    }
}

function createFileButton(file) {
    var button = document.createElement("button");
    button.value = file;
    button.className = "icon-button";
    button.innerHTML = fileSystem[file].name; 
    button.addEventListener("click", function() {
        showCanvas(file);
    });
    button.addEventListener("contextmenu", function(e) {
        showContextMenu(e, file);
    });
    return button;

}

function showContextMenu(e, file) {
    var cm = document.getElementById("contextMenu");
    var ren = document.getElementById("cmRename");
    var del = document.getElementById("cmDelete");

    var renameHandler = function() {
        renameFile(file);
        cm.style.display = "none";
    }

    var deleteHandler = function() {
        deleteFile(file);
        cm.style.display = "none";
    }

    e.preventDefault();
    cm.style.display = "block";
    cm.style.left = e.clientX + "px";
    cm.style.top = e.clientY + "px";

    ren.addEventListener("click", renameHandler);
    del.addEventListener("click", deleteHandler);
    window.addEventListener("click", function cmHandler(e) {
        ren.removeEventListener("click", renameHandler);
        del.removeEventListener("click", deleteHandler);
        cm.style.display = "none";
        this.window.removeEventListener("click", cmHandler);
    });
}

function renameFile(input) {
    let newName = prompt("Enter new file name: ");
    if(newName !== null || newName === "") {
        fileSystem[input].name = newName;
        showFiles();
        return;
    }
    alert("Invalid new file name.");
}


function deleteFile(input) {
    fileSystem.splice(input, 1);
    showFiles();
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


