// Apparently we can listen for keys without involving HTML
let iPlayerControlled = 1;
pagebody.addEventListener('keydown', function (e) {
    switch (e.key) 
    {
        case  'ArrowUp':
            allGameObjects[iPlayerControlled].xVelocity += Math.sin(allGameObjects[iPlayerControlled].angle) * 0.2;
            if (allGameObjects[iPlayerControlled].xVelocity > 1) {allGameObjects[iPlayerControlled].xVelocity = 1};
            allGameObjects[iPlayerControlled].yVelocity += -Math.cos(allGameObjects[iPlayerControlled].angle) * 0.2;
            if (allGameObjects[iPlayerControlled].yVelocity > 1) {allGameObjects[iPlayerControlled].yVelocity = 1};
            break;
        case  'ArrowDown':
            console.log(Math.sin(allGameObjects[iPlayerControlled]).angle);
            // allAsteroids[1].yVelocity += sin(allAsteroids.angle) * 1;
            break;
        case  'ArrowLeft':
            allGameObjects[iPlayerControlled].angle -= 0.1;
            break;
        case 'ArrowRight':
            allGameObjects[iPlayerControlled].angle += 0.1;
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
        this.xVelocity = 0;
        this.yVelocity = 0;
        // the angle describes the rotation of this object
        this.angle = 0.9;
        // The polygon attribute is a collection of connectable dots
        // representing this object when it faces directly upwards
        this.polygon = [[0, -3], [-3, +3], [+3, +3]]
    }

    drawToScreen()
    {
        for (let i = 0; i < this.polygon.length; i++) 
        {
            // rotation of this point
            let rotatedxpos = this.polygon[i][0] * Math.cos(this.angle) - (this.polygon[i][1] * Math.sin(this.angle));
            let rotatedypos = this.polygon[i][0] * Math.sin(this.angle) + (this.polygon[i][1] * Math.cos(this.angle));
            
            // movement of this point
            let newxpos = Math.round(this.xPos + rotatedxpos);
            let newypos = Math.round(this.yPos + rotatedypos);
            
            screenHandler.screenContent[newxpos][newypos] = true;
        }
    }
}


function updateSimulation() 
{
    elapsedTime = 1;

    // draw a border around the screen
    for (let i = 0; i < screenHandler.width; i++) 
    {
        screenHandler.screenContent[i][0] = true;
        screenHandler.screenContent[i][screenHandler.height - 1] = true;
    }

    for (let i = 0; i < screenHandler.height; i++) 
    {
        screenHandler.screenContent[0][i] = true;
        screenHandler.screenContent[screenHandler.width - 1][i] = true;
    }

    // rotate objects


    // update and draw asteroids
    for (let i = 0; i < allGameObjects.length; i++)
    {
        allGameObjects[i].xPos += allGameObjects[i].xVelocity * elapsedTime;
        allGameObjects[i].yPos += allGameObjects[i].yVelocity * elapsedTime;
        allGameObjects[i].drawToScreen();
    }
}

function gameLoop(timestamp) {

    elapsedTime = timestamp - lastRender;
    console.log(allGameObjects[0].xPos);
    
    screenHandler.Clear();
    updateSimulation();
    screenHandler.Render();
    
    lastRender = timestamp

    window.requestAnimationFrame(gameLoop);
}

let elapsedTime = 0;
let lastRender = 0;
screenHandler = new Screen(600, 300);
let allGameObjects = [new MoveableObject(4, 4), new MoveableObject(50, 20)];

gameLoop();