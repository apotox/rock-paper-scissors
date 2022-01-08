import { CANVAS_H, CANVAS_W } from './canvas';
import Client from './socket-client';
import { EngineVariables, Entity, Game, GameSystem } from './types'

export default class Engine {

    public game: Game;
    systems: GameSystem[] = [];
    setIntervalHandler: any;
    ctx: CanvasRenderingContext2D;
    client: Client = null;
    playProgress: number = 100; //percent


    startPlayProgress=function(gamePlayTime){
        const v = gamePlayTime / 100
        const m = 100 / v
        const playProcessInterval = setInterval(()=>{

            this.playProgress-= m;
            if(this.playProgress < 0){
                clearInterval(playProcessInterval)
            }

        }, v)
    }
    
    // variables
    variables: EngineVariables =  {
        title: 'RPS',
        counter: 0,
        gameStatus: 'Waiting',
        finalResult: null,
        message: ''
    };

    getPlayerId= function(){
         return String(this.client.socket.id)
    }
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
                this.variables.counter = data.value
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
            this.variables.gameStatus = data.status
            switch(data.status){
                case 'PRE-STARTED':
                    this.variables.counter = 1 * data.startIn
                    break
                case 'STARTED':
                    this.startPlayProgress(1 * data.gameLifeTime)
                    break
                case 'FINISHED':
                    //this.variables.gameResultMessage = data.result
                    console.log('game-status-finished',data, this.getPlayerId())
                    this.variables.finalResult = data.finalResult

                    if(this.variables.finalResult.winner == 'none'){
                        this.variables.message = 'Draw'
                    }else if(this.variables.finalResult.winner == this.getPlayerId()){
                        this.variables.message = 'You Win!'
                    }else {
                        this.variables.message = 'You Lose!'
                    }

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
        this.ctx.fillText(this.variables.gameStatus, CANVAS_W / 2 , CANVAS_H / 20 );

        // draw player id with small text font size
        this.ctx.font = "12px pixel";
        this.ctx.fillText(`Player ID: ${this.getPlayerId()}`, CANVAS_W / 2 , CANVAS_H / 20 + 20 );


        this.ctx.restore()
    }

    drawProgressBar=function(){
        if(this.playProgress <= 0) return
        this.ctx.save()
        this.ctx.fillStyle = 'yellow'
        this.ctx.fillRect(0,CANVAS_H / 10, (this.playProgress * CANVAS_W) / 100, 5)
        this.ctx.restore()
    }

    drawDialogBox=function(){
        if(this.variables.gameStatus !== 'FINISHED') return
        this.ctx.save()
        this.ctx.fillStyle = '#5F4B8BFF'
        this.ctx.fillRect(0, CANVAS_H / 10, CANVAS_W, CANVAS_H / 5)
        // draw text
        this.ctx.font = "22px pixel";
        this.ctx.textAlign="center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = '#E69A8DFF'
        const y = CANVAS_H / 10 + CANVAS_H / 20 
        this.ctx.fillText(this.variables.finalResult?.reason || 'END', CANVAS_W / 2 , y + 4);
        
        this.ctx.fillText(this.variables.message || '', CANVAS_W / 2 , y + 24);
        

        this.ctx.font = "12px pixel";
        this.ctx.fillText('refresh to play again.', CANVAS_W / 2 , y + 54);
        
        this.ctx.restore()
    }


    update() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        
        this.drawHeader()
        this.drawProgressBar()
        this.drawDialogBox()
        
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