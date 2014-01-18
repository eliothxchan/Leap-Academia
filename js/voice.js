function recordVoice() {
  var recognizing = false;

  if (!('webkitSpeechRecognition' in window)) {
    console.log("Not there");
  } else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.start();

    console.log("successful");

    recognition.onstart = function () {

    };
    recognition.onresult = function (event) {
      recognition.onresult = function (event) {
        var interim_transcript = '';
        var final_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        var temp = [final_transcript, interim_transcript];
        console.log(temp);
        return temp;
      };
    }

    recognition.onerror = function (event) {
      console.log(event);
    };
    recognition.onend = function () {};

    function startButton(event) {
      final_transcript = '';

    }

  };

}