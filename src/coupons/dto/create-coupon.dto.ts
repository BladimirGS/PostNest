import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {
  @IsNotEmpty({ message: 'El nombre del cupón es obligatorio' })
  name!: string

  @IsNotEmpty({ message: 'El descuento no puede ir vacio' })
  @IsInt({ message: 'El descuento debe ser entre 1 y 100' })
  @Max(100, { message: 'El descuento máximo es de 100' })
  @Min(1, { message: 'El descuento mínimo es de 1' })
  porcentage!: number

  @IsNotEmpty({ message: 'La fecha no puede ser vacia' })
  @IsDateString({}, { message: 'La fecha no es válida' })
  expirationDate!: Date
}
