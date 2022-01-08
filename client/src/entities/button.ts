

import Engine from "../engine";
import { Entity, Images } from "../types";

const BUTTON_WIDTH = 24;
const BUTTON_HEIGHT = 32;
export default class Button implements Entity {
    id: string;
    systems: string[];
    backgroudImageId: string;
    x: number;
    y: number;
    self: Button = this

    draw(engine: Engine) {
        if(engine.variables.gameStatus !== 'STARTED') return
        const ctx = engine.canvas.getContext('2d');
        if (this.backgroudImageId) {
            const img = document.getElementById(this.backgroudImageId) as CanvasImageSource;
            ctx.drawImage(img, this.x - (  BUTTON_WIDTH / 2 ), this.y - (BUTTON_HEIGHT / 2), BUTTON_WIDTH, BUTTON_HEIGHT);
        }
    }

    onTouched(){
        console.log('touched', this.id)
    }

    constructor(id: string, x:number, y: number, systems: string[] = ['touch']) {
        this.id = id;
        this.systems = systems;
        this.backgroudImageId = id
        this.x = x;
        this.y = y;
        
    }

}