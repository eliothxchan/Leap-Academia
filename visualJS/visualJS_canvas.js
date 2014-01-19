function Block(element) {
    this.HTML = document.createElement(element);
    this.HTML.connectionPoint = function () {
        return [this.style.top, this.style.left];
    this.HTML.connectTo = funcion(element){
        var line = document.createElement("div");
        $(line).css("position", "absolute");
        $(line).top = this.connectionPoint[0];
        $(line).top = this.connectionPoint[1];
        $(element)
    }