    Vehicle.prototype.outofbounds = function()
    {
        if(this.position[0]>canvas.width)
        {
            this.position[0] = 1;
        }
        else if(vehicle.position[0]<0)
        {
            this.position[0] = canvas.width-1;
        }
        if(this.position[1]>canvas.height)
        {
            this.position[1] = 1;
        }
        else if (this.position[1]<0)
        {
            this.position[1] = canvas.height-1;    
        }
    }