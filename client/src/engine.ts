import { CANVAS_H, CANVAS_W } from './canvas';
import Client from './socket-client';
import { Entity, Game, GameSystem } from './types'

export default class Engine {

    public game: Game;
    systems: GameSystem[] = [];
    setIntervalHandler: any;
    ctx: CanvasRenderingContext2D;
    client: Client = null;
    // texts
    texts =  {
        title: 'RPS',
        counter: 0,
        gameStatus: 'none'
    };
    constructor(public canvas: HTMLCanvasElement, client: Client) {
        this.game = {
            entities: [],
            id: 'game'
        }
       
        this.ctx = canvas.getContext('2d');

        console.log('engine initialized')
        this.client = client
        this.client.socket.on('message', (data: any) => {
            console.log(data)
            if(data.type === 'counter'){
                this.texts.counter = data.value
            }

        })

        this.client.socket.on('joined', (data: any) => {
            console.log('joined',data)
          
        })

        this.client.socket.on('start', (data: any) => {
            console.log('start',data)
          
        })

        this.client.socket.on('game-status', (data: any) => {
            console.log('game-status',data)
            this.texts.gameStatus = data.status
            switch(data.status){
                case 'PRE-STARTED':
                    this.texts.counter = Number(data.startIn)
                    break
                case 'STARTED':

                    this.texts.counter = 0
                    break
                case 'FINISHED':
                    this.texts.counter = 0
                    break
                default:
                    break;
            }
        })

    }





    addEntity(entity: Entity) {
        this.game.entities.push(entity);
    }

    addSystem(sys: GameSystem) {
        this.systems.push(sys);
    }

    
    drawHeader(){
        this.ctx.save()
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = '#3f51b5'
        this.ctx.fillRect(0,0, CANVAS_W, CANVAS_H / 10)
        this.ctx.font = "22px pixel";
        this.ctx.textAlign="center"; 
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(this.texts.gameStatus, CANVAS_W / 2 , CANVAS_H / 20 );


        this.ctx.restore()
    }
    

    update() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        
        this.drawHeader()
        
        this.game.entities.forEach(entity => {
            this.systems.filter(sys => entity.systems.includes(sys.name)).forEach(system => {
                system.func(this,entity);
            });

            entity.draw(this);
        })
    }



    start(){
        if(this.setIntervalHandler){
            clearInterval(this.setIntervalHandler)
        }
        this.setIntervalHandler = setInterval(this.update.bind(this), 100);
    }
}