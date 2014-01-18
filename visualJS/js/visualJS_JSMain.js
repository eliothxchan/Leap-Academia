function Block(element, type) {
    this.HTML = document.createElement(element);
    this.HTML.className = "js_block";
    this.HTML.id = type;

    //Initialize nesting
    this.HTML.nested = false;
    this.HTML.nestedTo = "";

    //Allow for moving elements
    this.HTML.onclick = function () {
        move(this);
    };
    this.HTML.innerHTML = outputName(this.HTML.id);
    this.HTML.create = function () {
        //Place element in the DOM
        document.body.appendChild(this);
    };
    return this.HTML;
    //insert gesture event for mpickup
}

function move(element){
    $(element).css("position", "absolute");
    var beingHeld = element;
    console.log(beingHeld);
    $('body').mousemove(function(event){
        var x = event.clientX
        var y = event.clientY;
        $(beingHeld).css("top", y);
        $(beingHeld).css("left", x);

        $(".js_block").click(function(){
            nest(this, beingHeld);
            beingHeld = "";
            x = Number(x);
            y = Number(y);
        });

        $('body').click(function(event){
            x = Number(x);
            y = Number(y);
            beingHeld = "";
        });
    });
}

function outputName(type) {
    switch (type) {
    case "forLoop":
        return "For Loop";
    case "if":
        return "If";
    case "else":
        return "Else";
    }
}

//function link(ele1, ele2) {
//    var pos1 = [ele1.style.left, ele1.style.top];
//    var pos2 = [ele2.style.left, ele2.style.top];
//    var canvas = document.createElement('canvas');
//    document.body.appendChild(canvas);
//    if (canvas.getContext) {
//        var line = canvas.getContext("2d");
//        line.moveTo(pos1[0], pos1[1]);
//        line.lineTo(pos2[0], pos2[1]);
//    }
//}


function nest(parent, child) {
//  Check that we're not appending an element to itself
    if (parent === child || parent.nestedTo === child) {
        return;
    }
    
    $(parent).append(child);
    $(parent).css("position", "relative");
    $(child).nested = true;
    $(child).nestedTo = parent;
    $(child).css("position", "relative");
}

//function getNesting(){
//    var PesudoDOM = $(".js_blocks");
//    var nesting = [];
//    function forRealGetTheNesting(element){
//        
//