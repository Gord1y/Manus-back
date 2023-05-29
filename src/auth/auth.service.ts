import {
	BadRequestException,
	HttpException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto, RegisterDto } from '../dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private JWT: JwtService
	) {}

	async register(dto: RegisterDto) {
		const isUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (isUser) throw new BadRequestException('User already exists')

		const user = await this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokens(user.id)
		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async login(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new NotFoundException('User not found')
		const isValid = await verify(user.password, dto.password)
		if (!isValid) {
			throw new UnauthorizedException('Invalid password')
		}
		const tokens = await this.issueTokens(user.id)
		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		try {
			const result = await this.JWT.verifyAsync(refreshToken)
			if (!result) throw new UnauthorizedException('Invalid refresh token')
			const user = await this.prisma.user.findUnique({
				where: {
					id: result.id
				}
			})
			if (!user) throw new NotFoundException('User not found')
			const tokens = await this.issueTokens(user.id)
			return {
				user: this.returnUserFields(user),
				...tokens
			}
		} catch (err) {
			throw new HttpException(err.message, 401, {
				cause: new Error(err)
			})
		}
	}
	private returnUserFields(user: User) {
		return {
			id: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }
		const accessToken = this.JWT.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.JWT.sign(data, {
			expiresIn: '1d'
		})
		return {
			accessToken,
			refreshToken
		}
	}
}
