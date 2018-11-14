function Vehicle(x,y){
    this.acceleration = [0,0];
    this.velocity = [0,0];
    this.position = [x,y];
    this.mass = 1;
    this.radius = 2;
    this.maxspeed = 0.1;//0.05 * 1 / this.mass;
    this.maxforce = 0.1;//1 / 4*(this.mass * this.maxspeed);
    this.desired_velocity = [0,0];
    this.steering_force = [0,0];
}
Vehicle.prototype.update = function() {
    if(this.acceleration[0]>this.maxspeed){
        this.velocity[0] += this.maxspeed;
    }
    else {
        this.velocity[0] += this.acceleration[0];
    }
    if(this.acceleration[1]>this.maxspeed){
        this.velocity[1] += this.maxspeed;
    }
    else {
        this.velocity[1] += this.acceleration[1];
    }
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    this.acceleration[0] = 0;
    this.acceleration[1] = 0;
}

Vehicle.prototype.applyForce = function(force) {
    if(force[0]>this.maxforce){
        this.acceleration[0] += this.maxforce;
    }
    else {
        this.acceleration[0] += force[0];
    }
    if(force[1]>this.maxforce){
        this.acceleration[1] += this.maxforce;
    }
    else {
        this.acceleration[1] += force[1];
    }
}

Vehicle.prototype.seek = function() {
    var targetX = mouseObj.x;
    var targetY = mouseObj.y;
        
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
    var targetX = mouseObj.x;
    var targetY = mouseObj.y;
    ctx.beginPath();
    ctx.moveTo(this.position[0],this.position[1]);
    ctx.lineTo(targetX,targetY);
    ctx.strokeStyle = "rgba(255,0,0,0.5)";
    ctx.stroke();
    ctx.closePath();
    //circle around vehicle
    ctx.beginPath();
        ctx.arc(this.position[0],this.position[1],this.radius * 2.2,0,2*Math.PI);
        ctx.strokeStyle = "rgba(255, 0, 255,0.5)";
        ctx.stroke();
    ctx.closePath();
    ctx.closePath();
    //vehicle
    this.context = canvas.getContext("2d");
    this.context.save();
    this.context.translate(0,0);
    var theta = Math.atan2(this.velocity[1],this.velocity[0]) + Math.PI / 2;
    this.context.translate(this.position[0],this.position[1]);
    this.context.rotate(theta);
    this.context.beginPath();
    this.context.moveTo(0,-this.radius * 2);
    this.context.lineTo(-this.radius, this.radius * 2);
    this.context.lineTo(this.radius, this.radius * 2);
    this.context.closePath();
    this.context.strokeStyle = "rgba(0, 0, 255, 0.5)";
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
}
    
Vehicle.prototype.run = function(){
    this.render();
    this.seek();
    this.update();
}