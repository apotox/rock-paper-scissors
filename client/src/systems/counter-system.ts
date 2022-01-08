import Engine from "../engine";
import { Entity, GameSystem } from "../types";
import Counter from '../entities/counter'


export default class CounterSystem implements GameSystem {
    name: string = 'counter';
    

    func(engine: Engine, entity: Counter) {

        
        if(engine.variables.gameStatus == 'PRE-STARTED'){
                entity.value = engine.variables.counter
                entity.visible = true
        }else {
            entity.visible = false
        }

    }




    
}