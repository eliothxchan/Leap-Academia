var recognition = new webkitSpeechRecognition();
recognition.lang = "en";

function listen() {
    var result = "";
    recognition.start();
    recognition.onresult = function (event) {
        for (var i = event.resultIndex; i <             event.results.length; ++i) {
            if (event.results[i].isFinal) {
                result = event.results[i];
            }
        }
    };
    recognition.stop();
    return result;
}