import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { IRecipe } from 'src/dto/recipe.dto'
import { RecipeService } from './recipe.service'
import { Recipe } from '@prisma/client'

@Controller('recipe')
export class RecipeController {
	constructor(private readonly recipeService: RecipeService) {}

	@HttpCode(200)
	@Get()
	@Auth()
	async GetAllRecipes() {
		return await this.recipeService.GetAllRecipes()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async CreateRecipe(@Body() dto: IRecipe) {
		return await this.recipeService.CreateRecipe(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async UpdateRecipe(@Body() dto: Recipe) {
		return await this.recipeService.UpdateRecipe(dto)
	}

	@HttpCode(200)
	@Delete()
	@Auth()
	async DeleteRecipe(@Body() dto: Recipe) {
		return await this.recipeService.DeleteRecipe(dto.id)
	}

	@Auth()
	@Get('/:slug')
	async getUser(@Param('slug') slug: string) {
		return await this.recipeService.getBySlug(slug)
	}
}
