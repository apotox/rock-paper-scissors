import canvas, { CANVAS_H, CANVAS_W } from "./canvas";
import Engine from "./engine";
import Button from "./entities/button";
import TouchSystem from "./systems/touch-system";
import { Images } from "./types";
import Client from "./socket-client";
import Counter from "./entities/counter";
import CounterSystem from "./systems/counter-system";

const BASE_URL = window.location.protocol + '//' + window.location.host;

(async () => {

    const roomId = window.location.hash.substr(1)

    if(!roomId) {
        const randomId = Math.random().toString(36).substr(2, 5)
        window.location.hash = randomId
        document.getElementById('shared-link').setAttribute('value',`${BASE_URL}/#${randomId}` )
        document.getElementById('create-new-game').style.visibility = 'visible'
        return
    }

    const client = new Client(roomId || 'default');

    //load fonts
    await document.fonts.load("120px pixel")
    console.log('font loaded')

    const engine = new Engine(canvas, client)


    const space = CANVAS_W / 4

    engine.addEntity(new Button(Images.paper, space, CANVAS_H / 2, ['touch']))
    engine.addEntity(new Button(Images.rock, 2 * space, CANVAS_H / 2, ['touch']))
    engine.addEntity(new Button(Images.scissors, 3 * space, CANVAS_H / 2, ['touch']))

    //add counter
    engine.addEntity(new Counter('counter', 0, CANVAS_H / 20))

    engine.addSystem(new TouchSystem())
    engine.addSystem(new CounterSystem())

    engine.start()




})()