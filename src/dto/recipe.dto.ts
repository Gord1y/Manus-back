import { IsOptional, IsString } from 'class-validator'

export class IRecipe {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsString()
	categorySlug: string

	@IsString()
	@IsOptional()
	instructions?: string

	@IsString()
	@IsOptional()
	image?: string

	@IsOptional()
	ingredients?: Ingredient[]
}

export class Ingredient {
	@IsString()
	name: string

	@IsString()
	count: string
}
