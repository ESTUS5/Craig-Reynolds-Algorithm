class Vector {
    constructor(x, y) {
        this.x = x,
        this.y = y;
    }
    equal(other) {
        this.x = other.x,
            this.y = other.y;
    }
    add(other) {
        if (other instanceof Vector)
            return new Vector(this.x + other.x, this.y + other.y);
        else
            return new Vector(this.x + other, this.y + other);
    }
    subtract(other) {
        if (other instanceof Vector)
            return new Vector(this.x - other.x, this.y - other.y);
        else
            return new Vector(this.x - other, this.y - other);
    }
    multiply(other) {
        if (other instanceof Vector)
            return new Vector(this.x * other.x, this.y * other.y);
        else
            return new Vector(this.x * other, this.y * other);
    }
    divide(other) {
        if (other instanceof Vector)
            return new Vector(this.x / other.x, this.y / other.y);
        else
            return new Vector(this.x / other, this.y / other);
    }
    dotProduct(other) {
        return this.x * other.x + this.y * other.y;
    }
    length() {
        return (Math.sqrt(this.dotProduct(this)));
    }
    normalize() {
        if (this.x == 0 && this.y != 0) {
            return new Vector(0, this.y / this.length());
        }
        else if (this.y == 0 && this.x != 0) {
            return new Vector(this.x / this.length(), 0);
        }
        else if (this.y == 0 && this.x == 0) {
            return new Vector(0, 0);
        }
        else {
            return new Vector(this.x / this.length(), this.y / this.length());
        }
    }
    angle(other) {
        return Math.acos(this.dotProduct(other) / (this.length() * this.length()));
    }
    moveByAngle(angle){
        var xPrim = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        var yPrim = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector(xPrim, yPrim);
    }
    limit(limiter) {
        if (this.length() > limiter) {
            this.equal(this.normalize().multiply(limiter));
        }
    }
    distanceBetweenPoints(other) {
        return (Math.sqrt((this.x - other.x) * (this.x - other.x)
            + (this.y - other.y) * (this.y - other.y)));
    }
    map(d, outputMax, outputMin, inputMax, inputMin) {
        return outputMin + (outputMax - outputMin) * ((d - inputMin) / (inputMax - inputMin));
    }
    normalPoint(a, b) {
        var ap = this.subtract(a),
            ab = b.subtract(a).normalize();
        ab = ab.multiply(ap.dotProduct(ab));
        return a.add(ab);
    }
    //returns True if point is in rectangle made of A & B
    isBetween(a,b){
        if((a.x >= this.x && b.x <= this.x) || (a.x <= this.x && b.x >= this.x) ){
            if((a.y >= this.y && b.y <= this.y) || (a.y <= this.y && b.y >= this.y) ){
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
    mirror(other) {
        return new Vector(other.x - (this.x - other.x),
            other.y - (this.y - other.y));
    }
}
