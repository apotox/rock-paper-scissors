import Engine from "../engine";
import { Entity, GameSystem } from "../types";

const TOUCH_AREA_WIDTH = 24;

const INIT_TOUCHES = { x: 0, y: 0 }
export default class TouchSystem implements GameSystem {
    name: string;


    private lastTouchedPosition: { x: number, y: number } = INIT_TOUCHES



    func(engine: Engine, entity: Entity) {
        if (engine.variables.gameStatus !== 'STARTED') return
        if (Math.abs(entity.x - this.lastTouchedPosition.x) < TOUCH_AREA_WIDTH && Math.abs(entity.y - this.lastTouchedPosition.y) < TOUCH_AREA_WIDTH) {

            this.lastTouchedPosition.x = 0
            this.lastTouchedPosition.y = 0

            const ctx = engine.canvas.getContext('2d');
            // draw touch effect
            ctx.beginPath();
            ctx.arc(entity.x, entity.y, TOUCH_AREA_WIDTH, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();


            engine.variables.title = entity.id

            entity.onTouched()


            engine.client.socket.emit('touch', {
                touchId: entity.id
            })
        }
    }


    handleClick(e: any) {
        console.log('handleClick')
        let x;
        let y;
        if (e instanceof TouchEvent) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
        console.log(x, y)
        this.lastTouchedPosition.x = x;
        this.lastTouchedPosition.y = y;
    }
    constructor() {
        this.name = 'touch';

        const body = document.getElementsByTagName('body')[0];

        body.addEventListener('touchstart', this.handleClick.bind(this));
        body.addEventListener('mousedown', this.handleClick.bind(this));

    }
}