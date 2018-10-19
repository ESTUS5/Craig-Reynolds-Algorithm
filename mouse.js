var Mouse = function()
{
    this.x = 100;
    this.y = 100;
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