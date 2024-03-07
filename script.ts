import { Food, Poison, Shark } from './types.js'

let topScoreCounter = 0

const main = () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
	const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
	const heartDiv = document.getElementById('lives') as HTMLDivElement

	const fishRightImg = document.getElementById('fish-right') as HTMLImageElement
	const fishLeftImg = document.getElementById('fish-left') as HTMLImageElement

	const fishLeftFastImg = document.getElementById('fish-left-fast') as HTMLImageElement
	const fishRightFastImg = document.getElementById('fish-right-fast') as HTMLImageElement

	const fishRightNemoImg = document.getElementById('fish-right-nemo') as HTMLImageElement
	const fishLeftNemoImg = document.getElementById('fish-left-nemo') as HTMLImageElement

	const sharkLeftImg1 = document.getElementById('shark-left1') as HTMLImageElement
	const sharkLeftImg2 = document.getElementById('shark-left2') as HTMLImageElement
	const sharkLeftImg3 = document.getElementById('shark-left3') as HTMLImageElement

	const sharkRightImg1 = document.getElementById('shark-right1') as HTMLImageElement
	const sharkRightImg2 = document.getElementById('shark-right2') as HTMLImageElement
	const sharkRightImg3 = document.getElementById('shark-right3') as HTMLImageElement

	const sharkFrontImg = document.getElementById('shark-front') as HTMLImageElement

	const poisonLeftImg = document.getElementById('poison-left') as HTMLImageElement
	const poisonRightImg = document.getElementById('poison-right') as HTMLImageElement
	const poisonRightSmallImg = document.getElementById('poison-right-small') as HTMLImageElement
	const poisonLeftSmallImg = document.getElementById('poison-left-small') as HTMLImageElement

	const score = document.getElementById('score') as HTMLHeadingElement
	const topScore = document.getElementById('top-score') as HTMLHeadingElement
	const playBtn = document.getElementById('play-btn') as HTMLButtonElement

	playBtn.style.visibility = 'visible'

	let drawPointCounter = 0
	let drawSpeedCounter = 0
	let drawLoseHeartCounter = 0
	let scoreCounter = 0
	let foodArray: Food[] = []
	let poisonArray: Poison[] = []
	let swimRightCounter = 1
	let swimLeftCounter = 1
	let lastKeyPress = 'left'
	let gameTime = 0
	let lastFrameTime: number = 0
	const fpsInterval: number = 1000 / 24
	let waveCount = 0

	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	const setupGame = () => {
		drawPointCounter = 0
		drawSpeedCounter = 0
		drawLoseHeartCounter = 0
		waveCount = 0
		scoreCounter = 0
		swimRightCounter = 1
		swimLeftCounter = 1
		lastKeyPress = 'left'
		gameTime = 0

		poisonArray = []
		foodArray = []

		playBtn.style.visibility = 'hidden'
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		drawLives()
		getPoison(1)
		getFood(40, 0, 0)

		shark = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			size: 20,
			lives: 4,
			speed: 7,
			keyPressed: {
				ArrowUp: false,
				ArrowLeft: false,
				ArrowRight: false,
				ArrowDown: false
			}
		}
	}

	let shark: Shark = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
		size: 20,
		lives: 4,
		speed: 7,
		keyPressed: {
			ArrowUp: false,
			ArrowLeft: false,
			ArrowRight: false,
			ArrowDown: false
		}
	}

	const drawLives = () => {
		heartDiv.innerHTML = ''
		for (let i = 0; i < shark.lives; i++) {
			const heart = document.createElement('img') as HTMLImageElement
			heart.src = 'img/heart.png'
			heart.id = 'heart'
			heartDiv.append(heart)
		}
	}

	const getRandomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

	function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
	}
	//food
	function getFood(num: number, speed: number, nemo: number) {
		for (let i = 0; i < num; i++) {
			const randomX = getRandomNumberInRange(0, 1)
			const x = randomX
				? getRandomNumberInRange(-600, -200)
				: window.innerWidth + getRandomNumberInRange(200, 600)
			const y = getRandomNumberInRange(20, window.innerHeight - 20)
			const velocityX = getRandomNumberInRange(-5, 5)
			const velocityY = getRandomNumberInRange(-5, 5)
			const topSpeed = 4
			const species = 'normal'
			const foodObject: Food = { species, x, y, velocityX, velocityY, topSpeed }
			foodArray.push(foodObject)
		}
		for (let i = 0; i < speed; i++) {
			const randomX = getRandomNumberInRange(0, 1)
			const x = randomX
				? getRandomNumberInRange(-600, -200)
				: window.innerWidth + getRandomNumberInRange(200, 600)
			const y = getRandomNumberInRange(20, window.innerHeight - 20)
			const velocityX = getRandomNumberInRange(-5, 5)
			const velocityY = getRandomNumberInRange(-5, 5)
			const topSpeed = 6.5
			const species = 'fast'
			const foodObject: Food = { species, x, y, velocityX, velocityY, topSpeed }
			foodArray.push(foodObject)
		}
		for (let i = 0; i < nemo; i++) {
			const randomX = getRandomNumberInRange(0, 1)
			const x = randomX
				? getRandomNumberInRange(-600, -200)
				: window.innerWidth + getRandomNumberInRange(200, 600)
			const y = getRandomNumberInRange(20, window.innerHeight - 20)
			const velocityX = getRandomNumberInRange(-5, 5)
			const velocityY = getRandomNumberInRange(-5, 5)
			const topSpeed = 5.5
			const species = 'nemo'
			const foodObject: Food = { species, x, y, velocityX, velocityY, topSpeed }
			foodArray.push(foodObject)
		}
	}
	// poison
	function getPoison(num: number) {
		for (let i = 0; i < num; i++) {
			const randomXorY = getRandomNumberInRange(0, 1)
			const randomX = getRandomNumberInRange(0, 1)
			const randomY = getRandomNumberInRange(0, 1)
			const x = randomXorY
				? randomX
					? window.innerWidth + 20
					: -20
				: getRandomNumberInRange(-20, window.innerWidth)
			const y = !randomXorY
				? randomX
					? window.innerHeight
					: -20
				: getRandomNumberInRange(-20, window.innerHeight)
			const velocityX = getRandomNumberInRange(-5, 5)
			const velocityY = getRandomNumberInRange(-5, 5)
			let big: boolean = false
			const poisonObject: Poison = { x, y, velocityX, velocityY, big }
			poisonArray.push(poisonObject)
		}
	}

	playBtn.addEventListener('click', () => {
		score.textContent = `score: ${scoreCounter}`
		setupGame()
		requestAnimationFrame(gameLoop)
	})

	const gameLoop = (timestamp: number) => {
		gameTime++

		if (!lastFrameTime) {
			lastFrameTime = timestamp
		}
		const elapsed = timestamp - lastFrameTime

		if (elapsed > fpsInterval) {
			lastFrameTime = timestamp - (elapsed % fpsInterval)
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			let speed = shark.speed

			//if (shark.keyPressed.ArrowDown) shark.y += speed

			if (shark.keyPressed.ArrowDown && shark.keyPressed.ArrowLeft) {
				shark.y += speed * 0.7
				shark.x -= speed * 0.7
			} else if (shark.keyPressed.ArrowDown && shark.keyPressed.ArrowRight) {
				shark.y += speed * 0.7
				shark.x += speed * 0.7
			} else if (shark.keyPressed.ArrowUp && shark.keyPressed.ArrowLeft) {
				shark.x -= speed * 0.7
				shark.y -= speed * 0.7
			} else if (shark.keyPressed.ArrowUp && shark.keyPressed.ArrowRight) {
				shark.x += speed * 0.7
				shark.y -= speed * 0.7
			} else if (shark.keyPressed.ArrowRight) {
				shark.x += speed
			} else if (shark.keyPressed.ArrowLeft) {
				shark.x -= speed
			} else if (shark.keyPressed.ArrowUp) {
				shark.y -= speed
			} else if (shark.keyPressed.ArrowDown) {
				shark.y += speed
			}

			if (shark.y < 0) {
				shark.y = 0
			} else if (shark.y > window.innerHeight) {
				shark.y = window.innerHeight
			}

			if (shark.x < 0) {
				shark.x = 0
			} else if (shark.x > window.innerWidth) {
				shark.x = window.innerWidth
			}

			if (shark.keyPressed.ArrowRight) {
				lastKeyPress = 'right'
				swimRightCounter += shark.speed
				if (swimRightCounter <= 30) {
					ctx.drawImage(
						sharkRightImg1,
						shark.x - ((shark.size * 3.2 + 40) / 3) * 2,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				} else if (swimRightCounter <= 60) {
					ctx.drawImage(
						sharkRightImg2,
						shark.x - ((shark.size * 3.2 + 40) / 3) * 2,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				} else if (swimRightCounter <= 90) {
					ctx.drawImage(
						sharkRightImg3,
						shark.x - ((shark.size * 3.2 + 40) / 3) * 2,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				} else {
					ctx.drawImage(
						sharkRightImg2,
						shark.x - ((shark.size * 3.2 + 40) / 3) * 2,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
					if (swimRightCounter > 120) swimRightCounter = 1
				}
			} else if (shark.keyPressed.ArrowLeft) {
				lastKeyPress = 'left'
				swimLeftCounter += shark.speed
				if (swimLeftCounter <= 30) {
					ctx.drawImage(
						sharkLeftImg1,
						shark.x - (shark.size * 3.2 + 40) / 3,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				} else if (swimLeftCounter <= 60) {
					ctx.drawImage(
						sharkLeftImg2,
						shark.x - (shark.size * 3.2 + 40) / 3,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				} else {
					ctx.drawImage(
						sharkLeftImg3,
						shark.x - (shark.size * 3.2 + 40) / 3,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
					if (swimLeftCounter > 90) swimLeftCounter = 1
				}
			} else {
				/*	if (lastKeyPress === 'left') {
					ctx.drawImage(
						sharkLeftImg1,
						shark.x - (shark.size * 3.2 + 40) / 2,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				} else {
					ctx.drawImage(
						sharkRightImg1,
						shark.x - (shark.size * 3.2 + 40) / 2,
						shark.y - (shark.size + 40) / 2,
						shark.size * 3.2 + 40,
						shark.size + 40
					)
				}*/
				ctx.drawImage(
					sharkFrontImg,
					shark.x - (shark.size * 3.2 + 10) / 2,
					shark.y - (shark.size + 40) / 2,
					shark.size * 3.2 + 10,
					shark.size + 30
				)
			}

			poisonArray.forEach((poisonObj: Poison, index: number): void => {
				const distance = calculateDistance(shark.x, shark.y, poisonObj.x, poisonObj.y)

				if (distance < shark.size / 2 + 10) {
					heartDiv.innerHTML = ''
					poisonArray.splice(index, 1)
					shark.size -= 6
					shark.lives -= 1
					drawLives()
					score.textContent = `score: ${scoreCounter}`
					drawLoseHeartCounter = 24
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

				poisonObj.big = distance < 120

				if (distance < 400) {
					poisonObj.velocityX += poisonObj.x > shark.x ? -1 : 1
				}

				if (distance < 400) {
					poisonObj.velocityY += poisonObj.y > shark.y ? -1 : 1
				}

				if (poisonObj.velocityX > 1.5) {
					poisonObj.velocityX = 1.5
				} else if (poisonObj.velocityX < -1.5) {
					poisonObj.velocityX = -1.5
				}

				if (poisonObj.velocityY > 1.5) {
					poisonObj.velocityY = 1.5
				} else if (poisonObj.velocityY < -1.5) {
					poisonObj.velocityY = -1.5
				}

				poisonObj.velocityX += getRandomNumberInRange(-0.8, 0.8)
				poisonObj.velocityY += getRandomNumberInRange(-0.8, 0.8)

				poisonObj.x += poisonObj.velocityX
				poisonObj.y += poisonObj.velocityY

				if (poisonObj.velocityX <= 0) {
					if (poisonObj.big) {
						ctx.drawImage(poisonLeftImg, poisonObj.x - 27.5, poisonObj.y - 27.5, 55, 55)
					} else {
						ctx.drawImage(poisonLeftSmallImg, poisonObj.x - 25, poisonObj.y - 15, 50, 40)
					}
				} else {
					if (poisonObj.big) {
						ctx.drawImage(poisonRightImg, poisonObj.x - 27.5, poisonObj.y - 27.5, 55, 55)
					} else {
						ctx.drawImage(poisonRightSmallImg, poisonObj.x - 25, poisonObj.y - 15, 50, 40)
					}
				}
			})

			foodArray.forEach((foodObj: Food, index: number) => {
				const distance = calculateDistance(shark.x, shark.y, foodObj.x, foodObj.y)

				if (distance < shark.size / 2 + 30) {
					foodArray.splice(index, 1)
					shark.size += 0.2
					scoreCounter += 1
					score.textContent = `Score: ${scoreCounter}`
					if (foodObj.species === 'fast') {
						shark.speed *= 1.04
						drawSpeedCounter = 48
					}
					drawPointCounter = 24
				}

				foodObj.velocityX += getRandomNumberInRange(-0.4, 0.4)
				foodObj.velocityY += getRandomNumberInRange(-0.1, 0.1)

				if (distance < 100) {
					foodObj.velocityX = foodObj.x > shark.x ? foodObj.topSpeed : -foodObj.topSpeed
				}

				if (distance < 100) {
					foodObj.velocityY = foodObj.y > shark.y ? foodObj.topSpeed : -foodObj.topSpeed
				}

				if (foodObj.x <= 200) {
					foodObj.velocityX += 0.9
				} else if (foodObj.x >= window.innerWidth - 200) {
					foodObj.velocityX -= 0.9
				}

				if (foodObj.x <= 30) {
					foodObj.velocityX += 2
				} else if (foodObj.x >= window.innerWidth - 30) {
					foodObj.velocityX += -2
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

					if (foodDistance <= 20) {
						foodObj.y += foodObj.y < obj.y ? -0.8 : 0.8
					}
					if (foodDistance <= 20) {
						foodObj.x += foodObj.x > obj.x ? 0.8 : -0.8
					}

					if (foodDistance < 50) {
						foodObj.velocityY += obj.velocityY * 0.01
						foodObj.velocityX += obj.velocityX * 0.01
					}
				})

				if (foodObj.velocityX > foodObj.topSpeed) {
					foodObj.velocityX = foodObj.topSpeed
				} else if (foodObj.velocityX < -foodObj.topSpeed) {
					foodObj.velocityX = -foodObj.topSpeed
				}

				if (foodObj.velocityY > foodObj.topSpeed / 2) {
					foodObj.velocityY = foodObj.topSpeed / 2
				} else if (foodObj.velocityY < -foodObj.topSpeed / 2) {
					foodObj.velocityY = -foodObj.topSpeed / 2
				}

				foodObj.x += foodObj.velocityX
				foodObj.y += foodObj.velocityY

				// Example usage
				if (foodObj.velocityX <= 0 && foodObj.species === 'normal') {
					ctx.drawImage(fishLeftImg, foodObj.x - 15, foodObj.y - 15, 30, 30)
				} else if (foodObj.species === 'normal') {
					ctx.drawImage(fishRightImg, foodObj.x - 15, foodObj.y - 15, 30, 30)
				}

				if (foodObj.velocityX <= 0 && foodObj.species === 'fast') {
					ctx.drawImage(fishLeftFastImg, foodObj.x - 15, foodObj.y - 15, 30, 30)
				} else if (foodObj.species === 'fast') {
					ctx.drawImage(fishRightFastImg, foodObj.x - 15, foodObj.y - 15, 30, 30)
				}

				if (foodObj.velocityX <= 0 && foodObj.species === 'nemo') {
					ctx.drawImage(fishLeftNemoImg, foodObj.x - 15, foodObj.y - 15, 30, 30)
				} else if (foodObj.species === 'nemo') {
					ctx.drawImage(fishRightNemoImg, foodObj.x - 15, foodObj.y - 15, 30, 30)
				}

				if (gameTime > (1000 / 15) * 10) {
					gameTime = 0
					getPoison(1)
				}
				if (foodArray.length <= 6) {
					waveCount += 1
					if (waveCount === 1) {
						getFood(100, 3, 20)
					} else if (waveCount === 2) {
						getFood(0, 8, 0)
					} else if (waveCount === 3) {
						getFood(0, 10, 100)
					} else {
						getFood(30, 20, 20)
					}
				}
				/*	drawRect(foodObj.x, foodObj.y, 7, 7, 'rgb(0,255,224)', ctx)*/
			})
		}
		if (shark.lives <= 0) {
			if (scoreCounter > topScoreCounter) {
				topScoreCounter = scoreCounter
				topScore.textContent = `top score: ${topScoreCounter}`
			}
			setupGame()
			playBtn.style.visibility = 'visible'
			return
		}

		if (drawPointCounter > 0) {
			drawPointCounter -= 1
			ctx.font = '20px cursive'
			ctx.fillStyle = 'rgb(25,255,0)'
			ctx.fillText(`+1`, shark.x, shark.y - 24 + drawPointCounter)
		}

		if (drawSpeedCounter > 0) {
			drawSpeedCounter -= 1
			ctx.font = '16px cursive'
			ctx.fillStyle = 'yellow'
			ctx.fillText(`Speed +4%`, shark.x, shark.y + 48 - drawSpeedCounter)
		}

		if (drawLoseHeartCounter > 0) {
			drawLoseHeartCounter -= 1
			ctx.font = '30px cursive'
			ctx.fillStyle = 'rgb(255,0,0)'
			ctx.fillText(`-1 heart`, shark.x, shark.y + 48 - drawLoseHeartCounter)
		}

		requestAnimationFrame(gameLoop)
	}

	window.addEventListener('keydown', (e: KeyboardEvent): void => {
		arrowKeys.forEach((button: string): void => {
			if (button === e.key) {
				e.preventDefault()
				// @ts-ignore
				shark.keyPressed[button] = true
			}
		})
	})

	window.addEventListener('keyup', (e: KeyboardEvent): void => {
		arrowKeys.forEach((button: string): void => {
			if (button === e.key) {
				e.preventDefault()
				// @ts-ignore
				shark.keyPressed[button] = false
			}
		})
	})
}

main()
