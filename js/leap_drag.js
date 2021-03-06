var controller = new Leap.Controller({
  enableGestures: true
});

var isHoldingObject = null;

var frame;

// Global screenTap arrays

var width = $(window).width();
var height = $(window).height();

var width_grid = width / 5;
var height_grid = height / 5;

var screenTaps = [];
var SCREENTAP_LIFETIME = 1;
var SCREENTAP_START_SIZE = 30;
var components = [];

function component(top, left, width, height, id) {
  this.top = top;
  this.left = left;
  this.width = width_grid;
  this.height = height_grid;
  this.id = id;
  //this.orientation = 0;

}




$(document).on('ready', function () {

  $("#invisible").css("width", width_grid + "px");
  $("#invisible").css("height", height_grid + "px");
  $("#invisible").css("top", height_grid + 10 + "px");
  $("#invisible").css("left", width_grid + 10 + "px");
  $("#loop").css("top", height_grid + 10 + "px");
  $("#loop").css("left", 2 * width_grid + 10 + "px");
  
  $("#line1").css("left", 3 * width_grid + 10 + "px");
  $("#line1").css("top", 1.5*height_grid + 10 + "px");
  
  $("#line2").css("top", 1.5*height_grid + 10 + "px");
  $("#line2").css("left", 3 * width_grid + 210 + "px");
  
  
  $("#line3").css("width", 3.5 * width_grid - 8 + "px");
  $("#line3").css("top", 1.5*height_grid + 110 + "px");
  $("#line3").css("left",height_grid/2 + 15 + "px");
  
  $("#line4").css("left", 3 * width_grid + 10 - 200 - 2*width_grid + "px");
  $("#line4").css("top", 1.5*height_grid + 10 + "px");  
  
  $("#line5").css("top", 1.5*height_grid + 10 + "px");
  $("#line5").css("left", height_grid/2 + 15 + "px");


  $('body div').each(function () {
    if ($(this).hasClass("component")) {
      console.log($(this));
      var temp = new component(parseInt($(this).css("top")), parseInt($(this).css("left")), width_grid, height_grid, $(this).attr('id'));
      $(this).css("width", width_grid + "px");
      $(this).css("height", height_grid + "px");
      components.push(temp);
    }
  });

  // Tells the controller what to do every time it sees a frame
  controller.on('frame', function (data) {

    // Assigning the data to the global frame object
    frame = data;

    // Clearing the drawing from the previous frame

    for (var i = 0; i < frame.gestures.length; i++) {

      var gesture = frame.gestures[i];

      var type = gesture.type;

      switch (type) {

      case "screenTap":
        onScreenTap(gesture);
        break;

    case "circle":
      if(gesture.state == "stop"){
          onCircle(gesture);
      }
      break;
      }

    }

    updateScreenTaps();

    var hand, handPos;
    if (frame.hands.length > 0) {
      hand = frame.hands[0];


      var finger, fingerPos;
      //iterate through fingers
      if (hand.fingers.length > 0) {
        finger = hand.fingers[0];
        fingerPos = leapToScene(finger.tipPosition);

        $('#direction').css("top", fingerPos[1]);
        $('#direction').css("left", fingerPos[0]);
        if (isHoldingObject != null) {
          if (fingerPos[0] > (width - isHoldingObject.width)) {
            fingerPos[0] = width - isHoldingObject.width;
          } else if (fingerPos[0] < 0) {
            fingerPos[0] = 0;
          }
          if (fingerPos[1] > (height - isHoldingObject.height)) {
            fingerPos[1] = height - isHoldingObject.height;
          } else if (fingerPos[1] < 0) {
            fingerPos[1] = 0;
          }

          $('#' + isHoldingObject.id).css("top", fingerPos[1]);
          for (var i = 0; i < components.length; i++) {
            if (isHoldingObject.id == components[i].id)
              components[i].top = fingerPos[1];
          }
          $('#' + isHoldingObject.id).css("left", fingerPos[0]);
          for (var i = 0; i < components.length; i++) {
            if (isHoldingObject.id == components[i].id)
              components[i].left = fingerPos[0];
          }




          /*$('#pointer').css("top", fingerPos[1] + isHoldingObject.height / 2);
          $('#pointer').css("left", fingerPos[0] + isHoldingObject.width / 2);*/
          //console.log("x : " + fingerPos[1] + " y: " + fingerPos[0]);
        }
      }

    }

  });

  $('#generateComponent').on("click", function () {
    var name = "items" + components.length;
    var $d = $("<div class='component'></div>").attr('id', name);
    $d.css("position", "absolute");
    $d.css("top", "0px");
    $d.css("left", "0px");
    $d.css("height", height_grid + "px");
    $d.css("width", width_grid + "px");
    $d.css("background-image", "url(\"../images/resistor.png\")");
    $d.css("background-size", "200px 100px");
    $d.css("background-repeat", "no-repeat");
    var str = parseInt(recordVoice());
    $d.html(str+" Ohms");
    $('body').append($d);
    var temp = new component(parseInt($("#" + name).css("top")), parseInt($("#" + name).css("left")), $("#" + name).width(), $("#" + name).height(), $("#" + name).attr('id'));
    components.push(temp);
    console.log("Generated component");
  });

  // Get frames rolling by connecting the controller
  controller.connect();
});



