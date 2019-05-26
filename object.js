class objectCircle  {
    constructor(x, y, r) {
        this.center = new Vector(x,y),
        this.radius = r;
    }

    hasInside(point,vehiclePosition){
        var normalPoint = this.center.normalPoint(point,vehiclePosition);
        if((point.distanceBetweenPoints(this.center) < this.radius)){
            return true;
        }
        else if((normalPoint.distanceBetweenPoints(this.center) < this.radius) && normalPoint.isBetween(vehiclePosition,point)){
            return true;
        }
        else{
            return false;
        }
    }

    projectedPointOnSurface(point,vehiclePosition){
        var a0 = (point.y - vehiclePosition.y) / (point.x - vehiclePosition.x);
        var b0 = point.y - (point.x * a0);
        var a = (1+(a0*a0));
        var b = ((-2*this.center.x) + (2*a0*b0) - (2*this.center.y*a0));
        var c = ((this.center.x*this.center.x) + (this.center.y*this.center.y) + (b*b) - (2*this.center.y*b0) - (this.radius*this.radius));
        var delta = b*b - (4*a*c);
        var x0,x1;
        if( delta>0){
            x0 = (-b - Math.sqrt(delta)) / (2 * a);
            x1 = (-b + Math.sqrt(delta)) / (2 * a);
        }
        else{
            x0 = (-b)/(2*a);
            x1 = null;
        }
        var surfacePoint = new Vector(x0,a0*x0 + b0);
        ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(surfacePoint.x, surfacePoint.y, 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();

        var pointNearEucliCenter = surfacePoint.subtract(this.center);
        var pointLength = pointNearEucliCenter.length();
        var pointOnSurface = pointNearEucliCenter.multiply(this.radius / pointLength);
        return pointOnSurface.add(this.center);
    }

    normalVector(projectedPoint,point){
        var length = point.distanceBetweenPoints(projectedPoint);
        projectedPoint = projectedPoint.subtract(this.center);
        var radius = projectedPoint.normalize().multiply(this.radius),
            normalVector = projectedPoint.normalize().multiply(length);
        return radius.add(normalVector);
    }
    draw(color = "rgba(200, 0, 200,0.3)"){
        ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
}

class objectWall {
    constructor(x1, y1, x2, y2) {
        this.begin = new Vector(x1,y1),
        this.end = new Vector(x2,y2);
    }

    hasInside(point,vehiclePosition){
        var crossPoint = 0;
        var a1 = (point.y - vehiclePosition.y) / (point.x - vehiclePosition.x);
        var b1 = point.y - (point.x * a1);
        var a2 = (this.begin.y - this.end.y) / (this.begin.x - this.end.x);
        if(a2 == Infinity){
            crossPoint = new Vector(this.begin.x,point.y);
        }
        else{
            var b2 = this.begin.y - (this.begin.x * a2);
            var x0 = (b1-b2) / (a2-a1);
            var y0 = a2*x0 + b2;
            crossPoint = new Vector(x0,y0);
        }
        /*
        ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(crossPoint.x, crossPoint.y, 4, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();
        */
        if(crossPoint.isBetween(this.begin,this.end)){
            if(crossPoint.isBetween(point,vehiclePosition)){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    projectedPointOnSurface(point,vehiclePosition){
        return point.normalPoint(this.begin,this.end);
    }

    normalVector(projectedPoint,point){
        var length = point.distanceBetweenPoints(projectedPoint);
        var pointNearEucliCenter = projectedPoint.subtract(point);
        return pointNearEucliCenter.normalize().multiply(length);
    }

    draw(color = "rgba(200, 0, 200,0.3)"){

        ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.moveTo(this.begin.x,this.begin.y);
        //ctx.lineTo(this.begin.x,this.end.y);
        ctx.lineTo(this.end.x,this.end.y);
        //ctx.lineTo(this.end.x,this.begin.y);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.lineWidth = 1;

    }
}

