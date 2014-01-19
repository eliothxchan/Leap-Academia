$(document).ready(function(){
  $('#voltageName').css("left", width_grid + 10 + "px");
  $('#voltageName').css("top", 2*height_grid + 10 + "px");
  $('#currentName').css("left", width_grid + 10 + "px");
  $('#currentName').css("top", 3*height_grid + 10 + "px");
  $('#resistanceName').css("left", width_grid + 10 + "px");
  $('#resistanceName').css("top", 4*height_grid + 10 + "px");

  
  $('#resistanceAnswer, #currentAnswer, #voltageAnswer').css("width", width_grid);
  $('#resistanceAnswer, #currentAnswer, #voltageAnswer').css("height", height_grid);
  
  $('#voltageAnswer').css("top", 2*height_grid + 10 + "px");
  $('#voltageAnswer').css("left", 2*width_grid + 10 + "px");
  $('#currentAnswer').css("left", 2*width_grid + 10 + "px");
  $('#currentAnswer').css("top", 4*height_grid + 10 + "px");
  $('#resistanceAnswer').css("left", 2*width_grid + 10 + "px");
  $('#resistanceAnswer').css("top", 3*height_grid + 10 + "px");
  
  $('#voltage').css("top", height_grid + 10 + "px ");
  $('#resistance').css("top", 2*height_grid + 10 + "px ");
  $('#current').css("top", 3*height_grid + 10 + "px ");
  
  $('#description').css("top", height_grid + 10 + "px ");
  $('#description').css("left", 8*height_grid + 10 + "px ");
  
});