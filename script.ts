const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
const foodArray: Food[] = []
const poisonArray: Poison[] = []
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

const fishRightImg = document.getElementById('fish-right') as HTMLImageElement
const fishLeftImg = document.getElementById('fish-left') as HTMLImageElement

const sharkLeftImg1 = document.getElementById('shark-left1') as HTMLImageElement
const sharkLeftImg2 = document.getElementById('shark-left2') as HTMLImageElement

const sharkRightImg1 = document.getElementById('shark-right1') as HTMLImageElement
const sharkRightImg2 = document.getElementById('shark-right2') as HTMLImageElement

const poisonLeftImg = document.getElementById('poison-left') as HTMLImageElement
const poisonRightImg = document.getElementById('poison-right') as HTMLImageElement

const score = document.getElementById('score') as HTMLHeadingElement
let scoreCounter = 0

let swimRightCounter = 1
let swimLeftCounter = 1

let lastKeyPress = 'left'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

type Poison = {
	x: number
	y: number
	velocityX: number
	velocityY: number
}

type Bacteria = {
	x: number
	y: number
	size: number
	keyPressed: { ArrowUp: boolean; ArrowLeft: boolean; ArrowRight: boolean; ArrowDown: boolean }
}

type Food = {
	x: number
	y: number
	velocityX: number
	velocityY: number
}

let bacteria: Bacteria = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
	size: 10,
	keyPressed: {
		ArrowUp: false,
		ArrowLeft: false,
		ArrowRight: false,
		ArrowDown: false
	}
}

const getRandomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}
//food
for (let i = 0; i < 200; i++) {
	const x = getRandomNumberInRange(20, window.innerWidth - 20)
	const y = getRandomNumberInRange(20, window.innerHeight - 20)
	const velocityX = getRandomNumberInRange(-5, 5)
	const velocityY = getRandomNumberInRange(-5, 5)
	const foodObject: Food = { x, y, velocityX, velocityY }
	foodArray.push(foodObject)
}
// poison
for (let i = 0; i < 5; i++) {
	const x = getRandomNumberInRange(20, window.innerWidth - 20)
	const y = getRandomNumberInRange(20, window.innerHeight - 20)
	const velocityX = getRandomNumberInRange(-5, 5)
	const velocityY = getRandomNumberInRange(-5, 5)
	const poisonObject: Food = { x, y, velocityX, velocityY }
	poisonArray.push(poisonObject)
}

