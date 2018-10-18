var Vehicle = function(x,y) {
    this.acceleration = vec2.create();
    this.velocity = vec2.fromValues(0, -2);
    this.position = vec2.fromValues(x,y);
    this.mass = 5;
    this.radius = this.mass * 2;
    this.maxspeed = 4 * 1 / this.mass;
    this.maxforce = 1 / (this.mass * this.maxspeed);

    this.update = function() {
        vec2.add(this.velocity,this.velocity,this.acceleration);
        
        vec2.add(this.position,this.position,this.velocity);
        vec2.set(this.acceleration,0,0);
    };

    this.applyForce = function(force) {
        vec2.add(this.acceleration,this.acceleration,force);
    };

    this.seek = function() {
        var target = vec2.fromValues(200,200);
        var desired_velocity;
        vec2.subtract(desired_velocity,target,this.position);
        //vec2.normalize(desired_velocity,desired_velocity);
        vec2.multiply(desired_velocity,desired_velocity,this.maxspeed);

        var steering_force;
        vec2.subtract(steering_force,desired_velocity, this.velocity);
        
        vec2.scale(steering_force,steering_force,1/this.mass);
        this.applyForce(steering_force);
    };

    this.render = function() {
        var theta = this.velocity + 3.14 / 2;
        ctx.translate(this.position[0],this.position[1]);
        ctx.rotate(theta);
        ctx.beginPath();
            ctx.moveTo(0,-this.radius * 2);
            ctx.lineTo(-this.radius, this.radius * 2);
            ctx.lineTo(this.radius, this.radius * 2);
            ctx.closePath();
            ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
            ctx.stroke();
        ctx.closePath();
    };
    
};