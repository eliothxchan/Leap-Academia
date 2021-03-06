$(document).ready(function () {
  var controller = new Leap.Controller({
    enableGestures: true
  });

  var canvas = document.getElementById("surface");
  var context = canvas.getContext('2d');

  controller.on('frame', function (data) {

    frame = data;

    c.clearRect(0, 0, width, height);

  });

  controllerFunctions(controller);
  
  handGestures(controller, context, canvas);
  
  controller.connect();
});

function controllerFunctions(controller) {
  controller.on('connect', function () {
    console.log('Successfully connected.');
  });

  controller.on('deviceConnected', function () {
    console.log('A Leap device has been connected.');
  });

  controller.on('deviceDisconnected', function () {
    console.log('A Leap device has been disconnected.');

  });
}

/*function leapGestures(controller, canvas) {
  controller.on('frame', function (frame) {
    var numberofFingers = frame.fingers.length;
    var width = canvas.width;
    var height = canvas.height;
    canvas.fillText(numberofFingers, width / 2, height / 2);
    canvas.textAlign = 'center';
    //c.clearRect(0, 0, width, height);

  });
}

function numberoffingers(controller) {
  controller.on('frame', function (frame) {
    return frame.fingers.length;
  });
}*/

function handGestures(controller, c, canvas) {
  controller.on('animationFrame', function (frame) {
    /*
				var numFingers = frame.fingers.length;
				c.font = "30px Arial";
				c.textAlign = 'center';
				c.textBaseline = 'middle';
				c.fillText(numFingers, (canvas.width/2), (canvas.height/2));
				*/
    c.clearRect(0, 0, canvas.width, canvas.height);

    //iterate through hands
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];
      var handPos = leapToScene(frame, hand.palmPosition);


      //iterate through fingers
      for (var j = 0; j < hand.fingers.length; j++) {
        var finger = hand.fingers[j];
        var fingerPos = leapToScene(frame, finger.tipPosition);

        //connections of fingers
        c.strokeStyle = "#FFA040";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(handPos[0], handPos[1]);
        c.lineTo(fingerPos[0], fingerPos[1]);
        c.closePath();
        c.stroke();

        //draw fingers
        c.strokeStyle = "#39AECF";
        c.lineWidth = 5;
        c.beginPath();
        c.arc(fingerPos[0], fingerPos[1], 20, 0, Math.PI * 2);
        c.closePath();
        c.stroke();

      }

      //draw hands
      c.fillStyle = "#FF5A40";
      c.beginPath();
      c.arc(handPos[0], handPos[1], 40, 0, Math.PI * 2);
      c.closePath();
      c.fill();

    }
  });

  function leapToScene(frame, leapPos) {
    //size of interaction box
    var iBox = frame.interactionBox;

    //dimensions of box
    var top = iBox.center[1] + iBox.size[1] / 2;
    var left = iBox.center[0] - iBox.size[0] / 2;

    //x and y positions of hands
    var x = (leapPos[0] - left);
    var y = (leapPos[1] - top)

    //scale to interaction box size
    x /= iBox.size[0];
    y /= iBox.size[1];

    //scale to screen
    x *= canvas.width;
    y *= canvas.height;

    return [x, -y];
  }
}