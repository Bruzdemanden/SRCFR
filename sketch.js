let slider 
let resetButton
let animating = false
let animatingCheckbox
let nodes = []
let path = []
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
  //console.log(nodes.length)

  animating = animatingCheckbox.checked()

  fill(255)
  noStroke()
  textSize(16)
  text('t = ' + t, 18, 50)
  

  //Auto update of t
  if(animating){
    t += 0.01

    if(t > 1){
      t = 0
      path = []
    }
    slider.value(t)
  } else {
    t = slider.value()
  }

  noFill()
  stroke(255)
  strokeWeight(1)

  beginShape()

  for(let i = 0; i < path.length; i++){
    let point = path[i]
    vertex(point.x, point.y)
  }
 
  endShape()

  if(nodes.length > 1){
    
    let interpoint = calcRecPoints(nodes, t)
    
    for(let i = 0; i < interpoint.length - 1; i++){
    let p1 = interpoint[i]
    let p2 = interpoint[i+1]

    }
    
    let lastPoint = interpoint[interpoint.length - 1]
    fill(0, 255, 0)
    circle(lastPoint.x, lastPoint.y, 10)

    path.push(lastPoint)
  }

  // Draws the white nodes
  for(let i = 0; i < nodes.length; i++){

    let node = nodes[i]
    stroke(0)
    strokeWeight(1)
    
    fill(255)
    circle(node.x, node.y, 20)

  }
  
  if(pointSelected != null){

    nodes[pointSelected].x = mouseX
    nodes[pointSelected].y = mouseY
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

    //Draw the circles
    fill(200)
    circle(p1.x, p1.y, 7.5)
    circle(p2.x, p2.y, 7.5)

    //Draw the lines
    stroke(0)
    line(p1.x, p1.y, p2.x, p2.y)
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

  for(let i = 0; i< nodes.length; i++){

    let d = dist(mouseX, mouseY, nodes[i].x, nodes[i].y)

    if(d < 20){
      pointSelected = i
      return
    } 
  }
  nodes.push({x: mouseX, y: mouseY})
}

//Should make sense
function mouseReleased(){
  pointSelected = null
}

//Same here ig
function resetCurves(){
  nodes = []
  slider.value(0)
  path = []
}