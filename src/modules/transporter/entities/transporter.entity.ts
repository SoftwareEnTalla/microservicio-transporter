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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateTransporterDto, UpdateTransporterDto, DeleteTransporterDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { TransporterFleetUnit } from '../../transporter-fleet-unit/entities/transporter-fleet-unit.entity';

@Index('idx_transporter_user_id', ['userId'], { unique: true })
@Index('idx_transporter_code', ['transporterCode'], { unique: true })
@Unique('uq_transporter_user_id', ['userId'])
@Unique('uq_transporter_code', ['transporterCode'])
@ChildEntity('transporter')
@ObjectType()
export class Transporter extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Transporter",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Transporter", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Transporter' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Transporter",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Transporter", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Transporter' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia canónica al user del microservicio security',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia canónica al user del microservicio security', nullable: false })
  @Column({ type: 'uuid', nullable: false, unique: true, comment: 'Referencia canónica al user del microservicio security' })
  userId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único del transportista',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único del transportista', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código único del transportista' })
  transporterCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de transportista: persona natural o jurídica',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de transportista: persona natural o jurídica', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Tipo de transportista: persona natural o jurídica' })
  transporterType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo operativo: enterprise logistics o simple delivery',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo operativo: enterprise logistics o simple delivery', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Modo operativo: enterprise logistics o simple delivery' })
  transporterMode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de aprobación operativa',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de aprobación operativa', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Estado de aprobación operativa' })
  approvalStatus!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Disponibilidad actual para nuevas asignaciones',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Disponibilidad actual para nuevas asignaciones', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Disponibilidad actual para nuevas asignaciones' })
  availabilityStatus!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre completo para persona natural',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre completo para persona natural', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Nombre completo para persona natural' })
  fullName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Razón social para persona jurídica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Razón social para persona jurídica', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Razón social para persona jurídica' })
  legalName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre comercial si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre comercial si aplica', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Nombre comercial si aplica' })
  tradeName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de documento de identidad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de documento de identidad', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 50, comment: 'Tipo de documento de identidad' })
  identityDocumentType?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de documento de identidad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de documento de identidad', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Número de documento de identidad' })
  identityDocumentNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Licencia de conducción si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Licencia de conducción si aplica', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Licencia de conducción si aplica' })
  driverLicenseNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador fiscal del transportista jurídico',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador fiscal del transportista jurídico', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Identificador fiscal del transportista jurídico' })
  fiscalIdentifier?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Representante legal del transportista jurídico',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Representante legal del transportista jurídico', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Representante legal del transportista jurídico' })
  legalRepresentative?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Zonas geográficas cubiertas',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Zonas geográficas cubiertas', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Zonas geográficas cubiertas' })
  coverageZones?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Resumen de flota o medios de transporte',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Resumen de flota o medios de transporte', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Resumen de flota o medios de transporte' })
  fleetSummary?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos operativos del transportista',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos operativos del transportista', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos operativos del transportista' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => [TransporterFleetUnit],
    nullable: true,
    description: 'Recursos de flota o unidades asociadas',
  })
  @Field(() => [TransporterFleetUnit], { nullable: true })
  @OneToMany(() => TransporterFleetUnit, (transporterFleetUnit) => transporterFleetUnit.transporter)
  fleetUnits?: TransporterFleetUnit[];

  protected executeDslLifecycle(): void {
    // Rule: transporter-must-reference-user
    // Todo transportista debe mantener referencia a un user canónico.
    if (!(!(this.userId === undefined || this.userId === null || (typeof this.userId === 'string' && String(this.userId).trim() === '') || (Array.isArray(this.userId) && this.userId.length === 0) || (typeof this.userId === 'object' && !Array.isArray(this.userId) && Object.prototype.toString.call(this.userId) === '[object Object]' && Object.keys(Object(this.userId)).length === 0)))) {
      throw new Error('TRANSPORTER_001: Todo transportista debe referenciar un user canónico');
    }

    // Rule: person-transporter-requires-identity
    // Un transportista persona natural debe declarar documento y licencia cuando corresponda.
    if (this.transporterType === 'PERSON' && ((this.identityDocumentNumber === undefined || this.identityDocumentNumber === null || (typeof this.identityDocumentNumber === 'string' && String(this.identityDocumentNumber).trim() === '') || (Array.isArray(this.identityDocumentNumber) && this.identityDocumentNumber.length === 0) || (typeof this.identityDocumentNumber === 'object' && !Array.isArray(this.identityDocumentNumber) && Object.prototype.toString.call(this.identityDocumentNumber) === '[object Object]' && Object.keys(Object(this.identityDocumentNumber)).length === 0)) || (this.driverLicenseNumber === undefined || this.driverLicenseNumber === null || (typeof this.driverLicenseNumber === 'string' && String(this.driverLicenseNumber).trim() === '') || (Array.isArray(this.driverLicenseNumber) && this.driverLicenseNumber.length === 0) || (typeof this.driverLicenseNumber === 'object' && !Array.isArray(this.driverLicenseNumber) && Object.prototype.toString.call(this.driverLicenseNumber) === '[object Object]' && Object.keys(Object(this.driverLicenseNumber)).length === 0)))) {
      throw new Error('TRANSPORTER_002: El transportista persona natural requiere documento y licencia');
    }

    // Rule: company-transporter-requires-fiscal-data
    // Un transportista jurídico debe declarar identificador fiscal y representante legal.
    if (this.transporterType === 'COMPANY' && ((this.fiscalIdentifier === undefined || this.fiscalIdentifier === null || (typeof this.fiscalIdentifier === 'string' && String(this.fiscalIdentifier).trim() === '') || (Array.isArray(this.fiscalIdentifier) && this.fiscalIdentifier.length === 0) || (typeof this.fiscalIdentifier === 'object' && !Array.isArray(this.fiscalIdentifier) && Object.prototype.toString.call(this.fiscalIdentifier) === '[object Object]' && Object.keys(Object(this.fiscalIdentifier)).length === 0)) || (this.legalRepresentative === undefined || this.legalRepresentative === null || (typeof this.legalRepresentative === 'string' && String(this.legalRepresentative).trim() === '') || (Array.isArray(this.legalRepresentative) && this.legalRepresentative.length === 0) || (typeof this.legalRepresentative === 'object' && !Array.isArray(this.legalRepresentative) && Object.prototype.toString.call(this.legalRepresentative) === '[object Object]' && Object.keys(Object(this.legalRepresentative)).length === 0)))) {
      throw new Error('TRANSPORTER_003: El transportista jurídico requiere datos fiscales y representante legal');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'transporter';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateTransporterDto): Transporter;
  static fromDto(dto: UpdateTransporterDto): Transporter;
  static fromDto(dto: DeleteTransporterDto): Transporter;
  static fromDto(dto: any): Transporter {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Transporter, dto);
  }
}
