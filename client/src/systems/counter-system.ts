import Engine from "../engine";
import { Entity, GameSystem } from "../types";



export default class CounterSystem implements GameSystem {
    name: string = 'counter';
    started: boolean = false;
    currentValue: number = 0;

    coundDown(){
        
        this.currentValue--
        
        if(this.currentValue > 0){
            setTimeout(() => {
                this.coundDown()
            }, 1000)
        }else {
            this.started = false
        }
    }

    func(engine: Engine, entity: Entity & {value: number}) {

        
        if(engine.texts.gameStatus == 'PRE-STARTED'){
            if(!this.started){
                this.started= true
                this.currentValue = Number(engine.texts.counter)
                this.coundDown()
            }else{
                
                entity.value = this.currentValue
            }
            
        }

    }




    
}