const gameLoop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const speed = 4

	if (bacteria.keyPressed.ArrowDown) bacteria.y += speed
	if (bacteria.keyPressed.ArrowUp) bacteria.y -= speed
	if (bacteria.keyPressed.ArrowLeft) bacteria.x -= speed
	if (bacteria.keyPressed.ArrowRight) bacteria.x += speed

	if (bacteria.keyPressed.ArrowRight) {
		lastKeyPress = 'right'
		swimRightCounter += 6
		if (swimRightCounter <= 30) {
			ctx.drawImage(
				sharkRightImg1,
				bacteria.x - (bacteria.size * 3.2 + 40) / 2,
				bacteria.y - (bacteria.size + 40) / 2,
				bacteria.size * 3.2 + 40,
				bacteria.size + 40
			)
		} else {
			ctx.drawImage(
				sharkRightImg2,
				bacteria.x - (bacteria.size * 3.2 + 40) / 2,
				bacteria.y - (bacteria.size + 40) / 2,
				bacteria.size * 3.2 + 40,
				bacteria.size + 40
			)
			if (swimRightCounter > 60) swimRightCounter = 1
		}
	} else if (bacteria.keyPressed.ArrowLeft) {
		lastKeyPress = 'left'
		swimLeftCounter += 6
		if (swimLeftCounter <= 30) {
			ctx.drawImage(
				sharkLeftImg1,
				bacteria.x - (bacteria.size * 3.2 + 40) / 2,
				bacteria.y - (bacteria.size + 40) / 2,
				bacteria.size * 3.2 + 40,
				bacteria.size + 40
			)
		} else {
			ctx.drawImage(
				sharkLeftImg2,
				bacteria.x - (bacteria.size * 3.2 + 40) / 2,
				bacteria.y - (bacteria.size + 40) / 2,
				bacteria.size * 3.2 + 40,
				bacteria.size + 40
			)
			if (swimLeftCounter > 60) swimLeftCounter = 1
		}
	} else {
		if (lastKeyPress === 'left') {
			ctx.drawImage(
				sharkLeftImg2,
				bacteria.x - (bacteria.size * 3.2 + 40) / 2,
				bacteria.y - (bacteria.size + 40) / 2,
				bacteria.size * 3.2 + 40,
				bacteria.size + 40
			)
		} else {
			ctx.drawImage(
				sharkRightImg2,
				bacteria.x - (bacteria.size * 3.2 + 40) / 2,
				bacteria.y - (bacteria.size + 40) / 2,
				bacteria.size * 3.2 + 40,
				bacteria.size + 40
			)
		}
	}

	poisonArray.forEach((poisonObj: Poison, index: number): void => {
		const distance = calculateDistance(bacteria.x, bacteria.y, poisonObj.x, poisonObj.y)

		if (distance < bacteria.size / 2 + 40) {
			poisonArray.splice(index, 1)
			bacteria.size -= 2
			scoreCounter += -20
			score.textContent = `Score: ${scoreCounter}`
		}

		if (poisonObj.y <= 30) {
			poisonObj.velocityY = 5
		} else if (poisonObj.y >= window.innerHeight - 30) {
			poisonObj.velocityY = -5
		}

		if (poisonObj.x <= 30) {
			poisonObj.velocityX = 5
		} else if (poisonObj.x >= window.innerWidth - 30) {
			poisonObj.velocityX = -5
		}

		poisonObj.velocityX += getRandomNumberInRange(-0.4, 0.4)
		poisonObj.velocityY += getRandomNumberInRange(-0.4, 0.4)

		if (distance < 400) {
			poisonObj.velocityX += poisonObj.x > bacteria.x ? -1 : 1
		}

		if (distance < 400) {
			poisonObj.velocityY += poisonObj.y > bacteria.y ? -1 : 1
		}

		if (poisonObj.velocityX > 1) {
			poisonObj.velocityX = 1
		} else if (poisonObj.velocityX < -1) {
			poisonObj.velocityX = -1
		}

		if (poisonObj.velocityY > 1) {
			poisonObj.velocityY = 1
		} else if (poisonObj.velocityY < -1) {
			poisonObj.velocityY = -1
		}

		poisonObj.x += poisonObj.velocityX
		poisonObj.y += poisonObj.velocityY

		if (poisonObj.velocityX <= 0) {
			ctx.drawImage(poisonLeftImg, poisonObj.x, poisonObj.y, 30, 30)
		} else {
			ctx.drawImage(poisonRightImg, poisonObj.x, poisonObj.y, 30, 30)
		}
	})

	foodArray.forEach((foodObj: Food, index: number) => {
		const distance = calculateDistance(bacteria.x, bacteria.y, foodObj.x, foodObj.y)

		if (distance < bacteria.size / 2 + 40) {
			foodArray.splice(index, 1)
			bacteria.size += 0.1
			scoreCounter += 1
			score.textContent = `Score: ${scoreCounter}`
		}

		foodObj.velocityX += getRandomNumberInRange(-0.2, 0.2)
		foodObj.velocityY += getRandomNumberInRange(-0.1, 0.1)

		if (distance < 100) {
			foodObj.velocityX = foodObj.x > bacteria.x ? 5 : -5
		}

		if (distance < 100) {
			foodObj.velocityY = foodObj.y > bacteria.y ? 5 : -5
		}

		if (foodObj.x <= 200) {
			foodObj.velocityX += 0.9
		} else if (foodObj.x >= window.innerWidth - 200) {
			foodObj.velocityX -= 0.9
		}

		if (foodObj.x <= 30) {
			foodObj.velocityX = 5
		} else if (foodObj.x >= window.innerWidth - 30) {
			foodObj.velocityX = -5
		}

		if (foodObj.y <= 200) {
			foodObj.velocityY += 0.9
		} else if (foodObj.y >= window.innerHeight - 200) {
			foodObj.velocityY -= 0.9
		}

		if (foodObj.y <= 30) {
			foodObj.velocityY = 5
		} else if (foodObj.y >= window.innerHeight - 30) {
			foodObj.velocityY = -5
		}

		foodArray.forEach((obj) => {
			const foodDistance = calculateDistance(foodObj.x, foodObj.y, obj.x, obj.y)

			if (foodDistance <= 10) {
				foodObj.y += foodObj.y < obj.y ? -0.5 : 0.5
			}
			if (foodDistance <= 10) {
				foodObj.x += foodObj.x > obj.x ? 0.5 : -0.5
			}

			if (foodDistance < 50) {
				foodObj.velocityY += obj.velocityY * 0.03
				foodObj.velocityX += obj.velocityX * 0.03
			}
		})

		if (foodObj.velocityX > 7) {
			foodObj.velocityX = 1
		} else if (foodObj.velocityX < -7) {
			foodObj.velocityX = -1
		}

		if (foodObj.velocityY > 4) {
			foodObj.velocityY = 1
		} else if (foodObj.velocityY < -5) {
			foodObj.velocityY = -1
		}

		foodObj.x += foodObj.velocityX
		foodObj.y += foodObj.velocityY

		// Example usage
		if (foodObj.velocityX <= 0) {
			ctx.drawImage(fishLeftImg, foodObj.x, foodObj.y, 30, 30)
		} else {
			ctx.drawImage(fishRightImg, foodObj.x, foodObj.y, 30, 30)
		}

		/*	drawRect(foodObj.x, foodObj.y, 7, 7, 'rgb(0,255,224)', ctx)*/
	})

	requestAnimationFrame(gameLoop)
}
gameLoop()

window.addEventListener('keydown', (e: KeyboardEvent): void => {
	arrowKeys.forEach((button: string): void => {
		if (button === e.key) {
			// @ts-ignore
			bacteria.keyPressed[button] = true
		}
	})
})

window.addEventListener('keyup', (e: KeyboardEvent): void => {
	arrowKeys.forEach((button: string): void => {
		if (button === e.key) {
			// @ts-ignore
			bacteria.keyPressed[button] = false
		}
	})
})
