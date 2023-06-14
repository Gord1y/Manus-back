import { IsOptional, IsString } from 'class-validator'

export class ICategory {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	slug: string
}
