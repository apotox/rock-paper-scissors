import Engine from "../engine";
import { Entity, GameSystem } from "../types";
import Counter from '../entities/counter'


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

    func(engine: Engine, entity: Counter) {

        
        if(engine.texts.gameStatus == 'PRE-STARTED'){
            if(!this.started){
                entity.visible = true
                this.started= true
                this.currentValue = Number(engine.texts.counter)
                this.coundDown()
            }else{
                
                entity.value = this.currentValue
            }
            
        }else {
            entity.value = 0
            entity.visible = false
        }

    }




    
}