/*
      
      The leapToScene function takes a position in leap space 
      and converts it to the space in the canvas.
      
      It does this by using the interaction box, in order to 
      make sure that every part of the canvas is accesible 
      in the interaction area of the leap

    */

function leapToScene(leapPos) {

  // Gets the interaction box of the current frame
  var iBox = frame.interactionBox;

  // Gets the left border and top border of the box
  // In order to convert the position to the proper
  // location for the canvas
  var left = iBox.center[0] - iBox.size[0] / 2;
  var top = iBox.center[1] + iBox.size[1] / 2;

  // Takes our leap coordinates, and changes them so
  // that the origin is in the top left corner 
  var x = leapPos[0] - left;
  var y = leapPos[1] - top;

  // Divides the position by the size of the box
  // so that x and y values will range from 0 to 1
  // as they lay within the interaction box
  x /= iBox.size[0];
  y /= iBox.size[1];

  // Uses the height and width of the canvas to scale
  // the x and y coordinates in a way that they 
  // take up the entire canvas
  x *= width;
  y *= height;

  // Returns the values, making sure to negate the sign 
  // of the y coordinate, because the y basis in canvas 
  // points down instead of up
  return [x, -y];

}

 function onCircle(gesture) {

     var pos = leapToScene(gesture.center);
     var radius = gesture.radius;
     isHoldingObject.orientation = 0;

     var clockwise = false;

     if (gesture.normal[2] <= 0)
         clockwise = true;

     if (isHoldingObject != null && gesture.progress > 1 && gesture.progress < 4) {
         if (clockwise) {
             console.log("Rotate clockwise by " + (isHoldingObject.orientation + 90));
             $('#' + isHoldingObject.id).rotate({
                 angle: (isHoldingObject.orientation + 90)
             });
             if (isHoldingObject.orientation + 90 >= 360)
                 isHoldingObject.orientation = 0;
             else
                 isHoldingObject.orientation += 90;

         } else {
             console.log("Rotate counterclockwise by " + (Number(isHoldingObject.orientation) + 90));
             $('#' + isHoldingObject.id).rotate({
                 angle: (isHoldingObject.orientation + 90)
             });
             if (isHoldingObject.orientation - 90 <= -360) {
                 isHoldingObject.orientation = 0;
             } else
                 isHoldingObject.orientation -= 90;
         }
     }
   }

function onScreenTap(gesture) {

  var pos = leapToScene(gesture.position);

  var time = frame.timestamp;

  $('#pointer').css("top", pos[1]);
  $('#pointer').css("left", pos[0]);
  screenTaps.push([pos[0], pos[1], time]);

  if (isHoldingObject == null) {
    for (var i = 0; i < components.length; i++) {
      var element = components[i];

      if (pos[1] >= element.top && pos[1] < element.top + element.height) {
        if (pos[0] >= element.left && pos[0] < element.left + element.width) {
          isHoldingObject = new component(element.top, element.left, element.width, element.height, element.id);
        }
      }
    }
  } else {
    console.log("Positions: " + pos[1] + " " + pos[0]);
    var closestPoint = closestSnapPoint(pos[1], pos[0]);

    $('#' + isHoldingObject.id).css("top", closestPoint.top);
    for (var i = 0; i < components.length; i++) {
      if (isHoldingObject.id == components[i].id)
        components[i].top = closestPoint.top;
    }
    $('#' + isHoldingObject.id).css("left", closestPoint.left);
    for (var i = 0; i < components.length; i++) {
      if (isHoldingObject.id == components[i].id)
        components[i].left = closestPoint.left;
    }

    /*$('#pointer').css("top", pos[1] + isHoldingObject.height / 2);
    $('#pointer').css("left", pos[0] + isHoldingObject.width / 2);*/

    isHoldingObject = null;


  }
  console.log(parseInt($('#test').css("top")) + "  " + parseInt($("#invisible").css("top")));
  if (parseInt($('#test').css("top")) >= parseInt($("#invisible").css("top")) - 5 && parseInt($('#test').css("top")) <= parseInt($("#invisible").css("top")) + 5 && parseInt($('#test').css("left")) >= parseInt($("#invisible").css("left")) - 5 && parseInt($('#test').css("left")) <= parseInt($("#invisible").css("left")) + 5) {
    $("#answer").css("border-color", "green");
    $("#answer").html("That's correct! A 10 Ohm resistor will create a current of 1 Ampere through the circuit.");
    console.log("REACHED");
  }
}

function updateScreenTaps() {

  for (var i = 0; i < screenTaps.length; i++) {

    var screenTap = screenTaps[i];
    var age = frame.timestamp - screenTaps[i][2];
    age /= 1000000;

    if (age >= SCREENTAP_LIFETIME) {
      screenTaps.splice(i, 1);
    }

  }

}