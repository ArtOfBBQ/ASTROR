// the index of the object controlled by the player
let iPlayer = 1;

// Apparently we can listen for keys without involving HTML
pagebody.addEventListener('keydown', function (e) {
    switch (e.key) 
    {
        case  'ArrowUp':
            allGameObjects[iPlayer].xVelocity += Math.sin(allGameObjects[iPlayer].angle) * 0.2;
            if (allGameObjects[iPlayer].xVelocity > 0.7) {allGameObjects[iPlayer].xVelocity = 0.7};
            allGameObjects[iPlayer].yVelocity += -Math.cos(allGameObjects[iPlayer].angle) * 0.2;
            if (allGameObjects[iPlayer].yVelocity > 0.7) {allGameObjects[iPlayer].yVelocity = 0.7};
            break;
        case  'ArrowDown':
            // allAsteroids[1].yVelocity += sin(allAsteroids.angle) * 1;
            break;
        case  'ArrowLeft':
            allGameObjects[iPlayer].angle -= 0.3;
            break;
        case 'ArrowRight':
            allGameObjects[iPlayer].angle += 0.3;
            break;
    }
}, true);

// A 2D array of 'pixels' (actually text characters)
// that we're using as a toy screen
class Screen {
    constructor(width, height) 
    {
        this.width = width;
        this.height = height;

        // This will end up as an array of arrays!
        this.screenContent = new Array(width);
        
        // Add nested arrays
        for (let i = 0; i < this.width; i++) 
        {
            this.screenContent[i] = new Array(height);
            for (let y = 0; y < this.height; y++)
            {
                this.screenContent[i][y] = false;
            }
        }
    }

    Clear()
    {
        for (let i = 0; i < this.width; i++) 
        {
            for (let y = 0; y < this.height; y++)
            {
                this.screenContent[i][y] = false;
            }
        }
    }

    Drawpoint(x, y)
    {
        if (x >= 0 && (x < this.width) && (y >= 0) && (y < this.height))
        {
            try 
            {
                this.screenContent[x][y] = true;
            }
            catch 
            {
                console.log('Tried to write point on x = ' + x + ' and y = ' + y);
            }
        }
    }

    Drawline(x1, y1, x2, y2)
    {
        let xdist = x2 - x1;
        let ydist = y2 - y1;
        
        let bigdist = Math.max(Math.abs(xdist), Math.abs(ydist));
        let ydistperstep = ydist / bigdist;
        let xdistperstep = xdist / bigdist;
        
        for (let i = 0; i < bigdist; i++)
        {
            let xToWrite = Math.round(x1 + (i * xdistperstep));
            let yToWrite = Math.round(y1 + (i * ydistperstep));
            this.Drawpoint(xToWrite, yToWrite);
        }
    }

    Render()
    {
        let htmlScreenContent = '';
        
        for (let y = 0; y < this.height; y++)
        {
            for (let i = 0; i < this.width; i++) 
            {
                if (this.screenContent[i][y] == true) 
                {
                    // I wonder if all systems out there can display this character?
                    htmlScreenContent = htmlScreenContent + '█';
                } else 
                {
                    htmlScreenContent = htmlScreenContent + ' ';
                };
            }
            htmlScreenContent = htmlScreenContent + '\n';
        }
        
        HTMLScreen.textContent = htmlScreenContent;
    }
}

class MoveableObject
{
    constructor(xPos, yPos) 
    {
        // xPos and yPos are the coordinates of this object on the 2-D map
        this.xPos = xPos;
        this.yPos = yPos;

        // xVelocity is the rate at which this object is moving along the x-axis
        this.xVelocity = 1.5 - Math.round((Math.random() * 30)) / 10;
        this.yVelocity = 1.5 - Math.round((Math.random() * 30)) / 10;
        
        // the angle describes the rotation of this object
        this.angle = Math.random() - 0.5;
        this.rotationSpeed = Math.random() * 0.005;
        
        // The polygon attribute is a collection of connectable dots
        // representing this object when it faces directly upwards
        let polygontype = Math.round(Math.round(Math.random() * 40)/10);
        console.log(polygontype);
        switch (polygontype)
        {
            case 0:
                this.polygon = [[2, -4], [-4, -2], [-6, 4], [4, 6], [7, 2]]
                break;
            case 1:
                this.polygon = [[1, -1], [-2, -1], [-4, 2], [-7, 2], [-8, 4], [-5, 5], [-2, 4], [0, 2], [2, 3], [4, 1]]
                break;
            case 2:
                this.polygon = [[1, -1], [-2, -1], [-4, 2], [-7, 2], [-8, 4], [-5, 5], [-2, 4], [0, 2], [2, 3], [4, 1]]
                break;
            default:
                this.polygon = [[-6, -3], [-15, 3], [-8, 9], [0, 6], [6, 9], [11, 3], [3, -3]]
        }

        let size = 1 + (Math.round(Math.random() * 60) / 10);
        for (let i = 0; i < this.polygon.length; i++) 
        {
            this.polygon[i][0] *= size;
            this.polygon[i][1] *= size;
        }
    }

