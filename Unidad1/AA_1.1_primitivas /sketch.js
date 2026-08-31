function setup() {
  createCanvas(400, 500);
  
// ANTENAS 
 background('blue');
  stroke(255, 204, 0);      
  strokeWeight(4);         
  line(180, 130, 160, 90);   
  line(220, 130, 240, 90);

  // CABEZA Y CUERPO  
 fill(71, 85, 105);
  stroke(148, 163, 184);     
  strokeWeight(2);
  rect(150, 130, 100, 80, 10);

   fill(51, 65, 85);          
  rect(130, 220, 140, 120, 5);  
  
  //  OJOS 
  fill(56, 189, 248); 
  stroke(255);               
  strokeWeight(2);
  ellipse(175, 165, 24, 24); 
  ellipse(225, 165, 24, 24); 

  // CUELLO / DETALLE (TRIÁNGULO)
  fill(239, 68, 68);     
  stroke(185, 28, 28);
  strokeWeight(1);
  triangle(200, 220, 179, 210, 219, 210);

// DETALLE EXTRA: BOCA 
  stroke(255, 204, 0);
  strokeWeight(3);
  line(180, 190, 220, 190);
}


