var Vehicle = function(x,y) {
    this.acceleration = [0,0];
    this.velocity = [0,0];
    this.position = [x,y];
    this.mass = 5;
    this.radius = this.mass * 2;
    this.maxspeed = 2 * 1 / this.mass;
    this.maxforce = 1 / (this.mass * this.maxspeed);

    this.update = function() {
        
        this.velocity[0] += this.acceleration[0];
        this.velocity[1] += this.acceleration[1];
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        this.acceleration[0] = 0;
        this.acceleration[1] = 0;
    };

    this.applyForce = function(force) {
        this.acceleration[0] += force[0];
        this.acceleration[1] += force[1];
    };

    this.seek = function() {
        targetX = mouseObj.x;
        targetY = mouseObj.y;
        mouseObj.Init("#VP");

        var desired_velocity = [];
        desired_velocity[0] = (targetX - this.position[0]) * this.maxspeed;
        desired_velocity[1] = (targetY - this.position[1]) * this.maxspeed;

        var steering_force = [];
        steering_force[0] = desired_velocity[0] - this.velocity[0];
        steering_force[1] = desired_velocity[1] - this.velocity[1];
        steering_force[0] = steering_force[0] / this.mass;
        steering_force[1] = steering_force[1] / this.mass;
        
        this.applyForce(steering_force);
    };

    this.render = function() {
        //var theta = this.velocity + 3.14 / 2;
        ctx.translate(this.position[0],this.position[1]);
        //ctx.rotate(theta);
        ctx.beginPath();
            ctx.moveTo(0,-this.radius * 2);
            ctx.lineTo(-this.radius, this.radius * 2);
            ctx.lineTo(this.radius, this.radius * 2);
            ctx.closePath();
            ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
            ctx.stroke();
        ctx.closePath();
    };
    
    this.loop = function() {
        this.render();
        this.seek();
        this.update();
    };
};