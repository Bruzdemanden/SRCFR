let slider 
let nodes = []
let pointSelected = null

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, 1, 0, 0.01)
  slider.position(10,10)
}

function draw() {
  background(100);

  if(nodes.length > 1){
   
    let t = slider.value()
    let allLines = []
    let interpoint = calcRecPoints(nodes, t)

    for(let i = 0; i < interpoint.length - 1; i++){

    let p1 = interpoint[i]
    let p2 = interpoint[i+1]

    stroke(0)
    line(p1.x, p1.y, p2.x, p2.y)
  
    fill(255, 0, 0)
    circle(p1.x, p1.y, 10)

    }
    
    let lastPoint = interpoint[interpoint.length - 1]
    fill(0, 255, 0)
    circle(lastPoint.x, lastPoint.y, 10)

  }

  for(let i = 0; i < nodes.length; i++){

    let node = nodes[i]
    fill(255)
    circle(node.x, node.y, 20)

    for (let i = 0; i < allLines.length; i++) {
      let linePart = allLines[i]

      line(linePart.p1.x, linePart.p1.y, linePart.p2.x, linePart.p2.y)


    }
  }
  
  if(pointSelected != null){

    nodes[pointSelected].x = mouseX
    nodes[pointSelected].y = mouseY
  }

}

function calcRecPoints(points, t, allLines){
  let newPoints = []

  for(i = 0; i < points.length - 1; i++){

    let p1 = points[i]
    let p2 = points[i+1]
    
    let difX = lerp(p1.x, p2.x, t)
    let difY = lerp(p1.y, p2.y, t)
    newPoints.push({ x: difX, y: difY})

    allLines.push({ p1, p2 })
  }

  if(newPoints.length > 1){
    return calcRecPoints(newPoints, t, allLines)
  } else {
    return newPoints
  }
}

function mousePressed(){

  if (mouseY < 40 && mouseX < 150) {
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

function mouseReleased(){
  pointSelected = null
}

