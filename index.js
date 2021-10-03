import kaboom from 'kaboom';
import patrol from "./patrol";

kaboom({
	fullscreen : true
})

loadSprite("bean", "bean.2ecb9859.png")
loadSprite("grass", "grass.276f4b80.png")
loadSprite("chest", "chest.93e35047.png")
loadSprite("ghost", "ghost.5367f5e7.png")
loadSprite("potion", "potion.8042a6e3.png")

scene("settings", () => {
	add([
		text("Use wasd to move. Press me again! :>"),
		pos(center()),
		origin('center')
	])

	keyDown(() => {
		go('settings2')
	})
	mouseClick(() => {
		go('settings2')
	})
})

scene("settings2", () => {
	add([
		text("Hover over potions and press space to use them. Press me again! :>"),
		scale(0.5),
		pos(center()),
		origin('center')
	])

	keyDown(() => {
		go('game')
	})
	mouseClick(() => {
		go("game")
	})

})


scene("win", () => {
	add([
		rect(8000, 80),
		color(0,0,0,1),
		pos(center()),
		origin("center")
	])
	add([
		text("You Won!\rPress me to play!"),
		pos(center()),
		origin("center")
	])

	keyDown(() => {
		go('game')
	})

	mouseDown(() => {
		go("game")
	})
})

scene("menu", () => {
	add([
		rect(8000, 80),
		color(0,0,0,1),
		pos(center()),
		origin("center")
	])	
	add([
		text('Press me to play!'),
		pos(center()),
		origin("center")
	])	
	mouseDown(() => {
		go("settings")
	})

	keyDown(() => {
		go('settings')
	})
})

scene("lose", () => {
	add([
		rect(10000, 80),
		color(0,0,0,1),
		pos(center()),
		origin("center")
	])
	add([
		text("You Lose\rPress me to play!"),
		pos(center()),
		origin("center")
	])

	keyDown(() => {
		go('game')
	})

	mouseDown(() => {
		go("game")
	})
})

const levels = [
	[
		"=============================",
		"=       !       *           =",
		"=         =                 =",
		"===========     !    *      =",
		"=                 *         =",
		"=             *     *       =",
		"=     =========             =",
		"=             =   *         =",
		"=             =             =",
		"=      !      =      *      =",
		"=             =             =",
		"=             =  *          =",
		"=             =      *      =",
		"=             =         *   =",
		"=             ====  =========",
		"=    *   *      *  #  *     =",
		"=                           =",
		"=============================",
	],
	[
		"=============================",
		"=          !                =",
		"=                           =",
		"=*                          =",
		"=             *             =",
		"=*                       !  =",
		"=             *             =",
		"=*                          =",
		"=             *             =",
		"=*                          =",
		"=             *             =",
		"=*                          =",
		"=             =====         =",
		"=*                =         =",
		"=                 =         =",
		"=*          =  #  =    !    =",
		"=           =     =         =",
		"=============================",
	], 

	[
		"=============================",
		"=                   *  *    =",
		"=      !      =             =",
		"===============             =",
		"=             *          !  =",
		"=======================     =",
		"=                           =",
		"=     !                     =",
		"=         *    ==============",
		"=      =                    =",
		"=      =      *             =",
		"=      =                    =",
		"========                    =",
		"=                           =",
		"=                           =",
		"=             #             =",
		"=                           =",
		"=============================",
	]
	
]
const levelConf = {
	// grid size
	width: 64,
	height: 64,

	"=": () => [
	  rect(64, 64),
	  area(),
	  solid(),
	  color(0,0,0,1),
	  origin("bot"),
	],
	"*": () => [
	  sprite("ghost"),
	  area(),
	  solid(),
	  scale(0.5),
	  patrol(),
	  "enemy",
	],

	"#": () => [
	  sprite("chest"),
	  area(),
	  solid(),
	  scale(0.4),
	  "chest",
	],

	"!": () => [
		sprite("potion"),
		area(),
		solid(),
		scale(0.1),
		"potion"
	]
  };

scene("game", ({ levelId } = { levelId: 0 }) => {

	addLevel(levels[levelId ?? 0], levelConf);

	var health = 30

	const helathlabel = add([
		text(health),
		pos(20, 40),
		fixed(),
	])

	const player = add([
		sprite("bean"),
		pos(32, 0),
		area(),
		solid(),
	])

	player.action(() => {
		camPos(player.pos)
	})

	player.collides("enemy", () => {
		health = health - 1
		helathlabel.text = health
		if(health < 0) {
			go("lose")
		}
	})

	var explosion = 0

	var potionss = add([
		text(explosion),
		fixed(),		
		pos(1000, 40)
	])

	player.collides("potion", (p) => {
		if(p.is("potion")) {
			destroy(p)
			explosion = explosion + 1
			potionss.text = explosion
		}
	})


	keyPress("space", () => {
		if(explosion > 0) {
		const explosions = add([
		rect(400, 400),
		area(),
		pos(player.pos),
		origin("center"),
		color(255, 255, 255),

	])

	explosions.collides("enemy", (w) => {
		if(w.is("enemy")) {
			destroy(w)
			health = health + 0.5
			helathlabel.text = health
			shake()
		}
	})

	setTimeout(() => {
		destroy(explosions)
	}, 1000)
		shake()
		explosion = explosion - 1
		health = health - 3
		potionss.text = explosion
		helathlabel.text = health
		if(health < 0) {
			destroy(player)
			go("lose")
		}
		console.log(explosion)
		}

	})

	player.collides("chest", () => {
		if(levelId + 1 < levels.length) {
			go("game", {
				levelId: levelId + 1
			})
		} else {
			go("win")
		}
	})

	var speed = 1000

	keyDown("w" || "up", () => {
		player.move(dir(90).scale(-speed))
	})

	keyDown("s" || "down", () => {
		player.move(dir(90).scale(speed))
	})

	keyDown("a" || "up", () => {
		player.move(-speed, 0)
	})

	keyDown("d" || "down", () => {
		player.move(speed, 0)
	})
})

go("menu")