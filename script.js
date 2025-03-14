const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/background/back2/background.png'
})

const shop = new Sprite({
    position: { x: 600, y: 128 },
    imageSrc: './img/background/back2/shop.png',
    scale: 2.75,
    framesMax: 6
})

// Jogador 1
const player = new Fighter({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },

    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle: { imageSrc: './img/samuraiMack/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/samuraiMack/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/samuraiMack/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/samuraiMack/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/samuraiMack/Attack1.png', framesMax: 6 },
        pegarhit: { imageSrc: './img/samuraiMack/Take Hit - white silhouette.png', framesMax: 4 },
        death: { imageSrc: './img/samuraiMack/Death.png', framesMax: 6 }
    },
    attbox: {
        offset: { x: 100, y: 50 },
        width: 160,
        height: 50
    }
})

// Jogador 2
const pc = new Fighter({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: { x: -50, y: 0 },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: { x: 215, y: 167 },
    sprites: {
        idle: { imageSrc: './img/kenji/Idle.png', framesMax: 4 },
        run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/kenji/Attack1.png', framesMax: 4 },
        takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 3 },
        death: { imageSrc: './img/kenji/Death.png', framesMax: 7 }
    },
    attbox: {
        offset: { x: -170, y: 50 },
        width: 170,
        height: 50
    }
})

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false }
}

ReduceTime()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Background
    background.update()
    shop.update()

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Players
    player.update()
    pc.update()

    player.velocity.x = 0
    pc.velocity.x = 0

    // Player movimentação
    if (keys.a.pressed && player.ukey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.ukey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Pc movimentação
    if (keys.ArrowLeft.pressed && pc.ukey === 'ArrowLeft') {
        pc.velocity.x = -5
        pc.switchSprite('run')
    } else if (keys.ArrowRight.pressed && pc.ukey === 'ArrowRight') {
        pc.velocity.x = 5
        pc.switchSprite('run')
    } else {
        pc.switchSprite('idle')
    }

    if (pc.velocity.y < 0) {
        pc.switchSprite('jump')
    } else if (pc.velocity.y > 0) {
        pc.switchSprite('fall')
    }

    // Detectar colisão
    if (collisionRec({ rectangle1: player, rectangle2: pc }) && player.strike && player.framesCurrent === 4) {
        pc.pegarhit()
        player.strike = false
        gsap.to('#pclife', { width: pc.hp + '%' })
    }

    if (player.strike && player.framesCurrent === 4) {
        player.strike = false
    }

    if (collisionRec({ rectangle1: pc, rectangle2: player }) && pc.strike && pc.framesCurrent === 2) {
        player.pegarhit()
        pc.strike = false
        gsap.to('#playerlife', { width: player.hp + '%' })
    }

    if (pc.strike && pc.framesCurrent === 2) {
        pc.strike = false
    }

    // Fim de jogo
    if (pc.hp <= 0 || player.hp <= 0) {
        determineVencedor({ player, pc, timerId })
    }
}

animate()

// Eventos de teclado
window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.ukey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.ukey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case 'f':
                player.attack()
                break
        }
    }

    if (!pc.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                pc.ukey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                pc.ukey = 'ArrowLeft'
                break
            case 'ArrowUp':
                pc.velocity.y = -20
                break
            case 'ArrowDown':
                pc.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    if (event.key === 'd') keys.d.pressed = false
    if (event.key === 'a') keys.a.pressed = false
    if (event.key === 'ArrowRight') keys.ArrowRight.pressed = false
    if (event.key === 'ArrowLeft') keys.ArrowLeft.pressed = false
})
