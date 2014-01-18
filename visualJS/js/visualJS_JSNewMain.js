function Block(element, kind){
    this.HTML = document.createElement(element);
    this.HTML.slots = 1;
    this.HTML.id = kind;
    this.HTML.className = "js_block";
    this.HTML.addSlot = function(){
        this.slots += 1;
    }
    this.HTML.nest = function(element){
        this.appendChild(element);
    }
    this.HTML.fill = function(){
        this.innerHTML = "Woooooo";
    }
    $(this.HTML).click(function(){
        var beingHeld = this;
        $(beingHeld).css("position", "absolute");
        
        $('body').mousemove(function(event){
            var total_height = $(beingHeld).innerHeight();
            var total_width = $(beingHeld).innerWidth();
            $(beingHeld).css('top', event.clientY - (total_height / 2));
            $(beingHeld).css('left', event.clientX - (total_width / 2));
                $(beingHeld).click(function(){
                    var numTop = Number(beingHeld.style.top);
                    console.log(numTop);
                    var numLeft = Number($(beingHeld).css('left'));
                    $(beingHeld).css('left', numLeft);
                    $(beingHeld).css('top', numTop);
                    beingHeld = "";
                });
        });
    });
    this.HTML.create = function(){
        document.body.appendChild(this);
    }
    return this.HTML;
}