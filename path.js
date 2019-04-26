function Path(x1,y1,x2,y2,radius)
{
    this.points = [];
    this.points.push( new Vector(x1, y1) );
    this.points.push( new Vector(x2, y2) );
    this.radius = radius;
}

Path.prototype.addPoint = function(x,y)
{
    this.points.push(new Vector(x,y));
}

Path.prototype.draw = function()
{
    this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();
            this.ctx.moveTo(this.points[0].x,this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                this.ctx.lineTo(this.points[i].x,this.points[i].y);
            }
            this.ctx.strokeStyle = "rgba(255, 0, 255,0.1)";
            this.ctx.lineWidth = this.radius*2;
            this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.lineWidth = 1;
    //this.ctx = canvas.getContext("3d");
    /*
    this.ctx.beginPath(); 
        this.ctx.moveTo(this.points[0].x,this.points[0].y);
        this.ctx.arc(this.points[0].x, this.points[0].y, this.radius, 0, 2 * Math.PI);
            for (let i = 1; i < this.points.length; i++) {
                this.ctx.moveTo(this.points[i].x,this.points[i].y);
                this.ctx.arc(this.points[i].x, this.points[i].y, this.radius, 0, 2 * Math.PI);
            }
            this.ctx.fillStyle = "rgba(255, 0, 255,0.1)";
            this.ctx.fill();
            this.ctx.stroke();
    this.ctx.closePath();
    */
}