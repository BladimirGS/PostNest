import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

  @IsString({ message: 'El nombre de la categoria debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la categoria no puede ir vacio' })
  name!: string
}
