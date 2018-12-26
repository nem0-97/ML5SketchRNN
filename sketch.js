//TODO: Add array of arrays of stroke, each array of strokes represents one sketch from the model
        //in setStroke just do something like while(move.pen!='end') push strokes into temp arr, then push that array into array of sketches
        //in draw for sketch in sketches draw it(have second array starts, for each sketch it stores x and y to start drawing from)
//OR make sketch object that has startX, startY, strokes

let model;
let x,y;
let down=true;
let move=null;

function setup(){
  createCanvas(innerWidth,innerHeight);
  background(0);
}

function start(){
  move=null;
  down=true;
  x=random(width);
  y=random(height);
  model=ml5.SketchRNN(document.getElementById("model_selector").value,modelLoaded);//Load pretrained ML5 model that generates strokes
}

function modelLoaded(){
  console.log('Model has been loaded.');
  model.reset();//make sure model is starting new sketch
  model.generate(setStroke);//generate first stroke
}

function setStroke(err,strok){
  if(err){
    console.log(err);
    move=null;//so it does not keep repeating last stroke got
  }
  else{
    move=strok
  }
}

function draw(){
  if(move!=null){
    let x1=x+move.dx*.2;
    let y1=y+move.dy*.2;
    if(down){//if the pen is down for this strok draw a line along its movement
      strokeWeight(2);
      line(x,y,x1,y1);
    }
    x=x1;//move the pen
    y=y1;
    down=(move.pen=='down');//check if pen should be down for next stroke
    if(move.pen=='end'){
      down=true;
      model.reset();//make sure model is starting new sketch
      stroke(random(255),random(255),random(255));
      x=random(width);
      y=random(height);
    }
    model.generate(setStroke);//generate next stroke(maybe move this stuff somewhere else to avoid somewhat recursive setStroke)
  }
}
