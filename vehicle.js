var Vehicle = function() {
    var x =10;
    var y = 20;
    this.acceleration = [0,0];
    this.velocity = [0,0];
    this.position = [x,y];
    this.past_position = [0,0];
    this.mass = 1;
    this.radius = 2;
    this.maxspeed = 0.1;//0.05 * 1 / this.mass;
    this.maxforce = 0.1;//1 / 4*(this.mass * this.maxspeed);
    this.desired_velocity = [0,0];
    this.steering_force = [0,0];
}
    Vehicle.prototype.update = function() {
        if(this.acceleration[0]>this.maxspeed)
        {
            this.velocity[0] = this.maxspeed;
        }
        else 
        {
            this.velocity[0] += this.acceleration[0];
        }
        if(this.acceleration[1]>this.maxspeed)
        {
            this.velocity[1] = this.maxspeed;
        }
        else 
        {
            this.velocity[1] += this.acceleration[1];
        }
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        this.acceleration[0] = 0;
        this.acceleration[1] = 0;
    }

    Vehicle.prototype.applyForce = function(force) {
        if(force[0]>this.maxforce)
        {
            this.acceleration[0] = this.maxforce;
        }
        else 
        {
            this.acceleration[0] += force[0];
        }
        if(force[1]>this.maxforce)
        {
            this.acceleration[1] = this.maxforce;
        }
        else 
        {
            this.acceleration[1] += force[1];
        }
    }

    Vehicle.prototype.seek = function() {
        var targetX = mouseObj.xm;
        var targetY = mouseObj.ym;
        
        this.desired_velocity[0] = (targetX - this.position[0]) * this.maxspeed;
        this.desired_velocity[1] = (targetY - this.position[1]) * this.maxspeed;
        this.steering_force[0] = this.desired_velocity[0] - this.velocity[0];
        this.steering_force[1] = this.desired_velocity[1] - this.velocity[1];
        this.steering_force[0] = this.steering_force[0] / this.mass;
        this.steering_force[1] = this.steering_force[1] / this.mass;      
        this.applyForce(this.steering_force);
    }

    Vehicle.prototype.render = function() {
        //path from vehicle to target
        //mouseObj.Init("#VP");
        var targetX = mouseObj.xm;
        var targetY = mouseObj.ym;
        this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();
            this.ctx.moveTo(this.position[0],this.position[1]);
            this.ctx.lineTo(targetX,targetY);
            this.ctx.strokeStyle = "rgba(255,0,0,0.5)";
            this.ctx.stroke();
        this.ctx.closePath();
        //vehicle
        var theta = Math.atan2(this.velocity[1],this.velocity[0]) + Math.PI / 2;
        this.ctx.translate(0,0);
        this.ctx.translate(this.position[0],this.position[1]);
        this.ctx.rotate(theta);
        this.ctx.beginPath();
            this.ctx.moveTo(0,-this.radius * 2);
            this.ctx.lineTo(-this.radius, this.radius * 2);
            this.ctx.lineTo(this.radius, this.radius * 2);
            this.ctx.closePath();
            this.ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
            this.ctx.stroke();
        this.ctx.closePath();
        //circle around vehicle
        this.ctx.beginPath();
            this.ctx.arc(0,0,this.radius * 2.2,0,2*Math.PI);
            this.ctx.strokeStyle = "rgba(255, 0, 255,0.5)";
            this.ctx.stroke();
        this.ctx.closePath();
  
        //desired_velocity
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(this.desired_velocity[0]*this.maxspeed,this.desired_velocity[1]*this.maxspeed);
        this.ctx.strokeStyle = "rgba(0,250,0,0.5)";
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    Vehicle.prototype.run = function(){
        this.render();
        this.seek();
        this.update();
    }