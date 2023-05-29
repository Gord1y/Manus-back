import { IsString } from 'class-validator'

export class RegisterDto {
	@IsString()
	name: string

	@IsString()
	surname: string

	@IsString()
	email: string

	@IsString()
	password: string
}
export class AuthDto {
	@IsString()
	email: string

	@IsString()
	password: string
}
