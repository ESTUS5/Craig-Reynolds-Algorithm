var Mouse = function()
{
    this.x = 250;
    this.y = 250;
    var that = this;
    this.Init = function(element)
    {
        $(element).on("mousemove", function(event){
            that.x = event.clientX -5;
            that.y = event.clientY - 51;
        });
    };
};

var mouseObj = new Mouse();