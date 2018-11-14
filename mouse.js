var Mouse = function()
{
    this.x = 250;
    this.y = 250;
    var that = this;
    this.Init = function(element)
    {
        $(element).on("mousemove", function(event){
            that.x = event.pageX;
            that.y = event.pageY;
        });
    };
};

var mouseObj = new Mouse();