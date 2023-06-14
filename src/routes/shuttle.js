
export default class Shuttle {
    constructor(size, x, y, force, angle, damp, tension) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.force = force;
        this.angle = angle;
        this.damp = damp;
        this.tension = tension;
    }

    draw(context) {
        context.fillStyle = "white";
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill();
        this.drawAngle(context)
    }

    drawAngle(context) {
        let length = 150;
        let angle_rad = this.angle * Math.PI/180
        let tox = length * Math.sin(angle_rad)
        let toy = length * Math.cos(angle_rad);
        context.lineWidth = 5;
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(this.x, this.y)
        context.lineTo(tox + this.x, toy+this.y)
        context.stroke();
    }

    vertical_displacement(time) {
        let v = this.getInitialVelocity() - time * this.damp
        let angle_rad = (this.angle) * Math.PI/180
        return (v * Math.cos(angle_rad) * time) - (0.5 * 0.98 * Math.pow(time, 2)) + this.y;
    }

    horizontal_displacement(time){
        let v = this.getInitialVelocity() - time * this.damp
        let angle_rad = this.angle * Math.PI/180
        return (v * Math.sin(angle_rad)) * time + this.x;
    }

    getInitialVelocity(){
        return (1/this.tension*3) * this.force;
    }
}

