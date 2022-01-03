import Engine from "../engine";
import { Entity } from "../types";
console.log('init counter')
export default class Counter implements Entity {
    id: string;
    systems: string[];
    
    x: number;
    y: number;
    value: number = 0;

    constructor(id: string, x: number, y: number) {
        console.log('draw counter')
        this.id = id;
        this.systems = ['counter'];
      
        this.x = x;
        this.y = y;
    }

    draw (engine: Engine) {
        const ctx = engine.ctx
        ctx.save()
        ctx.font = '20px pixel';
        ctx.fillStyle = 'white';
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText( String(this.value), this.x + 24, this.y);
        ctx.restore()
    }

}