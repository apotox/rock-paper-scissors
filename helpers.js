const { GAME_BEAT_RULES } = require("./consts")

const getWinner = (gameResult) => {

    const playersIds = Object.keys(gameResult)

    if(playersIds.length === 0){
        return {
            winner: 'none',
            reason: 'players didnt play!'
        }
    }

    if(playersIds.length === 1) {
        return {
            winner: playersIds[0],
            reason: 'the opponent left the game'
        }
    }

    const playersTouchs = Object.values(gameResult)

    const player1touch = playersTouchs[0];
    const player2touch = playersTouchs[1];

    if(player2touch == GAME_BEAT_RULES[player1touch]){
        return {
            winner: playersIds[0],
            reason: `${player1touch} beat ${player2touch}`
        }
    }else if(player2touch == player1touch){
        return {
            winner: 'none',
            reason: 'draw'
        }
    }else{
        return {
            winner: playersIds[1],
            reason: `${player2touch} beat ${player1touch}`
        }
    }

}



module.exports = {
    getWinner
}