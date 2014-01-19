//controller object for Leap Motion hardware
var controller = new Leap.Controller({
  enableGestures: true
});

//checks whether we are currently holding onto an object, and if so,
//what that object is
var isHoldingObject = null;

//global frame variable
var frame;
//global interpreted results from Google Web Speech
var global_final;

//size of windows
var width = $(window).width();
var height = $(window).height();

//sectioning off the window into parts such that we can create
//a grid for our circuit pieces to snap to
var width_grid = width / 5;
var height_grid = height / 5;

//screen tap gesture array and associated variables
var screenTaps = [];
var SCREENTAP_LIFETIME = 1;
var SCREENTAP_START_SIZE = 30;

//list of manipulatible circuit components
var components = [];

//object definition of circuit component
function component(top, left, width, height, id) {
  this.top = top;
  this.left = left;
  this.width = width_grid;
  this.height = height_grid;
  this.id = id;
}

//checks whether the given point is in a component
function isInComponent(cursor_top, cursor_left, component_var) {

  var c_top = parseInt($('#'+component_var.id).css("top"));
  var c_height = parseInt($('#'+component_var.id).css("height"));
  var c_left = parseInt($('#'+component_var.id).css("left"));
  var c_width = parseInt($('#'+component_var.id).css("width"));

  if (cursor_top >= c_top && cursor_top <= c_top+c_height && cursor_left >= c_left && cursor_left <= c_left+c_width) {
    return true;
  }
  else {
    return false;
  }
}

//checks whether the two components occupy the same space
function occupySameSpace(id_1, id_2) {

  top_1 = parseInt($('#'+id_1).css("top"));
  top_2 = parseInt($('#'+id_2).css("top"));
  left_1 = parseInt($('#'+id_1).css("left"));
  left_2 = parseInt($('#'+id_2).css("left"));

  if (top_1 >= top_2 - 5 && top_1 <= top2 + 5 && left_1 >= left_2 - 5 && left_1 <= left_2 + 5) {
    return true;
  }
  else {
    return false;
  }
}

//begin document
$(document).on('ready', function () {

  //declaration of grey drop-resistor area
  $("#invisible").css("width", width_grid + "px");
  $("#invisible").css("height", height_grid + "px");
  $("#invisible").css("top", height_grid + 10 + "px");
  $("#invisible").css("left", width_grid + 10 + "px");

  //declaration of voltage source div
  $("#loop").css("top", height_grid + 10 + "px");
  $("#loop").css("left", 2 * width_grid + 10 + "px");

  //declaration of wires connecting circuit components together
  //purely visual, they have no actual functionality
  $("#line1").css("left", 3 * width_grid + 10 + "px");
  $("#line1").css("top", 1.5 * height_grid + 10 + "px");

  $("#line2").css("top", 1.5 * height_grid + 10 + "px");
  $("#line2").css("left", 3 * width_grid + 210 + "px");


  $("#line3").css("width", 3.5 * width_grid - 8 + "px");
  $("#line3").css("top", 1.5 * height_grid + 110 + "px");
  $("#line3").css("left", height_grid / 2 + 15 + "px");

  $("#line4").css("left", 3 * width_grid + 10 - 200 - 2 * width_grid + "px");
  $("#line4").css("top", 1.5 * height_grid + 10 + "px");

  $("#line5").css("top", 1.5 * height_grid + 10 + "px");
  $("#line5").css("left", height_grid / 2 + 15 + "px");


  //translate each div into a related component
  //give them precalculated heights and widths
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

    //calls certain event listeners based on gestures tracked
    for (var i = 0; i < frame.gestures.length; i++) {

      var gesture = frame.gestures[i];
      var type = gesture.type;

      switch (type) {

        case "screenTap":
          onScreenTap(gesture);
          break;
      }
    }

    updateScreenTaps();

    //check whether hands exist
    var hand, handPos;
    if (frame.hands.length > 0) {
      hand = frame.hands[0];

      var finger, fingerPos;
      //iterate through fingers
      if (hand.fingers.length > 0) {
        finger = hand.fingers[0];
        fingerPos = leapToScene(finger.tipPosition);

        //cursor movement
        $('#direction').css("top", fingerPos[1]);
        $('#direction').css("left", fingerPos[0]);

        //logic for picking up objects
        if (isHoldingObject != null) {
          if (fingerPos[0] > (width - isHoldingObject.width)) {
            fingerPos[0] = width - isHoldingObject.width;
          } 
          else if (fingerPos[0] < 0) {
            fingerPos[0] = 0;
          }
          if (fingerPos[1] > (height - isHoldingObject.height)) {
            fingerPos[1] = height - isHoldingObject.height;
          } 
          else if (fingerPos[1] < 0) {
            fingerPos[1] = 0;
          }

          //move component along with cursor
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
        }
      }
    }
  });

  //button that generates components based on speech
  $('#generateComponent').on("click", function () {
    recognition.start();
  });

  // Get frames rolling by connecting the controller
  controller.connect();
});


