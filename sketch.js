let slider 
let resetButton
let animating = false
let animatingCheckbox
let nodes = [[]]
let path = [[]]
let t = 0
let pointSelected = null

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, 1, 0, 0.01)
  slider.position(10,10)

  resetButton = createButton('Reset')
  resetButton.position(165,10)
  resetButton.mousePressed(resetCurves)

  animatingCheckbox = createCheckbox('Animate', false)
  animatingCheckbox.position(235, 10)
}

function draw() {
  background(100);

  animating = animatingCheckbox.checked()

  fill(255)
  noStroke()
  textSize(16)
  text('t = ' + t.toFixed(2), 18, 50)

  
  for(let i2=0; nodes.length > i2; i2++){
    //Auto update of t
    if(animating){
      t += i2 == 0 ? 0.01 : 0
      if(t > 1){
        t = 0
        path = [[]]
        for (let o = 0; o < nodes.length; o++) {
          path.push([])
        }
      }
      slider.value(t)
    } else {
      t = slider.value()
    }
  
    noFill()
    stroke(t*100, t*255, 0)
    strokeWeight(1)
  
    beginShape()
    for(let i = 0; i < path[i2].length; i++){
      let point = path[i2][i]
      vertex(point.x, point.y)
    }
    endShape()

    if(nodes[i2].length > 1){
      let tangentVector = ({x: 0, y: 0})
  
  
      tangentVector.x = (calcRecPoints(nodes[i2], t+0.001)[0].x - calcRecPoints(nodes[i2], t-0.001)[0].x)/(0.001-(-0.001))
      tangentVector.y = (calcRecPoints(nodes[i2], t+0.001)[0].y - calcRecPoints(nodes[i2], t-0.001)[0].y)/(0.001-(-0.001))
  
  
      
      let interpoint = calcRecPoints(nodes[i2], t)
     // fill(255, 0, 0)
     // line(interpoint[0].x, interpoint[0].y, interpoint[0].x+tangentVector.x, interpoint[0].y+tangentVector.y)
      
      let lastPoint = interpoint[interpoint.length - 1]
      fill(0, 255, 0)
      circle(lastPoint.x, lastPoint.y, 10)
  
      path[i2].push(lastPoint)
    }
  
    // Draws the white nodes[i2]
    for(let i = 0; i < nodes[i2].length; i++){
  
      let node = nodes[i2][i]
      stroke(0)
      strokeWeight(1)
      fill(255)
      circle(node.x, node.y, 20)
    }
  }
  if(pointSelected != null){

    nodes[pointSelected.liste][pointSelected.index].x = mouseX
    nodes[pointSelected.liste][pointSelected.index].y = mouseY
  }

  
}

function calcRecPoints(points, t){
  let newPoints = []

  //Calculate middle points
  for(i = 0; i < points.length - 1; i++){
    let p1 = points[i]
    let p2 = points[i+1]
    
    //Lerp the dif
    let difX = lerp(p1.x, p2.x, t)
    let difY = lerp(p1.y, p2.y, t)
    newPoints.push({ x: difX, y: difY})

    //Draw the lines
    stroke(0) 
    line(p1.x, p1.y, p2.x, p2.y)

    //Draw the circles
    fill(200)
    circle(p1.x, p1.y, 7.5)
    circle(p2.x, p2.y, 7.5)
  }

  //Calculation until one point remains, then returns
  if(newPoints.length > 1){
    return calcRecPoints(newPoints, t)
  } else if (newPoints.length === 1 ){
    return newPoints
  } 
}

//UI check
function mousePressed(){
  if (mouseY < 45 && mouseX < 350) {
    return true
  }

  for (let i2 = 0; i2 < nodes.length; i2++) {
    for(let i = 0; i< nodes[i2].length; i++){
      let d = dist(mouseX, mouseY, nodes[i2][i].x, nodes[i2][i].y)
  
      if(d < 20){
        pointSelected = {index: i, liste: i2}
        return
      } 
    }
  }
  nodes[nodes.length-1].push({x: mouseX, y: mouseY})
}

//Should make sense
function mouseReleased(){
  pointSelected = null
}

//Same here ig
function resetCurves(){
  nodes = [[]]
  path = [[]]
  slider.value(0)
}

function keyPressed() {
  if (keyCode == 78) {
    nodes.push([{x: nodes[nodes.length-1][nodes[nodes.length-1].length-1].x, y: nodes[nodes.length-1][nodes[nodes.length-1].length-1].y}])
    path.push([])
  }
}