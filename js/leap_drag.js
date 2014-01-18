   $(document).on('ready', function () {

     var controller = new Leap.Controller({
       enableGestures: true
     });

     drag("#test", controller);

     // Get frames rolling by connecting the controller
     controller.connect();
   });

   function drag(element, controller) {
     var width = $(window).width();
     var height = $(window).height();



     // Creating a global Frame variable that we can access
     // throughout the program
     var frame;

     // Global screenTap arrays

     var isHoldingObject = null;
     var screenTaps = [];
     var SCREENTAP_LIFETIME = 1;
     var SCREENTAP_START_SIZE = 30;


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




     function onScreenTap(gesture) {

       var pos = leapToScene(gesture.position);

       var time = frame.timestamp;

       console.log(pos);

       $('#pointer').css("top", pos[1]);
       $('#pointer').css("left", pos[0]);


       screenTaps.push([pos[0], pos[1], time]);
       console.log(pos[1] + ", " + parseInt($(element).css("top")) + ", " + parseInt($(element).css("top")) + $(element).height());
       if (pos[1] >= parseInt($(element).css("top")) && pos[1] < parseInt($(element).css("top")) + $(element).height() && isHoldingObject == null) {

         if (pos[0] >= parseInt($(element).css("left")) && pos[0] < parseInt($(element).css("left")) + $(element).width()) {
           isHoldingObject = element;
         } else {
           isHoldingObject = null;
         }
       } else {
         isHoldingObject = null;
       }
       console.log(isHoldingObject);



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


     // Creates our Leap Controller

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
           if (isHoldingObject != null) {
             if (fingerPos[0] > (width - $(element).width())) {
               fingerPos[0] = width - $(element).width();
             } else if (fingerPos[0] < 0) {
               fingerPos[0] = 0;
             }
             if (fingerPos[1] > (height - $(element).height())) {
               fingerPos[1] = height - $(element).height();
             } else if (fingerPos[1] < 0) {
               fingerPos[1] = 0;
             }
             $(element).css("top", fingerPos[1]);
             $(element).css("left", fingerPos[0]);
             //console.log("x : " + fingerPos[1] + " y: " + fingerPos[0]);
           }
         }

       }


     });

     /* controller.on('animationFrame', function (data) {
       frame = data;
       //iterate through hands
      var hand, handPos;
       if (frame.hands.length > 0) {
         hand = frame.hands[0];
         handPos = leapToScene(frame, hand.palmPosition);


         var finger, fingerPos;
         //iterate through fingers
         if (hand.fingers.length > 0) {
           finger = hand.fingers[0];
           fingerPos = leapToScene(frame, finger.tipPosition);
           console.log(fingerPos);
         }
         if (isHoldingObject) {
           $(element).css("top", fingerPos[1]);
           $(element).css("left", fingerPos[0]);
           console.log("x : " + fingerPos[1] + " y: " + fingerPos[0]);
         }
       }
     });*/
   }