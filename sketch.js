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



  for(i = 0; i < nodes.length - 1; i++){

    let p1 = nodes[i]
    let p2 = nodes[i+1]

    stroke(0)
    line(p1.x, p1.y, p2.x, p2.y)

    let t = slider.value()
    
    let difX = lerp(p1.x, p2.x, t)
    let difY = lerp(p1.y, p2.y, t)
    fill(255, 0, 0)
    circle(difX, difY, 10)

  }

  for(let i = 0; i < nodes.length; i++){

    let node = nodes[i]
    fill(255)
    circle(node.x, node.y, 20)

  }
  
  if(pointSelected != null){

    nodes[pointSelected].x = mouseX
    nodes[pointSelected].y = mouseY
  }

}

function mousePressed(){

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

