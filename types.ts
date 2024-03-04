export type Poison = {
	x: number
	y: number
	velocityX: number
	velocityY: number
	big: boolean
}

export type Shark = {
	x: number
	y: number
	size: number
	lives: number
	speed: number
	keyPressed: { ArrowUp: boolean; ArrowLeft: boolean; ArrowRight: boolean; ArrowDown: boolean }
}

export type Food = {
	species: string
	x: number
	y: number
	velocityX: number
	velocityY: number
	topSpeed: number
}
