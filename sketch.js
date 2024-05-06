let video;
let poseNet;
let poses = [];
let bubbles = [];
let eyeDistance = 0;
let bubbleFrequency = 1;
let play = 1;

function preload() {
  popped = loadSound("pop-sound.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
    play = poses.length > 0 ? 1 : 0; 
    

    if (poses.length > 0) {
      let pose = poses[0].pose;
      let leftEye = pose.keypoints[1].position;
      let rightEye = pose.keypoints[2].position;
      eyeDistance = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
      bubbleFrequency = map(eyeDistance, 0, width, 0.01, 0.5);
    }
    // Find the face in the poses
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        if (keypoint.score > 0.2) {
          // Create a new bubble based on frequency
          if (random(1) < bubbleFrequency) {
            let bubbleSize = random(20, 50); // Randomize bubble size
            let bubbleColor = getRandomBubbleColor(); // Get a random bubble color
            let bubble = {
              x: random(keypoint.position.x - 20, keypoint.position.x + 20),
              y: random(keypoint.position.y - 20, keypoint.position.y + 20),
              size: bubbleSize,
              speedX: random(-1, 1),
              speedY: random(-1, 1),
              color: bubbleColor,
              lifetime: millis() + 5000, // Set lifetime to 3 seconds from current time
            };
            bubbles.push(bubble);
          }
        }
      }
    }
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function draw() {
  if (!serialActive) {
    fill("#0876FF");
    stroke("#B2B2B2");
    textSize(16);
    text("Press Space Bar to select Serial Port", 20, 30);
  } else {
    fill("#0876FF");
    textSize(16);
    text("Connected", 29, 30);
    // Flip the video horizontally
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);

    // Draw the bubbles
    for (let i = 0; i < bubbles.length; i++) {
      let bubble = bubbles[i];
      fill(bubble.color[0], bubble.color[1], bubble.color[2], 100);
      noStroke();
      ellipse(bubble.x, bubble.y, bubble.size, bubble.size);
      // Update the bubble position
      bubble.x += bubble.speedX;
      bubble.y += bubble.speedY;
      // Check if the bubble is off the screen or expired
      if (
        bubble.x < 0 ||
        bubble.x > width ||
        bubble.y < 0 ||
        bubble.y > height ||
        millis() > bubble.lifetime
      ) {
        bubbles.splice(i, 1);
        popped.play();
        i--;
      }
    }
  }
}

// Resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key == " ") {
    // important to have in order to start the serial connection!!
    setUpSerial();
  }
}

// Function to get a random bubble color
function getRandomBubbleColor() {
  // Define a color palette resembling bubble colors
  let bubbleColors = [
    [150, 217, 255], // Light blue
    [255, 196, 235], // Light pink
    [255, 235, 156], // Light yellow
    [255, 212, 156], // Light orange
    [185, 255, 219], // Light green
  ];
  // Return a random color from the palette
  return random(bubbleColors);
}

function readSerial(data) {
  if (data != null) {
    let sendToArduino = play + "\n";
    writeSerial(sendToArduino);
  }
}
