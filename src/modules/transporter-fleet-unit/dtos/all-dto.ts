/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseTransporterFleetUnitDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateTransporterFleetUnit',
    example: 'Nombre de instancia CreateTransporterFleetUnit',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateTransporterFleetUnitDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateTransporterFleetUnit).',
    example: 'Fecha de creación de la instancia (CreateTransporterFleetUnit).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateTransporterFleetUnit).',
    example: 'Fecha de actualización de la instancia (CreateTransporterFleetUnit).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateTransporterFleetUnit).',
    example:
      'Usuario que realiza la creación de la instancia (CreateTransporterFleetUnit).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateTransporterFleetUnit).',
    example: 'Estado de activación de la instancia (CreateTransporterFleetUnit).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único de la unidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único de la unidad', nullable: false })
  unitCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Transportista dueño de la unidad',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Transportista dueño de la unidad', nullable: false })
  transporterId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de vehículo o recurso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de vehículo o recurso', nullable: false })
  vehicleType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Matrícula si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Matrícula si aplica', nullable: true })
  plateNumber?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Capacidad de peso',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Capacidad de peso', nullable: true })
  capacityWeightKg?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Capacidad de volumen',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Capacidad de volumen', nullable: true })
  capacityVolumeM3?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo de la unidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo de la unidad', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos operativos de la unidad',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos operativos de la unidad', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseTransporterFleetUnitDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class TransporterFleetUnitDto extends BaseTransporterFleetUnitDto {
  // Propiedades específicas de la clase TransporterFleetUnitDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<TransporterFleetUnitDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TransporterFleetUnitDto>): TransporterFleetUnitDto {
    const instance = new TransporterFleetUnitDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class TransporterFleetUnitValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => TransporterFleetUnitDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => TransporterFleetUnitDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class TransporterFleetUnitOutPutDto extends BaseTransporterFleetUnitDto {
  // Propiedades específicas de la clase TransporterFleetUnitOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<TransporterFleetUnitOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TransporterFleetUnitOutPutDto>): TransporterFleetUnitOutPutDto {
    const instance = new TransporterFleetUnitOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateTransporterFleetUnitDto extends BaseTransporterFleetUnitDto {
  // Propiedades específicas de la clase CreateTransporterFleetUnitDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateTransporterFleetUnit a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateTransporterFleetUnitDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateTransporterFleetUnitDto>): CreateTransporterFleetUnitDto {
    const instance = new CreateTransporterFleetUnitDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateTransporterFleetUnitDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateTransporterFleetUnitDto,
    description: 'Instancia CreateTransporterFleetUnit o UpdateTransporterFleetUnit',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateTransporterFleetUnitDto, { nullable: true })
  input?: CreateTransporterFleetUnitDto | UpdateTransporterFleetUnitDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteTransporterFleetUnitDto {
  // Propiedades específicas de la clase DeleteTransporterFleetUnitDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteTransporterFleetUnit a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteTransporterFleetUnit a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateTransporterFleetUnitDto extends BaseTransporterFleetUnitDto {
  // Propiedades específicas de la clase UpdateTransporterFleetUnitDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateTransporterFleetUnit a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateTransporterFleetUnitDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateTransporterFleetUnitDto>): UpdateTransporterFleetUnitDto {
    const instance = new UpdateTransporterFleetUnitDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



