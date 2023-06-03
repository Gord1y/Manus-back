import { IsString } from 'class-validator'

export class ICategory {
	@IsString()
	name: string

	@IsString()
	slug: string
}
