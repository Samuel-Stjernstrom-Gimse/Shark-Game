const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
const foodArray: Food[] = []
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const fishRightImg = document.getElementById('fish-right') as HTMLImageElement
const fishLeftImg = document.getElementById('fish-left') as HTMLImageElement

const sharkLeftImg1 = document.getElementById('shark-left1') as HTMLImageElement
const sharkLeftImg2 = document.getElementById('shark-left2') as HTMLImageElement
const sharkLeftImg3 = document.getElementById('shark-left3') as HTMLImageElement
const sharkLeftImg4 = document.getElementById('shark-left4') as HTMLImageElement

const sharkRightImg1 = document.getElementById('shark-right1') as HTMLImageElement
const sharkRightImg2 = document.getElementById('shark-right2') as HTMLImageElement
const sharkRightImg3 = document.getElementById('shark-right3') as HTMLImageElement
const sharkRightImg4 = document.getElementById('shark-right4') as HTMLImageElement

let swimRightCounter = 1
let swimLeftCounter = 1

let lastKeyPress = 'left'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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

function drawImageOnCanvas(x, y, imageUrl, ctx) {
	const img = new Image() // Create a new Image object
	img.onload = function () {
		// Draw the image on the canvas when it's loaded
		ctx.drawImage(img, x, y, 20, 20) // Set desired dimensions (7x7) and position (x, y)
	}
	img.src = imageUrl // Set the source of the image
}
const getRandomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const drawRect = (x: number, y: number, w: number, h: number, color: string, ctx: CanvasRenderingContext2D): void => {
	ctx.fillStyle = color
	ctx.fillRect(x, y, w, h)
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fillColor: string): void {
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, 2 * Math.PI)
	ctx.fillStyle = fillColor
	ctx.fill()
	ctx.stroke()
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

for (let i = 0; i < 200; i++) {
	const x = getRandomNumberInRange(20, window.innerWidth - 20)
	const y = getRandomNumberInRange(20, window.innerHeight - 20)
	const velocityX = getRandomNumberInRange(-5, 5)
	const velocityY = getRandomNumberInRange(-5, 5)
	const foodObject: Food = { x, y, velocityX, velocityY }
	foodArray.push(foodObject)
}

const gameLoop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const speed = 5

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

	foodArray.forEach((foodObj: Food, index: number) => {
		const distance = calculateDistance(bacteria.x, bacteria.y, foodObj.x, foodObj.y)

		if (distance < bacteria.size) {
			foodArray.splice(index, 1)
			bacteria.size += 2 / 3.14
		}

		foodObj.velocityX += getRandomNumberInRange(-0.2, 0.2)
		foodObj.velocityY += getRandomNumberInRange(-0.1, 0.1)

		if (distance < 70) {
			foodObj.velocityX = foodObj.x > bacteria.x ? 5 : -5
		}

		if (distance < 70) {
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
