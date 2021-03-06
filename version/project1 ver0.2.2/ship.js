function Ship(x, y) {
    // property

    //location
    this.x = x;
    this.y = y;
    this.r = 12;
    //move
    this.dx = 0;
    this.dy = 0;
    this.speed = 5;
    this.sp = this.speed * 1 / Math.sqrt(2); // sp * 0.707
    //point
    this.score = 0;
    //hp
    this.lives = 3;
    this.recoverying = false;
    this.recoveryTimer = 0;
    this.recoveryDelay = 2000;
    //key cheak
    this.keys = {};
    //bullet fire
    this.bulletSize = 3.5;
    this.firingDelay = 200;
    this.firingTimer = 0;
    //power
    this.powerLevel = 0;
    this.power = 0;
    this.requiredPower = [1, 2, 3, 4, 5, 7, 9, 11, 13];
    //color
    this.colorType = 0;
    //outside -> inside
    this.colorArr = [["rgba(222, 222, 222, 0.7)", "#FFF"],
    ["rgba(255, 68, 0, 0.7)", "#F00"]];

    //----------function----------------------------------
    this.hit = function () {
        if (this.recoverying) return;// wait recovery time        
        this.lives = Math.max(this.lives - 1, 0);
        this.recoverying = true;
        this.recoveryTimer = new Date().getTime();
        this.colorType = 1;
    }

    this.increasePower = function (i) {
        var powerNum = this.requiredPower[this.powerLevel];
        this.power = Math.min(this.power + i, powerNum);// 不超出當前等級的力量上限
        //如果子彈達到進化要求 && 子彈等級不超過上限等級 : 等級+1
        if (this.power >= powerNum && this.powerLevel < this.requiredPower.length - 1) {
            this.power -= powerNum;
            this.powerLevel = Math.min(this.powerLevel + 1, this.requiredPower.length - 1);// 不超出當前等級進化上限
            console.log("PowerLevel:" + this.powerLevel);
        }
    }

    this.getRequiredPower = function () {
        return this.requiredPower[this.powerLevel];
    }

    this.update = function () {
        //move --> 37:LEFT 38:UP 39:RIGHT 40:DOWN
        
        if(this.keys[38] && this.keys[37]){ this.dx -= this.sp; this.dy -= this.sp} else
        if(this.keys[38] && this.keys[39]){ this.dx += this.sp; this.dy -= this.sp} else
        if(this.keys[40] && this.keys[37]){ this.dx -= this.sp; this.dy += this.sp} else
        if(this.keys[40] && this.keys[39]){ this.dx += this.sp; this.dy += this.sp} else
        
        if(this.keys[37]) this.dx -= this.speed; else
        if(this.keys[39]) this.dx += this.speed; else
        if(this.keys[38]) this.dy -= this.speed; else
        if(this.keys[40]) this.dy += this.speed;
        
        this.x += this.dx;
        this.y += this.dy;
        this.dx = 0;
        this.dy = 0;

        //cheak edge
        if (this.x < this.r) this.x = this.r;
        if (this.y < this.r) this.y = this.r;
        if (this.x > canvas.width - this.r) this.x = canvas.width - this.r;
        if (this.y > canvas.height - this.r) this.y = canvas.height - this.r;

        //firing --> 90:Z
        if (this.keys[90]) {
            var elapsed = new Date().getTime() - this.firingTimer;

            if (elapsed > this.firingDelay) {

                if (this.powerLevel <= 1) {
                    bullets.push(new Bullet(this.x, this.y, this.bulletSize, 270));
                } else if (this.powerLevel <= 3) {
                    bullets.push(new Bullet(this.x + 5, this.y, this.bulletSize, 270));
                    bullets.push(new Bullet(this.x - 5, this.y, this.bulletSize, 270));
                } else if (this.powerLevel <= 5) {
                    bullets.push(new Bullet(this.x, this.y, this.bulletSize, 270));

                    bullets.push(new Bullet(this.x + 5, this.y, this.bulletSize, 270 + 5));
                    bullets.push(new Bullet(this.x - 5, this.y, this.bulletSize, 270 - 5));
                } else if (this.powerLevel <= 7) {
                    bullets.push(new Bullet(this.x - 5, this.y, this.bulletSize, 270));
                    bullets.push(new Bullet(this.x + 5, this.y, this.bulletSize, 270));

                    bullets.push(new Bullet(this.x + 7, this.y, this.bulletSize, 270 + 7));
                    bullets.push(new Bullet(this.x - 7, this.y, this.bulletSize, 270 - 7));
                } else {
                    bullets.push(new Bullet(this.x, this.y, this.bulletSize, 270));
                    bullets.push(new Bullet(this.x + 5, this.y, this.bulletSize, 270 + 5));
                    bullets.push(new Bullet(this.x - 5, this.y, this.bulletSize, 270 - 5));

                    bullets.push(new Bullet(this.x + 10, this.y + 5, this.bulletSize, 270 + 7));
                    bullets.push(new Bullet(this.x - 10, this.y + 5, this.bulletSize, 270 - 7));
                }

                this.firingTimer = new Date().getTime();
            }
        }

        //recovery
        if (this.recoverying &&
            new Date().getTime() - this.recoveryTimer > this.recoveryDelay) {
            this.recoveryTimer = 0;
            this.recoverying = false;
            this.colorType = 0;
        }
    }

    this.render = function (ctx) {
        ctx.save();

        ctx.fillStyle = this.colorArr[this.colorType][0];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.colorArr[this.colorType][1];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.55, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}