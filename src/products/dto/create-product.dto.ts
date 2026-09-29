import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'El nombre no es válido' })
  name!: string

  
  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message:'El precio no es válido' })
  price!: number
  
  @IsNotEmpty({ message: 'La cantidad no puede ir vacia' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message:'La cantidad no es válida' })
  inventory!: number

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsInt({ message: 'La categoria no es válida' })
  categoryId!: number
}
