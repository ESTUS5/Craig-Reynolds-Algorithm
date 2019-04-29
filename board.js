class Board {
    constructor(width, hight, divisions) {
        this.width = width;
        this.hight = hight;
        this.divisions = divisions;
        this.wd = this.width / this.divisions;
        this.hd = this.hight / this.divisions;
        this.vectors_arr = 0;
    }
    create_vectors(len = 50) {
        var vectors_arr = new Array(this.divisions);
        for (let width_idx = 0, width_of_sqr = (canvas.width/(this.divisions)); width_idx < vectors_arr.length; width_idx++ , width_of_sqr += (canvas.width/(this.divisions))) {
            vectors_arr[width_idx] = new Array(this.divisions);
            for (let hight_idx = 0, hight_of_sqr = (canvas.height/(this.divisions)); hight_idx < vectors_arr.length; hight_idx++ , hight_of_sqr += (canvas.height/(this.divisions))) {
                vectors_arr[width_idx][hight_idx] = new Array(4);
                var dx = this.width / 2 - width_of_sqr + (canvas.width/(this.divisions*2));
                var dy = this.hight / 2 - hight_of_sqr + (canvas.height/(this.divisions*2));
                var theta = Math.atan2(dy, dx);
                vectors_arr[width_idx][hight_idx][0] = width_of_sqr - (canvas.width/(this.divisions*2)) + len * Math.cos(theta);
                vectors_arr[width_idx][hight_idx][1] = hight_of_sqr - (canvas.height/(this.divisions*2)) + len * Math.sin(theta);
                vectors_arr[width_idx][hight_idx][2] = width_of_sqr;
                vectors_arr[width_idx][hight_idx][3] = hight_of_sqr;
            }
        }
        this.vectors_arr = vectors_arr;
    }
    move_vector(mouse) {
        for (let x = 0; x < this.divisions; x++) {
            if (mouse.x < this.vectors_arr[x][0][2]) {
                for (let y = 0; y < this.divisions; y++) {
                    if (mouse.y < this.vectors_arr[x][y][3]) {
                        var moveX = (this.vectors_arr[x][y][2] - (this.wd / 2)), moveY = (this.vectors_arr[x][y][3] - (this.hd / 2));
                        var temp = new Vector(mouseObj.x - moveX, mouseObj.y - moveY);
                        temp = temp.normalize();
                        temp = temp.multiply(canvas.height / (this.divisions*2));
                        this.vectors_arr[x][y][0] = moveX + temp.x;
                        this.vectors_arr[x][y][1] = moveY + temp.y;
                        return 0;
                    }
                }
            }
        }
    }
    vectors(obj_posX, obj_posY) {
        for (let x = 0; x < this.divisions; x++) {
            if (obj_posX < this.vectors_arr[x][0][2]) {
                for (let y = 0; y < this.divisions; y++) {
                    if (obj_posY < this.vectors_arr[x][y][3]) {
                        return [this.vectors_arr[x][y][0], this.vectors_arr[x][y][1]];
                    }
                }
            }
        }
    }
    tile(obj_posX, obj_posY) {
        for (let x = 0; x < this.divisions; x++) {
            if (obj_posX < this.vectors_arr[x][0][2]) {
                for (let y = 0; y < this.divisions; y++) {
                    if (obj_posY < this.vectors_arr[x][y][3]) {
                        if (this.vectors_arr[x][y][0] > (this.vectors_arr[x][y][2] - (canvas.width/(this.divisions*2)))) {
                            var bx = this.vectors_arr[x][y][2] + 1;
                        }
                        else {
                            var bx = this.vectors_arr[x][y][2] - (canvas.width/this.divisions) - 1;
                        }
                        var a = (this.vectors_arr[x][y][1] - (this.vectors_arr[x][y][3] - (canvas.height/(this.divisions*2)))) / (this.vectors_arr[x][y][0] - (this.vectors_arr[x][y][2] - (canvas.width/(this.divisions*2))));
                        if (a == Infinity || a == -Infinity) {
                            a = 0;
                        }
                        var b = obj_posY - a * obj_posX;
                        var by = a * bx + b;
                        if (by > this.vectors_arr[x][y][3]) {
                            by = this.vectors_arr[x][y][3];
                            bx = (by - b) / a;
                        }
                        else if (by < this.vectors_arr[x][y][3] - (canvas.height/this.divisions)) {
                            by = this.vectors_arr[x][y][3] - (canvas.height/this.divisions);
                            bx = (by - b) / a;
                        }
                        return [bx, by];
                    }
                }
            }
        }
    }
    draw() {
        this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();
        for (let index_H = this.hd; index_H <= this.hight; index_H += this.hd) {
            for (let index_W = 0; index_W < this.width; index_W += this.wd) {
                this.ctx.moveTo(index_W, index_H);
                this.ctx.lineTo(index_W + this.wd, index_H);
                this.ctx.lineTo(index_W + this.wd, index_H - this.hd);
                this.ctx.moveTo(index_W + this.wd / 2, index_H - this.hd / 2);
                var VectorPointing = this.vectors(index_W + 1, index_H - 1);
                this.ctx.lineTo(VectorPointing[0], VectorPointing[1]);
            }
        }
        this.ctx.strokeStyle = "rgba(255,0,0,0.5)";
        this.ctx.stroke();
        this.ctx.closePath();
    }
}