//scales position based on interaction box size and screen size
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


//event listener for detecting screen tap
function onScreenTap(gesture) {

  var pos = leapToScene(gesture.position);
  var time = frame.timestamp;

  //move cursor
  $('#pointer').css("top", pos[1]);
  $('#pointer').css("left", pos[0]);
  screenTaps.push([pos[0], pos[1], time]);

  //if we're not holding an object, pick up one if we click in the right spot
  if (isHoldingObject == null) {

    for (var i = 0; i < components.length; i++) {

      var element = components[i];

      if (isInComponent(pos[1], pos[0], element) {

          isHoldingObject = new component(element.top, element.left, element.width, element.height, element.id);

      }
      
    }

  }
  //else, drop object at closest position such that it will snap to our grid
  else {

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
    isHoldingObject = null;

  }

  console.log(parseInt($('#test').css("top")) + "  " + parseInt($("#invisible").css("top")));

  //if we drop the proper resistor in the right place, we get the answer correct
  if (parseInt($('#test').css("top")) >= parseInt($("#invisible").css("top")) - 5 && parseInt($('#test').css("top")) <= parseInt($("#invisible").css("top")) + 5 && parseInt($('#test').css("left")) >= parseInt($("#invisible").css("left")) - 5 && parseInt($('#test').css("left")) <= parseInt($("#invisible").css("left")) + 5) {
      
      if (parseInt(global_final) == 10) {

        $("#answer").css("border-color", "green");
        $("#answer").html("That's correct! A 10 Ohm resistor will create a current of 1 Ampere through the circuit.");
        console.log("REACHED");

    }

  }

}

//update some variables related to screen taps
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

//begin Web Speech Recognition
if (!('webkitSpeechRecognition' in window)) {

  console.log("Not there");

} 
else {

  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  console.log("successful");

  //on start event listener
  recognition.onstart = function () {
    console.log("Started");
  };

  //on receiving result event listener
  recognition.onresult = function (event) {

    var interim_transcript = '';
    var final_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {

      if (event.results[i].isFinal) {

        final_transcript += event.results[i][0].transcript;

      } 
      else {

        interim_transcript += event.results[i][0].transcript;

      }

    }

    //set global var equal to translated words
    global_final = final_transcript;
    //create new component based on word
    createNewItem();
    components.push(temp);
    console.log("Generated component");

  }

  //stop listening for speech
  recognition.stop();

};

//on error event listener
recognition.onerror = function (event) {

  console.log(event);

};

//on ending event listener
recognition.onend = function () {

  console.log("Voice recognition end.");

};

//starting listeners
function startButton(event) {

  recognition.start();
  final_transcript = '';

}

//create new circuit component
function createNewItem() {

  var str = parseInt(global_final);

  if (!isNaN(str) && str != null) {

    var name = "items" + components.length;
    var $d = $("<div class='component'></div>").attr('id', name);
    $d.css("position", "absolute");
    $d.css("top", "0px");
    $d.css("left", "0px");
    $d.css("height", height_grid + "px");
    $d.css("width", width_grid + "px");
    $d.css("background-image", "url(\"../LeapMotion/images/resistor.png\")");
    $d.css("background-size", "200px 100px");
    $d.css("background-repeat", "no-repeat");
    $d.css("border", "2px solid black");
    $d.css("background-position", "center");
    $d.css("text-align", "center");
    $d.html(str + " Ohms");
    $('body').append($d);

    var temp = new component(parseInt($("#" + name).css("top")), parseInt($("#" + name).css("left")), $("#" + name).width(), $("#" + name).height(), $("#" + name).attr('id'));

  }

}