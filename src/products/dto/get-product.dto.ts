import { IsNumberString, IsOptional } from "class-validator";

export class getProductsQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'La categoría debe ser un número' })
  category_id?: number
}