

const GAME_STATUSES = {
    'WAITING': 'WAITING',
    'PRESTARTED': 'PRE-STARTED',
    'STARTED': 'STARTED',
    'FINISHED': 'FINISHED',

}


const GAME_BEAT_RULES = {
    'paper': 'rock',
    'rock': 'scissors',
    'scissors': 'paper'
}


const GAME_LIFE_TIME = 4 * 1000;
const GAME_START_TIME = 5 * 1000;


module.exports = {
    GAME_STATUSES,
    GAME_BEAT_RULES,
    GAME_LIFE_TIME,
    GAME_START_TIME
}