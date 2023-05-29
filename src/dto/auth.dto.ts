import { IsEmail, IsString } from 'class-validator'

export class RegisterDto {
	@IsString()
	name: string

	@IsString()
	surname: string

	@IsEmail()
	@IsString()
	email: string

	@IsString()
	password: string
}
export class AuthDto {
	@IsEmail()
	@IsString()
	email: string

	@IsString()
	password: string
}
