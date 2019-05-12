class Vehicle {
  constructor(x, y) {
    this.acceleration = new Vector(0, 0),
      this.velocity = new Vector(0, 0),
      this.position = new Vector(x, y),
      this.radius = 15,
      this.maxspeed = 4,
      this.maxforce = 0.1;
    this.desired_velocity = new Vector(0, 0);
  }
  update() {
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position = this.position.add(this.velocity);
    this.acceleration = this.acceleration.multiply(0);
  }
  applyForce(force) {
    this.acceleration = this.acceleration.add(force);
  }
  seek(targetX, targetY, displayForces = 'off') {
    this.desired_velocity = new Vector(targetX, targetY);
    this.desired_velocity = this.desired_velocity.subtract(this.position);
    this.desired_velocity = this.desired_velocity.normalize();
    this.desired_velocity = this.desired_velocity.multiply(this.maxspeed);
    this.steering_force = this.desired_velocity.subtract(this.velocity);
    this.steering_force.limit(this.maxforce);
    this.applyForce(this.steering_force);
    if (displayForces == "on") {
      this.renderForces();
    }
    return this.steering_force;
  }
  flee(safeDistance = 100, targetX = mouseObj.x, targetY = mouseObj.y, displayForces = 'off') {
    this.desired_velocity = new Vector(targetX, targetY);
    if (this.desired_velocity.distanceBetweenPoints(this.position) < safeDistance) {
      this.desired_velocity = this.desired_velocity.subtract(this.position);
      this.desired_velocity = this.desired_velocity.normalize();
      this.desired_velocity = this.desired_velocity.multiply(-this.maxspeed);
    }
    else {
      this.desired_velocity = this.desired_velocity.multiply(0);
    }
    this.steering_force = this.desired_velocity.subtract(this.velocity);
    this.steering_force.limit(this.maxforce);
    this.applyForce(this.steering_force);
    if (displayForces == 'on') {
      this.renderCircleAround(this.position.x, this.position.y, safeDistance);
      this.renderForces();
    }
    return this.steering_force;
  }
  arrival(targetX = mouseObj.x, targetY = mouseObj.y, arrivalDistance = 100, displayForces = 'off') {
    this.desired_velocity = new Vector(targetX, targetY);
    this.desired_velocity = this.desired_velocity.subtract(this.position);
    var d = this.desired_velocity.length();
    this.desired_velocity = this.desired_velocity.normalize();
    if (d <= arrivalDistance) {
      var m = this.desired_velocity.map(d, this.maxspeed);
      this.desired_velocity = this.desired_velocity.multiply(m);
    }
    else {
      this.desired_velocity = this.desired_velocity.multiply(this.maxspeed);
    }
    this.steering_force = this.desired_velocity.subtract(this.velocity);
    this.steering_force.limit(this.maxforce);
    this.applyForce(this.steering_force);
    if (displayForces == "on") {
      this.renderCircleAround(targetX, targetY, arrivalDistance);
      this.renderForces();
    }
    return this.steering_force;
  }
  runAhead() {
    this.desired_velocity = this.velocity.normalize();
    this.desired_velocity = this.desired_velocity.multiply(this.maxspeed);
    this.steering_force = this.desired_velocity.subtract(this.velocity);
    this.steering_force.limit(this.maxforce);
    this.applyForce(this.steering_force);
  }
  wander(length, radius, displayForces = 'off') {
    var lengthVector = this.velocity.normalize();
    lengthVector = lengthVector.multiply(length);
    lengthVector = this.position.add(lengthVector);
    this.theta = this.theta + ((Math.random() * 15) - (15 * 0.5));
    var radiusVector = new Vector(Math.cos(this.theta) * radius,
      Math.sin(this.theta) * radius);
    radiusVector = lengthVector.add(radiusVector);
    this.seek(radiusVector.x, radiusVector.y, displayForces);
    if (displayForces == 'on') {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(radiusVector.x, radiusVector.y);
      this.ctx.strokeStyle = "rgba(150,0,0,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(lengthVector.x, lengthVector.y);
      this.ctx.lineTo(radiusVector.x, radiusVector.y);
      this.ctx.strokeStyle = "rgba(50,200,0,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.renderCircleAround(lengthVector.x, lengthVector.y, radius);
    }
    return [radiusVector,lengthVector];
  }
  avoidObstacle(objects, distantPosition = 100, margin = 15, displayForces = 'off') {
    var predictVehiclePosition = this.velocity.normalize().multiply(distantPosition);
    predictVehiclePosition = this.position.add(predictVehiclePosition);
    var smallestDistance = predictVehiclePosition.distanceBetweenPoints(this.position);
    var closestObj = new Vector(0, 0), closestNormalPoint = new Vector(0, 0);
    for (let i = 0; i < objects.length; i++) {
      var normalPointObj = objects[i][0].normalPoint(this.position, predictVehiclePosition);
      if (displayForces == 'on') {
        this.renderCircleAround(normalPointObj.x, normalPointObj.y, 5)
        this.ctx.beginPath();
        this.ctx.moveTo(normalPointObj.x, normalPointObj.y);
        this.ctx.lineTo(objects[i][0].x, objects[i][0].y);
        this.ctx.strokeStyle = "rgba(44,44,70,0.5)";
        this.ctx.stroke();
        this.ctx.closePath();
      }
      if (normalPointObj.isBetween(this.position, predictVehiclePosition) == true) {
        if (normalPointObj.distanceBetweenPoints(objects[i][0]) < (objects[i][1] + margin)) {
          if (normalPointObj.distanceBetweenPoints(this.position) < smallestDistance) {
            smallestDistance = normalPointObj.distanceBetweenPoints(this.position);
            closestObj = objects[i][0];
            closestNormalPoint = normalPointObj;
          }
        }
      }
    }
    if (displayForces == 'on') {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(predictVehiclePosition.x, predictVehiclePosition.y);
      this.ctx.lineWidth = margin * 2;
      this.ctx.strokeStyle = "rgba(50,155,50,0.3)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(predictVehiclePosition.x, predictVehiclePosition.y);
      this.ctx.strokeStyle = "rgba(255,0,0,1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.beginPath();
      var axisPlus = this.velocity.normalize().multiply(900),
        axisPlus = this.position.add(axisPlus),
        axisMinus = this.velocity.normalize().multiply(-900),
        axisMinus = this.position.add(axisMinus);
      this.ctx.moveTo(axisPlus.x, axisPlus.y);
      this.ctx.lineTo(axisMinus.x, axisMinus.y);
      this.ctx.strokeStyle = "rgba(44,44,70,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
    }
    var mirrorTarget = closestObj.mirror(closestNormalPoint);
    if (mirrorTarget.x != 0 && mirrorTarget.y != 0) {
      this.seek(mirrorTarget.x, mirrorTarget.y);
      if (displayForces == 'on') {
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(mirrorTarget.x, mirrorTarget.y);
        this.ctx.strokeStyle = "rgba(255,0,0,1)";
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
    return mirrorTarget;
  }
  obstacleWall(wall) {
    var closestNormalPoint = new Vector(0, 0);
    var smallestDistance = 100;
    var wallBegin = new Vector(0, 0), wallEnd = new Vector(0, 0);
    for (let i = 0; i < wall.length - 1; i++) {
      var normalPoint = this.position.normalPoint(wall[i], wall[i + 1]);

      if (normalPoint.distanceBetweenPoints(this.position) < smallestDistance &&
      normalPoint.isBetween(wall[i],wall[i + 1]) && wall[i] ==wall[i + 1]) {
        closestNormalPoint = normalPoint;
        wallBegin = wall[i];
        wallEnd = wall[i + 1];
        smallestDistance = normalPoint.distanceBetweenPoints(this.position);
      }
    }
    if (closestNormalPoint.distanceBetweenPoints(this.position) < this.radius) {
      if (closestNormalPoint.isBetween(wallBegin, wallEnd, 'x')) {
        if (closestNormalPoint.x == this.position.x) {
          if (closestNormalPoint.y > this.position.y) {
            this.position.y = closestNormalPoint.y - this.radius;
            this.velocity.y -= this.radius/2;
          }
          else if (closestNormalPoint.y < this.position.y) {
            this.position.y = closestNormalPoint.y + this.radius;
            this.velocity.y += this.radius/2;
          }
          if (closestNormalPoint.x == wallBegin.x) {
            this.position.x = closestNormalPoint.x - this.radius;
            this.velocity.x -= this.radius/2;
          }
          else if (closestNormalPoint.x == wallEnd.x) {
            this.position.x = closestNormalPoint.x + this.radius;
            this.velocity.x += this.radius/2;
          }
        }
      }
      else if (closestNormalPoint.isBetween(wallBegin, wallEnd, 'y')) {
        if (closestNormalPoint.y == this.position.y) {
          if (closestNormalPoint.x < this.position.x) {
            this.position.x = closestNormalPoint.x + this.radius;
            this.velocity.x += this.radius/2;
          }
          else if(closestNormalPoint.x > this.position.x) {
            this.position.x = closestNormalPoint.x - this.radius;
            this.velocity.x -= this.radius/2;
          }
          if (closestNormalPoint.y == wallBegin.y) {
            this.position.y = closestNormalPoint.y - this.radius;
            this.velocity.y -= this.radius/2;
          }
          else if (closestNormalPoint.y == wallEnd.y) {
            this.position.y = closestNormalPoint.y + this.radius;
            this.velocity.y += this.radius/2;
          }
        }
      }
      else{
        this.renderCircleAround(this.position.x,this.position.y,5,"red");
        console.log(closestNormalPoint)
        console.log(this.position)
        console.log(wallBegin)
        console.log(wallEnd)
      }
    }
  }
  pursue(target_position, target_velocity, displayForces = 'off') {
    var d = this.position.distanceBetweenPoints(target_position);
    var T = d / this.maxspeed;
    var target = target_position.add(target_velocity.multiply(T))
    this.seek(target.x, target.y, displayForces);
    if (displayForces == 'on') {
      this.ctx = canvas.getContext('2d');
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.strokeStyle = "rgba(40,80,60,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
  evade(target_position, target_velocity, displayForces = 'off') {
    var d = this.position.distanceBetweenPoints(target_position);
    var T = d / this.maxspeed;
    var target = target_position.add(target_velocity.multiply(T))
    this.flee(200, target.x, target.y, displayForces);
    if (displayForces == 'on') {
      this.ctx = canvas.getContext('2d');
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.strokeStyle = "rgba(40,80,60,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
  containment(area, displayForces = 'off') {
    var offsetPosition = this.velocity.normalize();
    offsetPosition = offsetPosition.multiply(this.radius * 3);
    offsetPosition = offsetPosition.add(this.position);
    //offsetPosition.outsiede(area)
    if (offsetPosition.x < area.A.x && offsetPosition.x < area.B.x && offsetPosition.y > area.A.y && offsetPosition.y < area.B.y) {

    }
    if (displayForces == 'on') {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(offsetPosition.x, offsetPosition.y);
      this.ctx.strokeStyle = "rgba(255,0,0,0.6)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.renderCircleAround(offsetPosition.x, offsetPosition.y, this.radius);
    }
  }
  choosePath(path, radius) {
    this.path = path,
      this.pathRadius = radius,
      this.pathCurrentPoint = 0;
  }
  followPath(predictDistance = 30, targetOffset = 10, displayForces = "off") {
    var predictVehiclePosition = this.velocity.normalize().multiply(predictDistance);
    predictVehiclePosition = this.position.add(predictVehiclePosition);
    var normalPoint = new Vector(0, 0), oa, ob, target, smallest_distance = 10000;
    for (let i = 0; i < this.path.length - 1; i++) {
      var a = this.path[i];
      var b = this.path[i + 1];
      normalPoint = predictVehiclePosition.normalPoint(a, b);
      if ((normalPoint.x < Math.min(a.x, b.x)) || (normalPoint.x > Math.max(a.x, b.x))) {
        normalPoint.equal(b);
      }
      var distance = predictVehiclePosition.distanceBetweenPoints(normalPoint);
      if (distance < smallest_distance) {
        smallest_distance = distance;
        target = normalPoint;
        oa = a;
        ob = b;
      }
    }
    var dir = ob.subtract(oa);
    dir = dir.normalize().multiply(targetOffset);
    var target_dir = target.add(dir);
    var distance = predictVehiclePosition.distanceBetweenPoints(target);
    if (distance > this.pathRadius) {
      this.seek(target_dir.x, target_dir.y, displayForces);
    }
    if (displayForces == "on") {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(predictVehiclePosition.x, predictVehiclePosition.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.lineTo(target_dir.x, target_dir.y);
      this.ctx.strokeStyle = "rgba(255,0,0,1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.renderCircleAround(predictVehiclePosition.x, predictVehiclePosition.y, 5);
      this.renderCircleAround(target_dir.x, target_dir.y, 5);
    }
    return target_dir;
  }
  followWall(predictDistance = 30, targetOffset = 10, displayForces = "off") {
    var predictVehiclePosition = this.velocity.normalize().multiply(predictDistance);
    predictVehiclePosition = this.position.add(predictVehiclePosition);
    var normalPoint = new Vector(0, 0), oa, ob, target, smallest_distance = 10000;
    for (let i = 0; i < this.path.length - 1; i++) {
      var a = this.path[i];
      var b = this.path[i + 1];
      normalPoint = predictVehiclePosition.normalPoint(a, b);
      if ((normalPoint.x < Math.min(a.x, b.x)) || (normalPoint.x > Math.max(a.x, b.x))) {
        normalPoint.equal(b);
      }
      var distance = predictVehiclePosition.distanceBetweenPoints(normalPoint);
      if (distance < smallest_distance) {
        smallest_distance = distance;
        target = normalPoint;
        oa = a;
        ob = b;
      }
    }
    var dir = ob.subtract(oa);
    dir = dir.normalize().multiply(targetOffset);
    var target_dir = target.add(dir);
    var distance = predictVehiclePosition.distanceBetweenPoints(target);
    if (distance > this.pathRadius) {
      this.seek(target_dir.x, target_dir.y, displayForces);
    }
    if (displayForces == "on") {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(predictVehiclePosition.x, predictVehiclePosition.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.lineTo(target_dir.x, target_dir.y);
      this.ctx.strokeStyle = "rgba(255,0,0,1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.renderCircleAround(predictVehiclePosition.x, predictVehiclePosition.y, 5);
      this.renderCircleAround(target_dir.x, target_dir.y, 5);
    }
    return target_dir;
  }
  separation(Vehicles) {
    var desired_seperation = this.radius * 3;
    var sumVector = new Vector(0, 0);
    var j = 0;
    for (let i = 0; i < Vehicles.length; i++) {
      var distance = this.position.distanceBetweenPoints(Vehicles[i].position);
      if ((distance > 0) && (distance < desired_seperation)) {
        var differance = this.position.subtract(Vehicles[i].position);
        differance = differance.normalize();
        differance = differance.divide(distance);
        sumVector = sumVector.add(differance);
        j++;
      }
    }
    if (j > 0) {
      sumVector = sumVector.divide(j);
      sumVector = sumVector.normalize();
      sumVector = sumVector.multiply(this.maxspeed);
      sumVector = sumVector.subtract(this.velocity);
      sumVector.limit(this.maxforce);
      this.applyForce(sumVector);
    }
    return sumVector;
  }
  align(Vehicles, neighbourDistance = 50) {
    var sumVector = new Vector(0, 0),
      j = 0;
    for (let i = 0; i < Vehicles.length; i++) {
      var distance = this.position.distanceBetweenPoints(Vehicles[i].position);
      if ((distance > 0) && (distance < neighbourDistance)) {
        sumVector = sumVector.add(Vehicles[i].velocity);
        j++;
      }
    }
    if (j > 0) {
      sumVector = sumVector.divide(j);
      sumVector = sumVector.normalize();
      sumVector = sumVector.multiply(this.maxspeed);
      sumVector = sumVector.subtract(this.velocity);
      sumVector.limit(this.maxforce);
      this.applyForce(sumVector);
    }
    return sumVector;
  }
  cohesion(Vehicles, neighbourDistance = 50) {
    var sumVector = new Vector(0, 0),
      j = 0;
    for (let i = 0; i < Vehicles.length; i++) {
      var distance = this.position.distanceBetweenPoints(Vehicles[i].position);
      if ((distance > 0) && (distance < neighbourDistance)) {
        sumVector = sumVector.add(Vehicles[i].position);
        j++;
      }
    }
    if (j > 0) {
      sumVector = sumVector.divide(j);
      sumVector = this.seek(sumVector.x, sumVector.y);
    }
    return sumVector;
  }
  follow(Vehicle, offset = this.radius * 3, displayForces = 'off') {
    var targetOffset = Vehicle.velocity.normalize();
    targetOffset = targetOffset.multiply(offset);
    targetOffset = targetOffset.add(Vehicle.position)
    targetOffset = targetOffset.mirror(Vehicle.position);
    this.arrival(targetOffset.x, targetOffset.y, 100, displayForces);
    if (displayForces == 'on') {
      this.renderCircleAround(targetOffset.x, targetOffset.y, 5)
    }
  }
  queueV(Vehicles, VehAhead, VehRadius,steering_force = this.steering_force,displayForces = 'off') {
    var neighbour = null;
    var circleAhead = this.velocity.normalize().multiply(VehAhead);
    circleAhead = this.position.add(circleAhead);
    for (let i = 0; i < Vehicles.length; i++) {
      if ((Vehicles[i].position.distanceBetweenPoints(circleAhead) < VehRadius) &&
        (Vehicles[i].position.distanceBetweenPoints(this.position) != 0)) {
          neighbour = Vehicles[i];
      }
    }
    var brake = new Vector(0,0);
    if (neighbour != null) {
      brake.x = steering_force.x * -0.8;
      brake.y = steering_force.y * -0.8;
      brake = brake.add(this.velocity.multiply(-1));
      brake = brake.add(this.separation(Vehicles));
      if(this.position.distanceBetweenPoints(neighbour.position) <= VehRadius){
        this.velocity.multiply(0.3);
      }
    }
    if(displayForces == 'on'){
      this.renderCircleAround(circleAhead.x,circleAhead.y,VehRadius);
      this.renderCircleAround(this.position.x,this.position.y,VehRadius);
      this.renderVectorTo(this.position.x + (brake.x * 10), this.position.y + (brake.y * 10),"red");
    }
    this.acceleration = this.acceleration.add(brake);
  }
  flock(Vehicles) {
    var seperate = this.separation(Vehicles),
      align = this.align(Vehicles),
      cohesion = this.cohesion(Vehicles);
    this.acceleration = this.acceleration.multiply(0);
    seperate = seperate.multiply(1.5);
    this.applyForce(seperate);
    this.applyForce(cohesion);
    this.applyForce(align);
  }
  // Boundries methods
  outOfBounds() {
    if (this.position.x >= canvas.width) {
      this.position.x = 0;
    }
    else if (this.position.x <= 0) {
      this.position.x = canvas.width;
    }
    if (this.position.y >= canvas.height) {
      this.position.y = 0;
    }
    else if (this.position.y <= 0) {
      this.position.y = canvas.height;
    }
  }
  onlyCanvas() {
    if (this.position.x >= canvas.width - this.radius) {
      this.position.x = canvas.width - this.radius;
    }
    else if (this.position.x <= 0 + this.radius) {
      this.position.x = this.radius;
    }
    if (this.position.y >= canvas.height - this.radius) {
      this.position.y = canvas.height - this.radius;
    }
    else if (this.position.y <= 0 + this.radius) {
      this.position.y = this.radius;
    }
  }
  // Draw methods
  renderVectorTo(x, y, colour = 'Red') {
    this.ctx = canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = colour;
    this.ctx.stroke();
    this.ctx.closePath();
  }
  renderCircleAround(x, y, r = this.radius) {
    this.ctx = canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.strokeStyle = "rgba(255, 0, 255,0.5)";
    this.ctx.stroke();
    this.ctx.closePath();
  }
  renderForces() {
    this.ctx = canvas.getContext("2d");
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.desired_velocity.x * 10, this.desired_velocity.y * 10);
    this.ctx.closePath();
    this.ctx.strokeStyle = "#FF4500";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.velocity.x * 10, this.velocity.y * 10);
    this.ctx.closePath();
    this.ctx.strokeStyle = "#6A5ACD";
    this.ctx.stroke();
    this.ctx.restore();
  }
  renderVehicle(colour = "rgba(120, 165, 233, 0.6)") {
    this.ctx = canvas.getContext("2d");
    this.ctx.save(); //operation to prevent invalid drawings
    if (this.velocity.x != 0 || this.velocity.y != 0) {
      this.theta = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
    }
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.theta);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.radius);
    this.ctx.lineTo(-this.radius, this.radius);
    this.ctx.lineTo(this.radius, this.radius);
    this.ctx.closePath();
    this.ctx.fillStyle = colour;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore(); //we restore position of (0,0) from save
  }
}