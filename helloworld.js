// Apparently we can listen for keys without involving HTML
pagebody.addEventListener('keydown', function (e) {
    switch (e.key) 
    {
        case  'ArrowLeft':
            allAsteroids[1].xVelocity -= 1;
            screenHandler.Render();
            break;
        case 'ArrowRight':
            allAsteroids[1].xVelocity += 1;
            screenHandler.Render();
            break;
    }
}, true);

// A 2D array of 'pixels' (actually text characters)
// that we're using a toy screen
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
        
        for (let i = 0; i < this.width; i++) 
        {
            for (let y = 0; y < this.height; y++)
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
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.size = 6;
    }

    drawToScreen()
    {
        for (let i = 0; i < this.size; i++) 
        {
            for (let y = 0; y < this.size; y++) 
            {
                console.log(typeof screenHandler);
                console.log(typeof screenHandler.screenContent);
                console.log('i:' + this.xPos + i + ' ' + screenHandler.screenContent.length);
                console.log(typeof screenHandler.screenContent[this.xPos + i]);
                console.log('y:' + this.yPos + y + ' ' + screenHandler.screenContent[0].length);
                console.log(typeof screenHandler.screenContent[Math.round(this.xPos + i)][Math.round(this.yPos + y)]);
                screenHandler.screenContent[Math.round(this.xPos + i)][Math.round(this.yPos + y)] = true;
            }
        }
    }
}


function updateSimulation() 
{
    elapsedTime = 1;

    // update and draw asteroids
    for (let i = 0; i < allAsteroids.length; i++)
    {
        allAsteroids[i].xPos += allAsteroids[i].xVelocity * elapsedTime;
        allAsteroids[i].yPos += allAsteroids[i].yVelocity * elapsedTime;
        allAsteroids[i].drawToScreen();
    }
}

function gameLoop(timestamp) {

    elapsedTime = timestamp - lastRender;
    console.log(allAsteroids[0].xPos);
    
    screenHandler.Clear();
    updateSimulation();
    screenHandler.Render();
    
    lastRender = timestamp

    window.requestAnimationFrame(gameLoop);
}

let elapsedTime = 0;
let lastRender = 0;
screenHandler = new Screen(400, 600);
let allAsteroids = [new MoveableObject(4, 4), new MoveableObject(100, 20)];
allAsteroids[0].xVelocity = 0.05;

gameLoop();