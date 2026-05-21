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
import { CreateTransporterFleetUnitDto, UpdateTransporterFleetUnitDto, DeleteTransporterFleetUnitDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Transporter } from '../../transporter/entities/transporter.entity';

@Index('idx_transporter_fleet_unit_code', ['unitCode'], { unique: true })
@ChildEntity('transporterfleetunit')
@ObjectType()
export class TransporterFleetUnit extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de TransporterFleetUnit",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de TransporterFleetUnit", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia TransporterFleetUnit' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de TransporterFleetUnit",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de TransporterFleetUnit", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia TransporterFleetUnit' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único de la unidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único de la unidad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código único de la unidad' })
  unitCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Transportista dueño de la unidad',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Transportista dueño de la unidad', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Transportista dueño de la unidad' })
  transporterId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de vehículo o recurso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de vehículo o recurso', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Tipo de vehículo o recurso' })
  vehicleType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Matrícula si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Matrícula si aplica', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 50, comment: 'Matrícula si aplica' })
  plateNumber?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Capacidad de peso',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Capacidad de peso', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Capacidad de peso' })
  capacityWeightKg?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Capacidad de volumen',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Capacidad de volumen', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Capacidad de volumen' })
  capacityVolumeM3?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo de la unidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo de la unidad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Estado operativo de la unidad' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos operativos de la unidad',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos operativos de la unidad', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos operativos de la unidad' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => Transporter,
    nullable: false,
    description: 'Relación con Transporter',
  })
  @Field(() => Transporter, { nullable: false })
  @ManyToOne(() => Transporter, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transporterId' })
  transporter!: Transporter;

  protected executeDslLifecycle(): void {
    // No se definieron business-rules en el DSL.
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'transporterfleetunit';
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
  static fromDto(dto: CreateTransporterFleetUnitDto): TransporterFleetUnit;
  static fromDto(dto: UpdateTransporterFleetUnitDto): TransporterFleetUnit;
  static fromDto(dto: DeleteTransporterFleetUnitDto): TransporterFleetUnit;
  static fromDto(dto: any): TransporterFleetUnit {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(TransporterFleetUnit, dto);
  }
}
