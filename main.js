var cameraX = 0
var cameraY = 0
var cameraZ = 0

var currentPower = 0
var speed = 0
var displaySpeed = 0

c3dl.addMainCallBack(canvasMain, "canvas");
c3dl.addModel("M2.dae");

document.onkeydown = function(e) { 
    switch (e.keyCode) { 
        case 38: 
            cam.pitch(-0.05)
            break
        case 40: 
            cam.pitch(0.05)
            break
        case 39: 
            cam.yaw(-0.05)
            break
        case 37: 
            cam.yaw(0.05)
            break
        case 81:
            if (document.getElementById("power").value > 1) {
                document.getElementById("power").value --
                powerChange()
            }
            break
        case 90:
            if (document.getElementById("power").value < 13) {
                document.getElementById("power").value ++
                powerChange()
            }
            break
        case 49:
            document.getElementById("power").value = 1
            powerChange()
            break
    }
}

function help() {
    alert("Move power handle backwards: Q\nMove power handle forwards: Z\n\nYou can click the power notches to move the handle as well.\n\nUse arrow keys to look around.\n\nDo not exceed 80 km/h.")
}

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

function start() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    if (currentPower > 0) {
        speed = speed + scale(currentPower, 0, 3, 0, 1) / 1000
    } else if (currentPower < 0) {
        if (speed > 0) {
            speed = speed - scale(currentPower, 0, -8, 0, 1) / 350
        }
    }

    if (speed < 0) {
        speed = 0
    }

    displaySpeed = Math.floor(speed * 50)

    cam.setLinearVel(new Array(speed, 0, 0))
    document.getElementById("speedo").innerHTML = displaySpeed + " km/h"
    if (displaySpeed > 80) {
        document.getElementById("speedo").style.color = "red"
    } else {
        document.getElementById("speedo").style.color = "black"
    }
}

start();

function powerChange() {
    currentPower = document.getElementById("power").value - 9
}

function canvasMain() {
    document.getElementById("canvas").width = window.innerWidth
    document.getElementById("canvas").height = window.innerHeight
    scn = new c3dl.Scene();
    scn.setCanvasTag("canvas");
    scn.setBackgroundColor(new Array(0, 0, 0))
    renderer = new c3dl.WebGL();
    renderer.createRenderer(this);
    scn.setRenderer(renderer);
    scn.init("canvas");
    if (renderer.isReady()) {
        duck = new c3dl.Collada();
        duck.init("M2.dae");
        scn.addObjectToScene(duck);
        cam = new c3dl.FreeCamera();
        cam.setPosition(new Array(-2000, 50, 80));
        cam.setLookAtPoint(new Array(0,50,80));
        cam.setFarClippingPlane(9000)
        cam.setFieldOfView(40)
        cam.setLinearVel(new Array(0, 0, 0))
        scn.setCamera(cam);
        scn.startScene();
    }
}