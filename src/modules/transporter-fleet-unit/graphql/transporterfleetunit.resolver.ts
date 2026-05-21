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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { TransporterFleetUnit } from "../entities/transporter-fleet-unit.entity";

//Definición de comandos
import {
  CreateTransporterFleetUnitCommand,
  UpdateTransporterFleetUnitCommand,
  DeleteTransporterFleetUnitCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { TransporterFleetUnitQueryService } from "../services/transporterfleetunitquery.service";


import { TransporterFleetUnitResponse, TransporterFleetUnitsResponse } from "../types/transporterfleetunit.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateTransporterFleetUnitDto, 
CreateOrUpdateTransporterFleetUnitDto, 
TransporterFleetUnitValueInput, 
TransporterFleetUnitDto, 
CreateTransporterFleetUnitDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => TransporterFleetUnit)
export class TransporterFleetUnitResolver {

   //Constructor del resolver de TransporterFleetUnit
  constructor(
    private readonly service: TransporterFleetUnitQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  // Mutaciones
  @Mutation(() => TransporterFleetUnitResponse<TransporterFleetUnit>)
  async createTransporterFleetUnit(
    @Args("input", { type: () => CreateTransporterFleetUnitDto }) input: CreateTransporterFleetUnitDto
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    return this.commandBus.execute(new CreateTransporterFleetUnitCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Mutation(() => TransporterFleetUnitResponse<TransporterFleetUnit>)
  async updateTransporterFleetUnit(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateTransporterFleetUnitDto
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateTransporterFleetUnitCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Mutation(() => TransporterFleetUnitResponse<TransporterFleetUnit>)
  async createOrUpdateTransporterFleetUnit(
    @Args("data", { type: () => CreateOrUpdateTransporterFleetUnitDto })
    data: CreateOrUpdateTransporterFleetUnitDto
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    if (data.id) {
      const existingTransporterFleetUnit = await this.service.findById(data.id);
      if (existingTransporterFleetUnit) {
        return this.commandBus.execute(
          new UpdateTransporterFleetUnitCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateTransporterFleetUnitDto | UpdateTransporterFleetUnitDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateTransporterFleetUnitCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateTransporterFleetUnitDto | UpdateTransporterFleetUnitDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteTransporterFleetUnit(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteTransporterFleetUnitCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  // Queries
  @Query(() => TransporterFleetUnitsResponse<TransporterFleetUnit>)
  async transporterfleetunits(
    options?: FindManyOptions<TransporterFleetUnit>,
    paginationArgs?: PaginationArgs
  ): Promise<TransporterFleetUnitsResponse<TransporterFleetUnit>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => TransporterFleetUnitsResponse<TransporterFleetUnit>)
  async transporterfleetunit(
    @Args("id", { type: () => String }) id: string
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => TransporterFleetUnitsResponse<TransporterFleetUnit>)
  async transporterfleetunitsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => TransporterFleetUnitValueInput }) value: TransporterFleetUnitValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TransporterFleetUnitsResponse<TransporterFleetUnit>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => TransporterFleetUnitsResponse<TransporterFleetUnit>)
  async transporterfleetunitsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TransporterFleetUnitsResponse<TransporterFleetUnit>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => Number)
  async totalTransporterFleetUnits(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => TransporterFleetUnitsResponse<TransporterFleetUnit>)
  async searchTransporterFleetUnits(
    @Args("where", { type: () => TransporterFleetUnitDto, nullable: false })
    where: Record<string, any>
  ): Promise<TransporterFleetUnitsResponse<TransporterFleetUnit>> {
    const transporterfleetunits = await this.service.findAndCount(where);
    return transporterfleetunits;
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => TransporterFleetUnitResponse<TransporterFleetUnit>, { nullable: true })
  async findOneTransporterFleetUnit(
    @Args("where", { type: () => TransporterFleetUnitDto, nullable: false })
    where: Record<string, any>
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterFleetUnitResolver.name)

      .get(TransporterFleetUnitResolver.name),
    })
  @Query(() => TransporterFleetUnitResponse<TransporterFleetUnit>)
  async findOneTransporterFleetUnitOrFail(
    @Args("where", { type: () => TransporterFleetUnitDto, nullable: false })
    where: Record<string, any>
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit> | Error> {
    return this.service.findOneOrFail(where);
  }
}

