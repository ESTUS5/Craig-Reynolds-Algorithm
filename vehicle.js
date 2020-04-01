class Vehicle {
  constructor(x, y) {
    this.acceleration = new Vector(0, 0),
      this.velocity = new Vector(0, 0),
      this.position = new Vector(x, y),
      this.radius = 15,
      this.maxspeed = 4,
      this.maxforce = 0.1;
    this.desiredVelocity = new Vector(0, 0);
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
    this.desiredVelocity = new Vector(targetX, targetY);
    this.desiredVelocity = this.desiredVelocity.subtract(this.position);
    this.desiredVelocity = this.desiredVelocity.normalize();
    this.desiredVelocity = this.desiredVelocity.multiply(this.maxspeed);
    this.steeringForce = this.desiredVelocity.subtract(this.velocity);
    this.steeringForce.limit(this.maxforce);
    if (displayForces == "on") {
      this.renderForces();
    }
    return this.steeringForce;
  }

  flee(targetX = mouseObj.x, targetY = mouseObj.y,safeDistance = 100, displayForces = 'off') {
    this.desiredVelocity = new Vector(targetX, targetY);
    if (this.desiredVelocity.distanceBetweenPoints(this.position) < safeDistance) {
      this.desiredVelocity = this.desiredVelocity.subtract(this.position);
      this.desiredVelocity = this.desiredVelocity.normalize();
      this.desiredVelocity = this.desiredVelocity.multiply(-this.maxspeed);
    }
    else {
      this.desiredVelocity = this.desiredVelocity.multiply(0);
    }
    this.steeringForce = this.desiredVelocity.subtract(this.velocity);
    this.steeringForce.limit(this.maxforce);
    if (displayForces == 'on') {
      this.renderCircleAround(this.position.x, this.position.y, safeDistance);
      this.renderForces();
    }
    return this.steeringForce;
  }

  arrival(targetX = mouseObj.x, targetY = mouseObj.y, arrivalDistance = 100, displayForces = 'off') {
    this.desiredVelocity = new Vector(targetX, targetY);
    this.desiredVelocity = this.desiredVelocity.subtract(this.position);
    var d = this.desiredVelocity.length();
    this.desiredVelocity = this.desiredVelocity.normalize();
    if (d <= arrivalDistance) {
      var m = this.desiredVelocity.map(d, this.maxspeed, 0, arrivalDistance, 0);
      this.desiredVelocity = this.desiredVelocity.multiply(m);
    }
    else {
      this.desiredVelocity = this.desiredVelocity.multiply(this.maxspeed);
    }
    this.steeringForce = this.desiredVelocity.subtract(this.velocity);
    this.steeringForce.limit(this.maxforce);
    if (displayForces == "on") {
      this.renderCircleAround(targetX, targetY, arrivalDistance);
      this.renderForces();
    }
    return this.steeringForce;
  }

  runAhead() {
    this.desiredVelocity = this.velocity.normalize();
    this.desiredVelocity = this.desiredVelocity.multiply(this.maxspeed);
    this.steeringForce = this.desiredVelocity.subtract(this.velocity);
    this.steeringForce.limit(this.maxforce);
    return this.steeringForce;
  }

  wander(length, radius, displayForces = 'off') {
    var lengthVector = this.velocity.normalize();
    lengthVector = lengthVector.multiply(length);
    lengthVector = this.position.add(lengthVector);
    this.theta = this.theta + ((Math.random() * 15) - (15 * 0.5));
    var radiusVector = new Vector(Math.cos(this.theta) * radius,
      Math.sin(this.theta) * radius);
    radiusVector = lengthVector.add(radiusVector);
    if (displayForces == 'on') {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(radiusVector.x, radiusVector.y);
      this.ctx.strokeStyle = "rgba(150,0,0,1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(lengthVector.x, lengthVector.y);
      this.ctx.lineTo(radiusVector.x, radiusVector.y);
      this.ctx.strokeStyle = "rgba(50,200,0,1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.renderCircleAround(lengthVector.x, lengthVector.y, radius);
    }
    return [radiusVector,lengthVector];
  }

  avoidObstacle(objects, aheadPoint = 100, margin = 15, displayForces = 'off') {
    var predictPoint = this.velocity.normalize().multiply(aheadPoint);
    predictPoint = this.position.add(predictPoint);
    var smallestDistance = predictPoint.distanceBetweenPoints(this.position);
    var closestObj = new Vector(0, 0), closestNormalPoint = new Vector(0, 0);

    for (let i = 0; i < objects.length; i++) {

      var normalPointObj = objects[i][0].normalPoint(this.position, predictPoint);

      if (normalPointObj.isBetween(this.position, predictPoint) == true) {

        if (displayForces == 'on') {
          this.renderCircleAround(normalPointObj.x, normalPointObj.y, 5)
          this.ctx.beginPath();
          this.ctx.moveTo(normalPointObj.x, normalPointObj.y);
          this.ctx.lineTo(objects[i][0].x, objects[i][0].y);
          this.ctx.strokeStyle = "rgba(44,44,70,0.5)";
          this.ctx.stroke();
          this.ctx.closePath();
        }

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
      this.ctx.lineTo(predictPoint.x, predictPoint.y);
      this.ctx.lineWidth = margin * 2;
      this.ctx.strokeStyle = "rgba(50,155,50,0.3)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(predictPoint.x, predictPoint.y);
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
    //BrakingForce
    var brakeVector = new Vector(0,0);
    if(mirrorTarget.x != 0 || mirrorTarget.y != 0){
      var d = this.position.distanceBetweenPoints(closestNormalPoint);
      var brake = this.velocity.map(d,this.maxspeed,0,aheadPoint,0);
      brakeVector = this.velocity.normalize().multiply(-(this.maxspeed - brake));

      if(displayForces == "on"){

        this.ctx.beginPath();
          this.ctx.lineWidth = 2;
          this.ctx.moveTo(this.position.x, this.position.y);
          this.ctx.lineTo(this.position.x + brakeVector.x * 10,this.position.y +  brakeVector.y * 10);
          this.ctx.strokeStyle = "blue";
          this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
          this.ctx.moveTo(this.position.x, this.position.y);
          this.ctx.lineTo(mirrorTarget.x,mirrorTarget.y);
          this.ctx.strokeStyle = "green";
          this.ctx.stroke();
        this.ctx.closePath();

      }

    }
    return mirrorTarget.add(brakeVector);
  }

  pursue(target_position, target_velocity, displayForces = 'off') {
    var d = this.position.distanceBetweenPoints(target_position);
    var T = d / this.maxspeed;
    var target = target_position.add(target_velocity.multiply(T))
    if (displayForces == 'on') {
      this.ctx = canvas.getContext('2d');
      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.arc(target.x,target.y,3,0,2*Math.PI);
      this.ctx.strokeStyle = "rgba(40,80,60,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
    }
    return target;
  }

  evade(target_position, target_velocity, displayForces = 'off') {
    var d = this.position.distanceBetweenPoints(target_position);
    var T = d / this.maxspeed;
    var target = target_position.add(target_velocity.multiply(T))
    if (displayForces == 'on') {
      this.ctx = canvas.getContext('2d');
      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.arc(target.x,target.y,3,0,2*Math.PI);
      this.ctx.strokeStyle = "rgba(40,80,60,0.5)";
      this.ctx.stroke();
      this.ctx.closePath();
    }
    return target;
  }

  containment(Objects, displayForces = 'off') {
    var mainRay = this.velocity.normalize().multiply(this.maxspeed),
    leftRay = mainRay.moveByAngle(-Math.PI / 4),
    rightRay = mainRay.moveByAngle(Math.PI / 4);

    mainRay = mainRay.multiply(this.radius*2);
    leftRay = leftRay.multiply(this.radius);
    rightRay = rightRay.multiply(this.radius);

    var mainRayPos = mainRay.add(this.position),
    leftRayPos = leftRay.add(this.position),
    rightRayPos = rightRay.add(this.position);

    var summedVector = new Vector(0,0);
    var closestMainObj = 0,closestLeftObj = 0,closestRightObj = 0;
    var closestMainPoint = 0,closestLeftPoint = 0,closestRightPoint = 0;
    var closestMainDistance = 1000,closestLeftDistance = 1000,closestRightDistance = 1000;
    for (let i = 0; i < Objects.length; i++) {
      if(Objects[i].hasInside(mainRayPos,this.position)){
        Objects[i].draw("red");
        var projectedPoint = Objects[i].projectedPointOnSurface(mainRayPos,this.position);
        if(projectedPoint.distanceBetweenPoints(this.position) < closestMainDistance){
          closestMainObj = Objects[i];
          closestMainPoint = projectedPoint;
          closestMainDistance = projectedPoint.distanceBetweenPoints(this.position);
        }
      }
      if(Objects[i].hasInside(leftRayPos,this.position)){
        Objects[i].draw("blue");
        var projectedPoint = Objects[i].projectedPointOnSurface(leftRayPos,this.position);
        if(projectedPoint.distanceBetweenPoints(this.position) <  closestMainDistance){
          closestLeftObj = Objects[i];
          closestLeftPoint = projectedPoint;
          closestLeftDistance = projectedPoint.distanceBetweenPoints(this.position);
        }
      }
      if(Objects[i].hasInside(rightRayPos,this.position)){
        Objects[i].draw("green");
        var projectedPoint = Objects[i].projectedPointOnSurface(rightRayPos,this.position);
        if(projectedPoint.distanceBetweenPoints(this.position) <  closestMainDistance){
          closestRightObj = Objects[i];
          closestRightPoint = projectedPoint;
          closestRightDistance = projectedPoint.distanceBetweenPoints(this.position);
        }
      }
    }
    if(closestMainObj != 0){
      summedVector = summedVector.add( closestMainObj.normalVector(closestMainPoint, mainRayPos) );
    }
    if(closestLeftObj != 0){
      summedVector = summedVector.add(closestLeftObj.normalVector(closestLeftPoint, leftRayPos) );
    }
    if(closestRightObj != 0){
      summedVector = summedVector.add(closestRightObj.normalVector(closestRightPoint, rightRayPos) );
    }


    if(summedVector.x != 0 || summedVector.y != 0){
      summedVector = summedVector.normalize().multiply(this.maxspeed);
      summedVector = summedVector.add(this.position);
    }
    if(displayForces == "on"){
      this.renderVectorTo(this.position.x +  (mainRay.x), this.position.y + (mainRay.y),"#00C691",3);
      this.renderVectorTo(this.position.x + (leftRay.x), this.position.y + (leftRay.y),"#00C691",3);
      this.renderVectorTo(this.position.x + (rightRay.x), this.position.y + (rightRay.y),"#00C691",3);
      //if(summedVector.x != 0 || summedVector.y != 0){
      //  this.renderVectorTo(summedVector.x ,summedVector.y,"#2CE9FF");
      //}
    }
    
    return summedVector;
  }

  choosePath(path, radius) {
    this.path = path,
      this.pathRadius = radius,
      this.pathCurrentPoint = 0;
  }

  followPath(predictDistance = 30, targetOffset = 20, displayForces = "off") {
    var predictPoint = this.velocity.normalize().multiply(predictDistance);
    predictPoint = this.position.add(predictPoint);
    var normalPoint = new Vector(0, 0), oa, ob, target, smallest_distance = 10000;
    for (let i = 0; i < this.path.length - 1; i++) {
      var a = this.path[i];
      var b = this.path[i + 1];
      normalPoint = predictPoint.normalPoint(a, b);
      if ((normalPoint.x < Math.min(a.x, b.x)) || (normalPoint.x > Math.max(a.x, b.x))) {
        normalPoint.equal(b);
      }
      var distance = predictPoint.distanceBetweenPoints(normalPoint);
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
    //var distance = predictPoint.distanceBetweenPoints(target);
    if (displayForces == "on") {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(predictPoint.x, predictPoint.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.lineTo(target_dir.x, target_dir.y);
      this.ctx.strokeStyle = "rgba(255,0,0,1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.renderCircleAround(predictPoint.x, predictPoint.y, 5);
      this.renderCircleAround(target_dir.x, target_dir.y, 5);
    }
    //if (distance > this.pathRadius) {
      return target_dir;
    //}
    //else{
    //  return new Vector(0,0);
    //}
  }

  wallFollow(objects,predictDistance = 20,targetOffset = 10,displayForces) {
    var predictPoint = this.velocity.normalize().multiply(predictDistance);
    predictPoint = this.position.add(predictPoint);
    
    var target = new Vector(0, 0), smallest_distance = 10000, closestObj = 0;
    for (let i = 0; i < objects.length; i++) {
      var pointOnSurface = objects[i].projectedPointOnSurface(predictPoint);
      if ((pointOnSurface.x < Math.min(objects[i].begin.x, objects[i].end.x)) || 
        (pointOnSurface.x > Math.max(objects[i].begin.x, objects[i].end.x))) {
          pointOnSurface.equal(objects[i].end);
      }
      if(displayForces == "on"){
        this.renderCircleAround(pointOnSurface.x,pointOnSurface.y,5,3)
      }
      var distance = predictPoint.distanceBetweenPoints(pointOnSurface);
      if (distance < smallest_distance) {
        smallest_distance = distance;
        target = pointOnSurface;
        closestObj = objects[i];
      }
    }
    if(closestObj != 0){
      var dx = new Vector(0,0);
      dx = closestObj.end.subtract(closestObj.begin);
      dx = dx.normalize().multiply(20);
      var dy = dx.moveByAngle(Math.PI / 2)
      var targetDir = target.add(dx);
      targetDir = targetDir.add(dy);
      var distance = predictPoint.distanceBetweenPoints(target);
      if (displayForces == "on") {
        this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(predictPoint.x, predictPoint.y);
        this.ctx.lineTo(target.x,target.y);
        this.ctx.lineTo(target.add(dx).x, target.add(dx).y );
        this.ctx.lineTo(targetDir.x,targetDir.y);
        this.ctx.strokeStyle = "rgb(34,139,34)";
        this.ctx.stroke();
        this.ctx.closePath();
        this.renderCircleAround(targetDir.x,targetDir.y,5,3,"#F55F20");
      }
      if(distance < 15 || distance > 25){
        if(displayForces == "on"){
          this.renderVectorTo(targetDir.x,targetDir.y);
        }
        return targetDir;
      }
      else{
        return new Vector(0,0);
      }
    }
    return new Vector(0,0);
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
      return sumVector;
    }
    else{
      return new Vector(0,0);
    }
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
      return sumVector;
    }
    else {
      return new Vector(0,0);
    }
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
      sumVector = this.seek(sumVector.x,sumVector.y);
      return sumVector;
    }
    else {
      return new Vector(0,0);
    }
  }

  followLeader(Vehicle, offset,predDistance, radius, displayForces = 'off') {
    var predictedPosition = Vehicle.velocity.normalize();
    predictedPosition = predictedPosition.multiply(predDistance*2);
    predictedPosition = predictedPosition.add(Vehicle.position);
    var normalPoint = this.position.normalPoint(Vehicle.position,predictedPosition);
    if (displayForces == 'on') {
      this.ctx = canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(Vehicle.position.x, Vehicle.position.y);
      this.ctx.lineTo(predictedPosition.x, predictedPosition.y);
      this.ctx.lineWidth = radius * 3;
      this.ctx.strokeStyle = "rgba(50,155,50,0.1)";
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(Vehicle.position.x, Vehicle.position.y);
      this.ctx.lineTo(predictedPosition.x, predictedPosition.y);
      this.ctx.strokeStyle = "#00C691";
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if(this.position.isBetween(Vehicle.position,predictedPosition)){
      var steerAway = this.position.subtract(normalPoint);
      steerAway = steerAway.normalize().multiply(100);
      steerAway = steerAway.add(this.position);
      if(displayForces == "on"){
        this.renderVectorTo(steerAway.x,steerAway.y,"red",1)
      }
      return steerAway;
    }
    else{
      var target = Vehicle.velocity.normalize().multiply(-1);
      target = target.multiply(offset);
      target = target.add(Vehicle.position)
      if(displayForces == "on"){
        this.renderVectorTo(target.x, target.y);
      }
      return target;
    }
  }

  unalignedCollisionAvoidance(Vehicles,futurePos=this.maxspeed,displayForces = 'off'){
    var predictedPosition = this.velocity.normalize().multiply(futurePos);
    predictedPosition = predictedPosition.add(this.position);
    if(displayForces=="on"){
      this.renderVectorTo(predictedPosition.x,predictedPosition.y);
    }
    for (let i = 0; i < Vehicles.length; i++) {
      if(Vehicles[i].position.x != this.position.x &&
         Vehicles[i].position.y != this.position.y
        ){
        var avoidPosition = Vehicles[i].velocity.normalize().multiply(futurePos);
        avoidPosition = avoidPosition.add(Vehicles[i].position);
        if(predictedPosition.distanceBetweenPoints(avoidPosition) < this.radius*2){
          var avoid = avoidPosition.mirror(this.position);
          if(this.velocity.length() > (this.maxspeed/2)){
            if(displayForces=="on"){
              this.renderVectorTo(Vehicles[i].position.x,Vehicles[i].position.y,"white");
            }
            avoid = avoid.add(this.velocity.multiply(-0.5));
          }
          else if(this.velocity.length() <= (this.maxspeed/2)){
            if(displayForces=="on"){
              this.renderVectorTo(Vehicles[i].position.x,Vehicles[i].position.y,"white");
            }
            avoid = avoid.add(this.velocity.multiply(0.5));
          }
          if(displayForces=="on"){
            this.renderVectorTo(avoid.x,avoid.y,"green");
          }
          return avoid;
        }
      }
    }
    return new Vector(0,0);
  }

  queue(Vehicles, VehAhead, VehRadius,displayForces = 'off') {
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
      brake = brake.add(this.velocity.multiply(-0.6));
      if(this.position.distanceBetweenPoints(neighbour.position) <= VehRadius*1.5){
        return this.velocity.multiply(-0.3);
      }
    }
    if(displayForces == 'on'){
      this.renderCircleAround(circleAhead.x,circleAhead.y,VehRadius);
      this.renderCircleAround(this.position.x,this.position.y,VehRadius*1.5);
      this.renderVectorTo(this.position.x + (brake.x * 10), this.position.y + (brake.y * 10),"red");
    }
    return brake;
  }

  flock(Vehicles,SepMulti,AliMulti,CohMulti) {
    var separate = this.separation(Vehicles);
    separate = separate.multiply(SepMulti);
    this.applyForce(separate);

    var align = this.align(Vehicles);
    align = align.multiply(AliMulti);
    this.applyForce(align);

    var cohesion = this.cohesion(Vehicles);
    cohesion = cohesion.multiply(CohMulti);
    this.applyForce(cohesion);

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
  renderVectorTo(x, y, colour = 'Red',width = 2) {
    this.ctx = canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = colour;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.lineWidth = 1;
  }
  renderCircleAround(x, y, r = this.radius, width=1, colour = "rgba(255, 0, 255,0.5)") {
    this.ctx = canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.strokeStyle = colour;
    this.ctx.stroke();
    this.ctx.closePath();
  }
  renderForces() {
    this.ctx = canvas.getContext("2d");
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.desiredVelocity.x * 10, this.desiredVelocity.y * 10);
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