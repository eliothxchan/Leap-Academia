var currentPage = "index";
$(document).ready(function () {
  navigate();
});

function navigate() {
  $("#Start").on("click", function () {
    window.location.href = "circuit_parts.html";
  });

  $("#next").on("click", function () {
    window.location.href = "ohmslaw.html";
  });

  $("#exercises").on("click", function () {
    window.location.href = "dragtest.html";
  });
}