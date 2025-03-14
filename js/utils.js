function collisionRec({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attbox.position.x + rectangle1.attbox.width >=
        rectangle2.position.x &&
      rectangle1.attbox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attbox.position.y + rectangle1.attbox.height >=
        rectangle2.position.y &&
      rectangle1.attbox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }

  function determineVencedor({player, pc, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'

        if(player.hp === pc.hp){
            document.querySelector('#displayText').innerHTML = 'Empate'
        }
        else if(player.hp > pc.hp){
            document.querySelector('#displayText').innerHTML = 'Jogador 1 Venceu!'
        }

        else if(player.hp < pc.hp){
            document.querySelector('#displayText').innerHTML = 'Jogador 2 Venceu!'
        }
}

let timer = 60
let timerId

function ReduceTime(){
    if(timer > 0){
        timerId = setTimeout(ReduceTime, 1000)
        timer--
        document.querySelector('#time').innerHTML = timer
    }

    if(timer == 0){
         determineVencedor({player, pc, timerId})
    }
}