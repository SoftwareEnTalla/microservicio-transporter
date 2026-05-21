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
export class BaseTransporterDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateTransporter',
    example: 'Nombre de instancia CreateTransporter',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateTransporterDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateTransporter).',
    example: 'Fecha de creación de la instancia (CreateTransporter).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateTransporter).',
    example: 'Fecha de actualización de la instancia (CreateTransporter).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateTransporter).',
    example:
      'Usuario que realiza la creación de la instancia (CreateTransporter).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateTransporter).',
    example: 'Estado de activación de la instancia (CreateTransporter).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia canónica al user del microservicio security',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia canónica al user del microservicio security', nullable: false })
  userId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único del transportista',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único del transportista', nullable: false })
  transporterCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de transportista: persona natural o jurídica',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de transportista: persona natural o jurídica', nullable: false })
  transporterType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo operativo: enterprise logistics o simple delivery',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo operativo: enterprise logistics o simple delivery', nullable: false })
  transporterMode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de aprobación operativa',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de aprobación operativa', nullable: false })
  approvalStatus!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Disponibilidad actual para nuevas asignaciones',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Disponibilidad actual para nuevas asignaciones', nullable: false })
  availabilityStatus!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre completo para persona natural',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre completo para persona natural', nullable: true })
  fullName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Razón social para persona jurídica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Razón social para persona jurídica', nullable: true })
  legalName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre comercial si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre comercial si aplica', nullable: true })
  tradeName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de documento de identidad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de documento de identidad', nullable: true })
  identityDocumentType?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de documento de identidad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de documento de identidad', nullable: true })
  identityDocumentNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Licencia de conducción si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Licencia de conducción si aplica', nullable: true })
  driverLicenseNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador fiscal del transportista jurídico',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador fiscal del transportista jurídico', nullable: true })
  fiscalIdentifier?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Representante legal del transportista jurídico',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Representante legal del transportista jurídico', nullable: true })
  legalRepresentative?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Zonas geográficas cubiertas',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Zonas geográficas cubiertas', nullable: true })
  coverageZones?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Resumen de flota o medios de transporte',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Resumen de flota o medios de transporte', nullable: true })
  fleetSummary?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos operativos del transportista',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos operativos del transportista', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseTransporterDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class TransporterDto extends BaseTransporterDto {
  // Propiedades específicas de la clase TransporterDto en cuestión

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
  constructor(partial: Partial<TransporterDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TransporterDto>): TransporterDto {
    const instance = new TransporterDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class TransporterValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => TransporterDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => TransporterDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class TransporterOutPutDto extends BaseTransporterDto {
  // Propiedades específicas de la clase TransporterOutPutDto en cuestión

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
  constructor(partial: Partial<TransporterOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TransporterOutPutDto>): TransporterOutPutDto {
    const instance = new TransporterOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateTransporterDto extends BaseTransporterDto {
  // Propiedades específicas de la clase CreateTransporterDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateTransporter a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateTransporterDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateTransporterDto>): CreateTransporterDto {
    const instance = new CreateTransporterDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateTransporterDto {
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
    type: () => CreateTransporterDto,
    description: 'Instancia CreateTransporter o UpdateTransporter',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateTransporterDto, { nullable: true })
  input?: CreateTransporterDto | UpdateTransporterDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteTransporterDto {
  // Propiedades específicas de la clase DeleteTransporterDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteTransporter a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteTransporter a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateTransporterDto extends BaseTransporterDto {
  // Propiedades específicas de la clase UpdateTransporterDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateTransporter a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateTransporterDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateTransporterDto>): UpdateTransporterDto {
    const instance = new UpdateTransporterDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



