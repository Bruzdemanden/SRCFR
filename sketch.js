let tSlider 
let widthSlider
let resetButton
let animating = false
let animatingCheckbox
let nodes = [[]]
let path = [[]]
let leftPath = []
let rightPath = []
let t = 0
let trackWidth = 20
let pointSelected = null

function setup() {
  createCanvas(windowWidth, windowHeight);
  tSlider = createSlider(0, 1, 0, 0.01)
  tSlider.position(10,10)

  resetButton = createButton('Reset')
  resetButton.position(165,10)
  resetButton.mousePressed(resetCurves)

  animatingCheckbox = createCheckbox('Animate', false)
  animatingCheckbox.position(235, 10)

  widthSlider = createSlider(0, 50, 0, 0.5)
  widthSlider.position(325, 10)
}

function draw() {
  background(200);

  animating = animatingCheckbox.checked()
  trackWidth = widthSlider.value()

  fill(0)
  noStroke()
  textSize(16)
  text('t = ' + t.toFixed(2), 18, 50)
  text('Trackwidth = ' + trackWidth, 333, 50)

  //Control of t and slider
  let maxT = max(1, nodes.length)
  tSlider.attribute('max', maxT)

  for(let i2 = 0; nodes.length > i2; i2++){
    //Auto update of t
    if(animating){
     t+=0.01/nodes.length
      if(t >= maxT){
        t = 0
          for(let i = 0; i < path.length; i++){
            path[i] = []
          }
      }
      tSlider.value(t)
    } else {
      t = tSlider.value() 
    }
  
    let chosenCurve = floor(t) //The current curve
    let localT = t - chosenCurve //The local t value of the curve

    noFill()
    stroke(100, 255, 0)
    strokeWeight(1)
  
    beginShape()
    for(let i = 0; i < path[i2].length; i++){
      let point = path[i2][i]
      vertex(point.x, point.y)
    }
    endShape()

    if(nodes[i2].length > 1){
      for(let i = 0; i < nodes[i2].length - 1; i++){
        stroke(0)
        line(nodes[i2][i].x, nodes[i2][i].y, nodes[i2][i + 1].x, nodes[i2][i + 1].y,)
      }
    }

    if(i2 == chosenCurve && nodes[i2].length > 1){
     // let tangentVector = ({x: 0, y: 0})
     // tangentVector.x = (calcRecPoints(nodes[i2], t+0.001)[0].x - calcRecPoints(nodes[i2], t-0.001)[0].x)/(0.001-(-0.001))
     // tangentVector.y = (calcRecPoints(nodes[i2], t+0.001)[0].y - calcRecPoints(nodes[i2], t-0.001)[0].y)/(0.001-(-0.001))

     // fill(255, 0, 0)
     // line(interpoint[0].x, interpoint[0].y, interpoint[0].x+tangentVector.x, interpoint[0].y+tangentVector.y)
    
      let interpoint = calcRecPoints(nodes[i2], localT) 

      let lastPoint = interpoint[interpoint.length - 1]
      fill(0, 255, 0)
      circle(lastPoint.x, lastPoint.y, 10)
  
      path[i2].push(lastPoint)
    }
  
    // Draws the white nodes
    for(let i = 0; i < nodes[i2].length; i++){
  
      let node = nodes[i2][i]
      stroke(0)
      strokeWeight(1)
      fill(255)
      circle(node.x, node.y, 20)
    }
  }
  
  if(pointSelected != null){

    if (pointSelected.liste != 0 && pointSelected.index == 1) {
      nodes[pointSelected.liste-1][nodes[pointSelected.liste-1].length-2].x = nodes[pointSelected.liste][0].x - nodes[pointSelected.liste][pointSelected.index].x + nodes[pointSelected.liste][0].x
      
      nodes[pointSelected.liste-1][nodes[pointSelected.liste-1].length-2].y = nodes[pointSelected.liste][0].y - nodes[pointSelected.liste][pointSelected.index].y + nodes[pointSelected.liste][0].y

    }
    nodes[pointSelected.liste][pointSelected.index].x = mouseX
    nodes[pointSelected.liste][pointSelected.index].y = mouseY
  }

  //Rydder de seperate paths
  leftPath = []
  rightPath = []

  //Beregnelse af bredde
  //Loop igennem hele path listen 
  for(let i2 = 0; i2 < path.length; i2++){
    //Tjek hvorvidt path til i2 har mere end 1 punkt
    if (path[i2].length > 1) { 
      //Loop gennem hvert punkt i path til i2, hvor vi starter fra punkt 1, da vi sammenligner med det forrige
      for (let i = 1; i < path[i2].length; i++) {
          //Henter det forrige punkt og nuværende punkt i path
          let p1 = path[i2][i - 1]
          let p2 = path[i2][i]

          //Beregner forskellen ix- og y-koordinaterne mellem det forrige og nuværende punkt
          let dx = p2.x - p1.x
          let dy = p2.y - p1.y

          //Beregner vinklen mellem punkterne i forhold til x-aksen
          let angle = atan2(dy, dx)

          //Beregner koordinaterne for vesntre side af banen ved brug af den udregnede vinkel lagt sammen med 90 grader
          let xLeft = p2.x + cos(angle + HALF_PI) * trackWidth
          let yLeft = p2.y + sin(angle + HALF_PI) * trackWidth
          //Tilføjer punkterne til listen leftPath
          leftPath.push({x: xLeft, y: yLeft})
    
          //Beregner koordinaterne for højre side af banen ved brug af den udregnede vinkel med 90 grader trukket fra
          let xRight = p2.x + cos(angle - HALF_PI) * trackWidth
          let yRight = p2.y + sin(angle - HALF_PI) * trackWidth
          //Tilføjer punkterne til listen rightPath
          rightPath.push({x: xRight, y: yRight})
     }
   }
 }

 //Bredde tegnes
 
  fill(100)
  noStroke()
  beginShape()
  for(let i = 0; i < leftPath.length; i++){
    vertex(leftPath[i].x, leftPath[i].y)
  }

  for(let i = rightPath.length-1; i >= 0; i--){
    vertex(rightPath[i].x, rightPath[i].y)
  }
  endShape(CLOSE)


}

function calcRecPoints(points, t){
  let newPoints = []

  //Calculate middle points
  for(let i = 0; i < points.length - 1; i++){
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
  if (mouseY < 45 && mouseX < 465) {
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
  tSlider.value(0)
  t = 0
  leftPath = []
  rightPath = []
}

function keyPressed() {
  if (keyCode == 78) {
    nodes.push([{x: nodes[nodes.length-1][nodes[nodes.length-1].length-1].x, y: nodes[nodes.length-1][nodes[nodes.length-1].length-1].y}])
    path.push([])
  }
}