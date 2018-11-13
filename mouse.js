var Mouse = function()
{
    this.xm = 250;
    this.ym = 250;
    var that = this;
    this.Init = function(element)
    {
        $(element).on("mousemove", function(event){
            that.xm = event.pageX;
            that.ym = event.pageY;
        });
    };
};

var mouseObj = new Mouse();