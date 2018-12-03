function Vehicle(x,y) {
    this.acceleration = [0,0];
    this.velocity = [0,0];
    this.position = [x,y];
   // this.mass = 1;
    this.radius = 3;//this.mass * 2;
    this.maxspeed = 4;//0.05 * 1 / this.mass;
    this.maxforce = 1;//1 / 4*(this.mass * this.maxspeed);
    this.desired_velocity = [0,0];
    this.steering_force = [0,0];
}
    Vehicle.prototype.normalize = function(variable){
        if(variable < 0){ 
            variable = variable * -1;
        }
        return variable;
    }
    Vehicle.prototype.update = function() {
        if(this.normalize(this.acceleration[0])>this.maxspeed){
            this.velocity[0] += (this.maxspeed * this.acceleration[0] / this.normalize(this.acceleration[0]) );
        }
        else {
            this.velocity[0] += this.acceleration[0];
        }
        if(this.normalize(this.acceleration[1])>this.maxspeed){
            this.velocity[1] += (this.maxspeed * this.acceleration[1] / this.normalize(this.acceleration[1]) );
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
        if(this.normalize(force[0])>this.maxforce){
            this.acceleration[0] += (this.maxforce * force[0] / this.normalize(force[0]) );
        }
        else {
            this.acceleration[0] += force[0];
        }
        if(this.normalize(force[1])>this.maxforce){
            this.acceleration[1] += (this.maxforce * force[1] / this.normalize(force[1]) );
        }
        else {
            this.acceleration[1] += force[1];
        }
    }
    Vehicle.prototype.seek = function() {
        var targetX = mouseObj.x;
        var targetY = mouseObj.y
        this.desired_velocity[0] = (targetX - this.position[0]) * this.maxspeed;
        this.desired_velocity[1] = (targetY - this.position[1]) * this.maxspeed;
        this.steering_force[0] = this.desired_velocity[0] - this.velocity[0];
        this.steering_force[1] = this.desired_velocity[1] - this.velocity[1];
        this.steering_force[0] = this.steering_force[0] ;/// this.mass;
        this.steering_force[1] = this.steering_force[1] ;/// this.mass;      
        this.applyForce(this.steering_force);
    }
    Vehicle.prototype.flee = function() {
        var chaserX = mouseObj.x;
        var chaserY = mouseObj.y
        this.desired_velocity[0] = (chaserX + this.position[0]) * this.maxspeed;
        this.desired_velocity[1] = (chaserY + this.position[1]) * this.maxspeed;
        this.steering_force[0] = this.desired_velocity[0] - this.velocity[0];
        this.steering_force[1] = this.desired_velocity[1] - this.velocity[1];
        this.steering_force[0] = this.steering_force[0] ;/// this.mass;
        this.steering_force[1] = this.steering_force[1] ;/// this.mass;      
        this.applyForce(this.steering_force);
    }
    Vehicle.prototype.map = function(input_val,range_min,range_max){
        return range_min + (range_max-range_min) * ((input_val - 0) / (100 - 0));
    }
    Vehicle.prototype.arrival = function() {
        var targetX = mouseObj.x;
        var targetY = mouseObj.y
        this.desired_velocity[0] = (targetX - this.position[0]);
        this.desired_velocity[1] = (targetY - this.position[1]);

        if(this.normalize(this.desired_velocity[0]) <= 10 && this.normalize(this.desired_velocity[1]) <= 10){
            this.desired_velocity[0] = this.desired_velocity[0] * this.map(this.desired_velocity[0],0,10);
            this.desired_velocity[1] = this.desired_velocity[1] * this.map(this.desired_velocity[1],0,10);
        }

        this.steering_force[0] = this.desired_velocity[0] - this.velocity[0];
        this.steering_force[1] = this.desired_velocity[1] - this.velocity[1];
        this.steering_force[0] = this.steering_force[0] / this.mass;
        this.steering_force[1] = this.steering_force[1] / this.mass;      
        this.applyForce(this.steering_force);
    }
    Vehicle.prototype.renderPathFromVehicleToPosXY = function(x,y){
        this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();
            this.ctx.moveTo(this.position[0],this.position[1]);
            this.ctx.lineTo(x,y);
            this.ctx.strokeStyle = "rgba(255,0,0,0.5)";
            this.ctx.stroke();
        this.ctx.closePath();
    }
    Vehicle.prototype.renderCircleAroundPosXY = function(x,y,r = this.radius){
        this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();
            this.ctx.arc(x,y,r * 2.2,0,2*Math.PI);
            this.ctx.strokeStyle = "rgba(255, 0, 255,0.5)";
            this.ctx.stroke();
        this.ctx.closePath();
    }
    Vehicle.prototype.renderVehicle = function() {
        this.ctx = canvas.getContext("2d");
        //operation to prevent invalid drawings
        this.ctx.save();
        //vehicle
        var theta = Math.atan2(this.velocity[1],this.velocity[0]) + Math.PI / 2;
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
        //we restore position of (0,0) from save
        this.ctx.restore();
    }
    Vehicle.prototype.render = function() {
        this.renderPathFromVehicleToPosXY(mouseObj.x,mouseObj.y);
        this.renderCircleAroundPosXY(this.position[0],this.position[1]);
        this.renderVehicle();
        this.renderCircleAroundPosXY(mouseObj.x,mouseObj.y,10);
    }
    Vehicle.prototype.run = function(){
        this.render();
        this.seek();
        //this.flee();
        //this.arrival();
        this.update();
    }