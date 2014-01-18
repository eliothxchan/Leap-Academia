$(document).ready(function () {

  var width = $(window).width();
  var graph = new joint.dia.Graph;

  var paper = new joint.dia.Paper({
    el: $('#myHolder'),
    width: width,
    height: 500,
    model: graph
  });

  var rect = new joint.shapes.basic.Rect({
    position: {
      x: 100,
      y: 30
    },
    size: {
      width: 100,
      height: 30
    },
    attrs: {
      rect: {
        fill: 'blue'
      },
      text: {
        text: 'Voltage',
        fill: 'white'
      }
    }
  });
  
  console.log(rect);

  var rect2 = rect.clone();

  rect.attributes.attrs.text.text = "Resistance";
  
  rect2.translate(450);
  rect2.attributes.attrs.rect.fill = "#FFFF00";
  rect2.attributes.attrs.text.fill = "#333";

  var link = new joint.dia.Link({
    source: {
      id: rect.id
    },
    target: {
      id: rect2.id
    }
  });

  graph.addCells([rect, rect2, link]);
});