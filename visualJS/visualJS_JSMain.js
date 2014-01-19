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
    this.HTML.create();
    return this.HTML;
    //insert gesture event for mpickup
}

function move(element) {
    //Make position absolute
    $(element).addClass("moveable");

    //Update position to mouse position
    $("body").mousemove(function (event) {
        var beingHeld = element;
        console.log(beingHeld.id);

        var x = event.clientX;
        var y = event.clientY;
        //Set Y coord
        $(element).css("top", y);
        //Set X coord
        $(element).css("left", x);

        $(".js_block").click(function () {
            nest(this, beingHeld);
            beingHeld = "";
            x = Number(x);
            y = Number(y);
            //            $(element).removeClass("moveable");

        });
        $("body").click(function () {
            beingHeld = "";
            x = Number(x);
            y = Number(y);
            $('body').unbind();
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
    case "whileLoop":
        return "While Loop";
    case "function":
        return "Function";
    }
}

function link(ele1, ele2) {
    var xy1 = [Number(ele1.style.top.slice(0, -2)),
               Number(ele1.style.left.slice(0, -2))];
    var xy2 = [Number(ele2.style.top.slice(0, -2)),
               Number(ele2.style.left.slice(0, -2))];
    console.log(xy1, xy2);
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    document.body.appendChild(canvas);

    context.beginPath();
    context.moveTo(xy1[0], xy1[1]);
    context.lineTo(xy2[0], xy2[1]);
    context.stroke();
}


function nest(parent, child) {
    //  Check that we're not appending an element to itself
    if (parent === child || parent.nestedTo === child) {
        return;
    }

    $(parent).append(child);
    //$(parent).removeClass("moveable");
    $(child).nested = true;
    $(child).nestedTo = parent;
    $(child).removeClass("moveable");
}

//function getNesting(){
//    var PesudoDOM = $(".js_blocks");
//    var nesting = [];
//    function forRealGetTheNesting(element){
//        
//