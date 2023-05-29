import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthModule } from './auth/auth.module'
import { JwtService } from '@nestjs/jwt'

@Module({
	imports: [AuthModule],
	controllers: [],
	providers: [PrismaClient, JwtService]
})
export class AppModule {}
