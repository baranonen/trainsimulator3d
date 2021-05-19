var cameraX = 0
var cameraY = 0
var cameraZ = 0

var currentPower = 0
var speed = 0
var displaySpeed = 0
var mode = "ATP"
var targetSpeed = 0
var atoStart = false
var atoStop = false
var atpProt = false
var leftDoors = "Open"
var rightDoors = "Closed"

var atoinfo = 
{
    route: [
            {
                pos: 0,
                speed: 80
            },
            {
                pos: 50000,
                speed: 80
            },
            {
                pos: 55000,
                speed: 60
            },
            {
                pos: 61000,
                speed: 40
            },
            {
                pos: 63500,
                speed: 20
            },
            {
                pos: 65000,
                speed: 0
            },
            {
                pos: (65000 * 2) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 2) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 2) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 2) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 2),
                speed: 0
            },
            {
                pos: (65000 * 3) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 3) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 3) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 3) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 3),
                speed: 0
            },
            {
                pos: (65000 * 4) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 4) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 4) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 4) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 4),
                speed: 0
            },
            {
                pos: (65000 * 5) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 5) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 5) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 5) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 5),
                speed: 0
            },
            {
                pos: (65000 * 6),
                speed: -1
            }
        ]
}

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
            mode = "ATP"
            if (document.getElementById("power").value > 1) {
                document.getElementById("power").value --
                powerChange()
            }
            break
        case 90:
            mode = "ATP"
            if (document.getElementById("power").value < 13) {
                document.getElementById("power").value ++
                powerChange()
            }
            break
        case 49:
            mode = "ATP"
            document.getElementById("power").value = 1
            powerChange()
            break
        case 75:
            atoStop = false
            if (mode == "ATO") {
                mode = "ATP"
                document.getElementById("power").value = 9
                powerChange()
            } else {
                if (displaySpeed == 0 && document.getElementById("power").value < 9) {
                    atoStart = true
                }
                mode = "ATO"
            }
            break
        case 53:
            if (speed != 0) {
                break
            }
            if (leftDoors == "Closed") {
                leftDoors = "Open"
            } else {
                leftDoors = "Closed"
            }
            break
        case 54:
            if (speed != 0) {
                break
            }
            if (rightDoors == "Closed") {
                rightDoors = "Open"
            } else {
                rightDoors = "Closed"
            }
            break
    }
}

function help() {
    alert("Move power handle backwards: Q\nMove power handle forwards: Z\nEmergency Brake: 1\nEnable/Disable ATO (Automatic Train Operation): K\n\nYou can click the power notches to move the handle as well.\n\nOpen/close the left side doors: 5\nOpen/close the right side doors: 6\n\nUse arrow keys to look around.\n\nDo not exceed 80 km/h.")
}

function atp() {
    if (displaySpeed > 90) {
        atpProt = true
    }
    if (displaySpeed < 80) {
        atpProt = false
    }
    if (atpProt == true) {
        document.getElementById("power").value = 1
        powerChange()
    }
}

function ato() {
    if (!(leftDoors == "Closed" && rightDoors == "Closed")) {
        mode = "ATP"
        return
    }
    loop1:
    for (var i = 0; i < atoinfo.route.length; i++) {
        waypoint = atoinfo.route[i]
        if (waypoint.pos > cam.getPosition()[0]) {
            if (atpProt == true) {
                break loop1
            }
            if (atoStart == true && waypoint.speed == 0) {
                document.getElementById("power").value = 13
                powerChange()
                break loop1
            } else {
                atoStart = false
            }
            if (waypoint.speed == 0 && atoStart == false) {
                atoStop = true
            }
            if (atoStop == true && speed == 0) {
                mode = "ATP"
                document.getElementById("power").value = 2
                atoStop = false
                break loop1
            }
            if (atoStop == true) {
                if (Math.abs(waypoint.speed - displaySpeed) > 7) {
                    document.getElementById("power").value = 2
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 6) {
                    document.getElementById("power").value = 3
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 5) {
                    document.getElementById("power").value = 4
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 4) {
                    document.getElementById("power").value = 5
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 3) {
                    document.getElementById("power").value = 6
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 2) {
                    document.getElementById("power").value = 7
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 1) {
                    document.getElementById("power").value = 8
                    powerChange()
                }
                break loop1;
            }
            if (waypoint.speed > displaySpeed) {
                if ((waypoint.speed - displaySpeed) > 4) {
                    document.getElementById("power").value = 13
                    powerChange()
                } else if ((waypoint.speed - displaySpeed) > 3) {
                    document.getElementById("power").value = 12
                    powerChange()
                } else if ((waypoint.speed - displaySpeed) > 2) {
                    document.getElementById("power").value = 11
                    powerChange()
                } else if ((waypoint.speed - displaySpeed) > 1) {
                    document.getElementById("power").value = 10
                    powerChange()
                }
            } else if (waypoint.speed < displaySpeed) {
                if (Math.abs(waypoint.speed - displaySpeed) > 7) {
                    document.getElementById("power").value = 2
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 6) {
                    document.getElementById("power").value = 3
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 5) {
                    document.getElementById("power").value = 4
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 4) {
                    document.getElementById("power").value = 5
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 3) {
                    document.getElementById("power").value = 6
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 2) {
                    document.getElementById("power").value = 7
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 1) {
                    document.getElementById("power").value = 8
                    powerChange()
                }
            } else {
                if (displaySpeed == 0) {
                    document.getElementById("power").value = 2
                    powerChange()
                } else {
                    document.getElementById("power").value = 9
                    powerChange()
                }
            }
            if (displaySpeed == 0 && document.getElementById("power").value < 9) {
                mode = "ATP"
            }
            break loop1
        }
    }
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

    if (leftDoors == "Closed" && rightDoors == "Closed") {
        if (currentPower > 0) {
            speed = speed + scale(currentPower, 0, 3, 0, 1) / 1000
        } else if (currentPower < 0) {
            if (speed > 0) {
                speed = speed - scale(currentPower, 0, -8, 0, 1) / 350
            }
        }
    }

    if (speed < 0) {
        speed = 0
    }

    displaySpeed = Math.round(speed * 50)

    cam.setLinearVel(new Array(speed, 0, 0))
    document.getElementById("speedo").innerHTML = displaySpeed + " km/h"
    document.getElementById("mode").innerHTML = mode
    if (atpProt == true) {
        document.getElementById("speedo").style.color = "red"
    } else if (displaySpeed > 80) {
        document.getElementById("speedo").style.color = "orange"
    } else {
        document.getElementById("speedo").style.color = "white"
    }

    document.getElementById("traveled").innerHTML = Math.round((cam.getPosition()[0]) / 50) + " m"
    document.getElementById("leftdoors").innerHTML = leftDoors
    document.getElementById("rightdoors").innerHTML = rightDoors

    atp()

    if (mode == "ATO") {
        ato()
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
        cam.setPosition(new Array(0, 50, 80));
        cam.setLookAtPoint(new Array(400000,50,80));
        cam.yaw(-0.01)
        cam.setFarClippingPlane(9000)
        cam.setFieldOfView(40)
        cam.setLinearVel(new Array(0, 0, 0))
        scn.setCamera(cam);
        scn.startScene();
    }
}