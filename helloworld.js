// the index of the object controlled by the player
let iPlayer = 0;
let requestShootBullet = false;

// Apparently we can listen for keys without involving HTML
pagebody.addEventListener('keydown', function (e) {
    switch (e.key) 
    {
        case  'ArrowUp':
            allGameObjects[iPlayer].xVelocity += Math.sin(allGameObjects[iPlayer].angle) * 0.2;
            if (allGameObjects[iPlayer].xVelocity > 1) {allGameObjects[iPlayer].xVelocity = 1};
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
        case 'd':
            allGameObjects[iPlayer].scheduledForDeath = true;
            break;
        case ' ':
            // user pushed space bar
            // shoot a 'bullet' which is also represented by a moveable object
            requestShootBullet = true;
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

        // the angle describes the rotation of this object
        this.angle = Math.random();

        // set this to true to make this thing disappear asap
        this.scheduledForDeath = false;

        // Set this to false to let the object disapppear when it moves off screen
        // Set to true to make the object re-spawn on the opposite side of the screen
        this.persistsOffScreen = true;
        
        // The polygon attribute is a collection of connectable dots
        // representing this object when it faces directly upwards
        let polygontype = Math.round(Math.round(Math.random() * 70)/10);
        switch (polygontype)
        {
            case 0:
                this.polygon = [[2, -4], [-4, -2], [-6, 4], [4, 6], [7, 2]]
                break;
            case 1:
                this.polygon = [[1, -1], [-2, -1], [-4, 2], [-7, 2], [-8, 4], [-5, 5], [-2, 4], [0, 2], [2, 3], [4, 1]]
                break;
            case 2:
                this.polygon = [[1, -1], [-2, -1], [-4, 2], [-7, 3], [-8, 4], [-5, 5], [-2, 4], [0, 2], [2, 3], [4, 1]]
                break;
            case 3:
                this.polygon = [[-6, -3], [-15, 3], [-8, 9], [0, 6], [6, 9], [11, 3], [3, -3]]
            case 4:
                this.polygon = [[-1, -4], [-5, -3], [-9, -2], [-10, 0], [-5, 1], [-2, 3], [2, 3], [5, 2], [8, 1], [7, -2], [3, -3]]
            case 5:
                this.polygon = [[3, -5], [-1, -4], [-5, -3], [-8, -2], [-11, 0], [-6, 1], [-2, 3], [2, 3], [10, 3], [15, 1], [13, -2], [7, -4]]
            case 6:
                this.polygon = [[-10.5,-4],[-8.6,-7.9],[-5.5,-7.4],[-3.8,-12.4],[0.5,-11.8],[4.3,-13.8],[6.2,-14],[8.5,-14.3],[10.6,-14],[12.7,-13],[13.2,-11.4],[14.2,-8.6],[13,-5.1],[15.6,-2.1],[11.6,2.6],[9.1,9.6],[5,12.1],[3,12.7],[0.8,12.6],[-1.1,12.1],[-4.1,14.4],[-6.4,14.2],[-13.9,13.4],[-15.5,7.3],[-11.4,2.7],[-13.1,-0.4]]
            default:
                this.polygon = [[-3, -2], [-5, 1], [-2, 3], [2, 3], [5, 2], [4, -1]]
        }

        // randomly increase the polygon size for variety
        let ransize = 1 + (Math.round(Math.random() * 60) / 10);
        for (let i = 0; i < this.polygon.length; i++) 
        {
            this.polygon[i][0] *= ransize;
            this.polygon[i][1] *= ransize;
        }

        // store the object's approx size (radius) for future reference
        this.size = 0;
        for (var i = 0; i < this.polygon.length; i++) 
        {
            if (Math.abs(this.polygon[i][0]) > this.size) 
            {
                this.size = Math.abs(this.polygon[i][0]);
            }
            
            if (Math.abs(this.polygon[i][1]) > this.size) 
            {
                this.size = Math.abs(this.polygon[i][1]);
            }
        }

        // xVelocity is the rate at which this object is moving along the x-axis
        this.xVelocity = (Math.random() * 10) / this.size;
        this.yVelocity = (Math.random() * 10) / this.size;

        this.rotationSpeed = ((-0.05 + (Math.random() / 10)) * 6) / this.size;
    }

    drawToScreen()
    {
        let targetpolygon = new Array(this.polygon.length)

        for (let i = 0; i < this.polygon.length; i++) 
        {
            // from the original polygon skeleton, where should this pixel rotate to?
            let rotatedxpos = this.polygon[i][0] * Math.cos(this.angle) - (this.polygon[i][1] * Math.sin(this.angle));
            let rotatedypos = this.polygon[i][0] * Math.sin(this.angle) + (this.polygon[i][1] * Math.cos(this.angle));
            
            // store the coordinates for the rotated pixel
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

// the laziest possible way to approximate gameplay;
// we just remove all objects when they collide with something else
// (another asteroid, the player, or a bullet)
function deleteAllCollidingObjects() 
{
    // Sort all the items by their x-position,
    // and after sorting, remove the ones who are 
    // not x-colliding with their neighbors
    // let xSortedCandidates = sortByPosPropertyAndRemoveNonColliding(allGameObjects, 'xPos');

    // if (xSortedCandidates.length > 2) 
    // {
    //     console.log('x candidates left: ' + xSortedCandidates.length);
    // }

    // let ySortedCandidates = sortByPosPropertyAndRemoveNonColliding(xSortedCandidates, 'yPos');

    for (var i = 0; i < allGameObjects.length; i++)
    {
        for (var y = 0; y < allGameObjects.length; y++)
        {
            if (i == y) { continue; }
            
            let dist = Math.sqrt
            (
                Math.pow(allGameObjects[i].xPos - allGameObjects[y].xPos, 2) +
                Math.pow(allGameObjects[i].yPos - allGameObjects[y].yPos, 2)
            );
            if (typeof dist != 'number') { throw "distance was " + dist + ' typeof ' + typeof dist; }
            if ( dist < (allGameObjects[i].size / 2) + (allGameObjects[y].size / 2) )
            {
                allGameObjects[i].scheduledForDeath = true;
                allGameObjects[y].scheduledForDeath = true;
            }
        }
    }
}

function sortByPosPropertyAndRemoveNonColliding(originalArray, propertyName)
{
    console.log('originalArray.length: ' + originalArray.length);
    if (originalArray.length < 2) { return originalArray; }
    if (originalArray == null) { return []; }

    // we'll randomly choose one of the members as our pivot value
    // and place all smaller values to the left, and are larger values to the right
    // then recrusively sort both the left and right halves
    // then concatenate left + pivot + right for a sorted array
    // then remove all the ones which aren't colliding on this property (and therefore
    // can't be colliding overall)
    let outArray = [];
    let leftArray = [];
    let rightArray = [];

    let iPivot = Math.floor((Math.random() * originalArray.length * 10) / 10);
    let pivot = originalArray[iPivot][propertyName];

    for (let i = 0; i < originalArray.length; i++) 
    {
        if (i == iPivot) { continue; }
        
        if (originalArray[i][propertyName] < pivot)
        {
            leftArray.push(originalArray[i][propertyName]);
        }
        else
        {
            rightArray.push(originalArray[i][propertyName]);
        }
    }

    if (leftArray.length + rightArray.length + 1 != originalArray.length) 
    {
        throw "Sum of parts didn't match oriignalarray after combining ";
    }

    leftArray = sortByPosPropertyAndRemoveNonColliding(leftArray, propertyName);
    rightArray = sortByPosPropertyAndRemoveNonColliding(leftArray, propertyName);
    let origLength = leftArray.length + rightArray.length + 1;

    // put sorted parts together
    outArray = outArray.concat(leftArray);
    outArray.push(originalArray[iPivot]);
    outArray = outArray.concat(rightArray);
    if (outArray.length != origLength) { throw "sum of parts issue";}

    // filter out non-colliding objects
    if (outArray.size < 3) { return outArray; }
    for (var i = 1; i < leftArray.length - 1; i++) 
    {
        if
        (
            (outArray[i][propertyName] - outArray[i + 1][propertyName])
            >= outArray[i]['size'] - outArray[i + 1]['size']
        )
        {
            // could be colliding with its right neighbor, keep going
            continue;
        }
        
        if
        (
            (outArray[i][propertyName] - outArray[i - 1][propertyName])
            >= outArray[i]['size'] - outArray[i - 1]['size']
        )
        {
            // could be colliding with its right neighbor, keep going
            continue;
        }

        // we now know that i isn't colliding with either of its neighbors,
        // and since the array is sorted, we know it can't possibly be colliding with anything
        leftArray.Splice(i, 1);
        i--;
    }

    return outArray;
}



function updateSimulation() 
{
    elapsedTime = 1;

    // draw a border around the screen
    screenHandler.Drawline(screenHandler.width - 1, 0, 0, 0);
    screenHandler.Drawline(0, screenHandler.height - 1, screenHandler.width - 1, screenHandler.height - 1);
    
    screenHandler.Drawline(0, 0, 0, screenHandler.height - 1);
    screenHandler.Drawline(screenHandler.width - 1, 0, screenHandler.width - 1, screenHandler.height - 1);

    // if requested, fire a bullet
    if (requestShootBullet) 
    {
        allGameObjects.push(
            new MoveableObject(
                allGameObjects[iPlayer].xPos,
                allGameObjects[iPlayer].yPos));
        allGameObjects[allGameObjects.length - 1].size = 1;
        allGameObjects[allGameObjects.length - 1].polygon = [[-1, 0], [0, 0]];
        allGameObjects[allGameObjects.length - 1].angle = allGameObjects[iPlayer].angle;
        allGameObjects[allGameObjects.length - 1].persistsOffScreen = false;
        allGameObjects[allGameObjects.length - 1].xVelocity = Math.sin(allGameObjects[iPlayer].angle) * 4;
        allGameObjects[allGameObjects.length - 1].yVelocity = Math.cos(allGameObjects[iPlayer].angle) * -4;
        allGameObjects[allGameObjects.length - 1].xPos += allGameObjects[allGameObjects.length - 1].xVelocity * 5;
        allGameObjects[allGameObjects.length - 1].yPos += allGameObjects[allGameObjects.length - 1].yVelocity * 5;
    }
    requestShootBullet = false;

    // update and draw all game objects
    for (let i = 0; i < allGameObjects.length; i++)
    {
        if (allGameObjects[i].scheduledForDeath) 
        {
            if (i == iPlayer) 
            {
                alert("You have died a horrific death. The reign of ASTROR, the dark lord, will now go unchallenged. Your failures will be recorded in the tome of shame.");
                location.reload();
            }
            allGameObjects.splice(i, 1);
            i--;
            continue;
        }

        allGameObjects[i].angle += allGameObjects[i].rotationSpeed;
        allGameObjects[i].xPos += allGameObjects[i].xVelocity * elapsedTime;
        allGameObjects[i].yPos += allGameObjects[i].yVelocity * elapsedTime;

        if ((allGameObjects[i].xPos + allGameObjects[i].size) < -1) 
        {
            if (allGameObjects[i].persistsOffScreen) 
            {
                allGameObjects[i].xPos = screenHandler.width + allGameObjects[i].size;
            }
            else 
            {
                allGameObjects.splice(i, 1);
                continue;
            }
            
        }
        else if (allGameObjects[i].xPos > screenHandler.width + allGameObjects[i].size) 
        {
            if (allGameObjects[i].persistsOffScreen) 
            {
                allGameObjects[i].xPos = 0;
            }
            else 
            {
                allGameObjects.splice(i, 1);
                continue;
            }
        }
        else if ((allGameObjects[i].yPos + allGameObjects[i].size) < -1) 
        {
            if (allGameObjects[i].persistsOffScreen) 
            {
                allGameObjects[i].yPos = screenHandler.height + allGameObjects[i].size;
            }
            else 
            {
                allGameObjects.splice(i, 1);
                continue;
            }
        }
        else if (allGameObjects[i].yPos > screenHandler.height + allGameObjects[i].size) 
        {
            if (allGameObjects[i].persistsOffScreen) 
            {
                allGameObjects[i].yPos = -1;
            }
            else
            {
                allGameObjects.splice(i, 1);
                continue;
            }
        }

        deleteAllCollidingObjects();

        if (allGameObjects.length == 1 && allGameObjects[0].scheduledForDeath == false) 
        {
            alert("ASTROR, the dark lord, has been vanquished! You are the ultimate player!!!");
            location.reload();
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
    new MoveableObject(50, 20),
    new MoveableObject(50, 100),
    new MoveableObject(200, 100),
    new MoveableObject(40, 275),
    new MoveableObject(250, 250),
    new MoveableObject(350, 150),
    new MoveableObject(550, 40),
    new MoveableObject(560, 250)
    ];
// the player should be a triangle
allGameObjects[iPlayer].polygon = [[0.7,-11.6],[2.5,-10.6],[3.2,-8.9],[2.8,-5.5],[3.6,-5.3],[3.1,0.3],[4.9,0.3],[5.1,-8.7],[6.7,-8.6],[6.7,11.7],[4.6,11.3],[4.6,4.8],[3,4.3],[2.5,9.2],[1.2,9],[1.1,10.2],[-1.5,10],[-1.5,8.9],[-2.8,8.9],[-2.9,5.2],[-4.6,4.8],[-4.5,11.4],[-6.6,11.1],[-6.7,-8.7],[-4.7,-8.6],[-5,-0.5],[-3.4,-0.4],[-3,-5.3],[-1.8,-5.5],[-1.5,-9.2],[-0.7,-10.4]]
allGameObjects[iPlayer].rotationSpeed = 0;
allGameObjects[iPlayer].xVelocity = 0;
allGameObjects[iPlayer].yVelocity = 0;

gameLoop();