var Mouse = function()
{
    this.x = 250;
    this.y = 250;
    var that = this;
    this.Init = function(element,canvas)
    {
        var rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;
        $(element).on("mousemove", function(event){
            that.x = (event.clientX - rect.left) * scaleX;
            that.y = (event.clientY - rect.top) * scaleY;
        });
    };
};

var mouseObj = new Mouse();