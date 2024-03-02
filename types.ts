export type Poison = {
	x: number
	y: number
	velocityX: number
	velocityY: number
}

export type Shark = {
	x: number
	y: number
	size: number
	lives: 3
	keyPressed: { ArrowUp: boolean; ArrowLeft: boolean; ArrowRight: boolean; ArrowDown: boolean }
}

export type Food = {
	x: number
	y: number
	velocityX: number
	velocityY: number
}