    drawToScreen()
    {
        let targetpolygon = new Array(this.polygon.length)

        for (let i = 0; i < this.polygon.length; i++) 
        {
            // rotation of this point
            let rotatedxpos = this.polygon[i][0] * Math.cos(this.angle) - (this.polygon[i][1] * Math.sin(this.angle));
            let rotatedypos = this.polygon[i][0] * Math.sin(this.angle) + (this.polygon[i][1] * Math.cos(this.angle));
            
            // movement of this point
            let newxpos = Math.round(this.xPos + rotatedxpos);
            let newypos = Math.round(this.yPos + rotatedypos);
            
            
            targetpolygon[i] = [newxpos, newypos];
        }

        // draw a line from each polygon point to the next
        if (targetpolygon.length < 2) { 
            throw 'tried to draw lines between the points of a polygon but there are less than 2 points!';
        }
        for (let i = 0; i < targetpolygon.length - 1; i++)
        {
            screenHandler.Drawline(
                targetpolygon[i + 1][0],
                targetpolygon[i + 1][1],
                targetpolygon[i][0],
                targetpolygon[i][1]);
        }
        screenHandler.Drawline(
            targetpolygon[targetpolygon.length - 1][0],
            targetpolygon[targetpolygon.length - 1][1],
            targetpolygon[0][0],
            targetpolygon[0][1]);
    }
}


function updateSimulation() 
{
    elapsedTime = 1;

    // draw a border around the screen
    screenHandler.Drawline(screenHandler.width - 1, 0, 0, 0);
    screenHandler.Drawline(0, screenHandler.height - 1, screenHandler.width - 1, screenHandler.height - 1);
    
    screenHandler.Drawline(0, 0, 0, screenHandler.height - 1);
    screenHandler.Drawline(screenHandler.width - 1, 0, screenHandler.width - 1, screenHandler.height - 1);

    // update and draw all game objects
    for (let i = 0; i < allGameObjects.length; i++)
    {
        allGameObjects[i].angle += allGameObjects[i].rotationSpeed;
        allGameObjects[i].xPos += allGameObjects[i].xVelocity * elapsedTime;
        allGameObjects[i].yPos += allGameObjects[i].yVelocity * elapsedTime;

        if (allGameObjects[i].xPos < -15) 
        {
            allGameObjects[i].xPos = screenHandler.width + 15;
        }
        if (allGameObjects[i].yPos < -15) 
        {
            allGameObjects[i].yPos = screenHandler.height + 15;
        }
        allGameObjects[i].drawToScreen();
    }
}

function gameLoop(timestamp) {

    elapsedTime = timestamp - lastRender;
    
    screenHandler.Clear();
    updateSimulation();
    screenHandler.Render();
    
    lastRender = timestamp

    window.requestAnimationFrame(gameLoop);
}

let elapsedTime = 0;
let lastRender = 0;
screenHandler = new Screen(600, 300);
let allGameObjects = [
    new MoveableObject(50, 100),
    new MoveableObject(50, 20),
    new MoveableObject(200, 100),
    new MoveableObject(40, 275),
    new MoveableObject(250, 250),
    new MoveableObject(350, 150),
    ];
// the player should be a triangle
allGameObjects[iPlayer].polygon = [[0, -6], [-3, +3], [+3, +3]]
allGameObjects[iPlayer].rotationSpeed = 0;

gameLoop();