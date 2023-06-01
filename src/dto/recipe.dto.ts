import { IsOptional, IsString } from 'class-validator'

export class IRecipe {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsString()
	description: string

	@IsString()
	@IsOptional()
	instructions?: string

	@IsString()
	@IsOptional()
	image?: string

	ingredients?: Ingredient[]
}

export class Ingredient {
	@IsString()
	name: string

	@IsString()
	count: string
}
