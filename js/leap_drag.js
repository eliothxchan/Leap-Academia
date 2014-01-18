   $(document).on('ready', function () {

     var width = $(window).width();
     var height = $(window).height();



     // Creating a global Frame variable that we can access
     // throughout the program
     var frame;

     // Global screenTap arrays

     var isHoldingObject = false;
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

       screenTaps.push([pos[0], pos[1], time]);

       isHoldingObject = !isHoldingObject;
       console.log(isHoldingObject);
       console.log("x : " + pos[0] + " y: " + pos[1]);

       if (pos[0] > (width - $("#test").width())) {
         pos[0] = width - $("#test").width();
       } else if (pos[0] < 0) {
         pos[0] = 0;
       }
       if (pos[1] > (height - $("#test").height())) {
         pos[1] = height - $("#test").height();
       } else if (pos[1] < 0) {
         pos[1] = 0;
       }
       $("#test").css("top", pos[1]);
       $("#test").css("left", pos[0]);


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
     var controller = new Leap.Controller({
       enableGestures: true
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


         }

       }
       updateScreenTaps();


     });

     // Get frames rolling by connecting the controller
     controller.connect();
   });