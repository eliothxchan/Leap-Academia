var recognizing = false;

if (!('webkitSpeechRecognition' in window)) {
  console.log("Not there");
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
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
      console.log(final_transcript);
      console.log("Interim transcript");
      final_span.innerHTML = final_transcript;
      interim_span.innerHTML = interim_transcript;
    };
  }

recognition.onerror = function (event) {
  console.log(event);
};
recognition.onend = function () {};

function startButton(event) {
  final_transcript = '';
  recognition.lang = "en-US";
  recognition.start();
}

};