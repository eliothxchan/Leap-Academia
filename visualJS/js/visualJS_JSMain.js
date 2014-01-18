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
        $(beingHeld).css("top", y);
        //Set X coord
        $(beingHeld).css("left", x);

        $(".js_block").click(function () {
            nest(this, beingHeld);
            beingHeld = "";
            $(beingHeld).removeClass("moveable");

        });
        $("body").click(function () {
            $("body").unbind();
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


function nest(parent, child) {
//  Check that we're not appending an element to itself
    if (parent === child || parent.nestedTo === child) {
        return;
    }
    
    $(parent).append(child);
    $(parent).removeClass("moveable");
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