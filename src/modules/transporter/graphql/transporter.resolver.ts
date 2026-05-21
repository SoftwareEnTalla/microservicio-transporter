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
import { Transporter } from "../entities/transporter.entity";

//Definición de comandos
import {
  CreateTransporterCommand,
  UpdateTransporterCommand,
  DeleteTransporterCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { TransporterQueryService } from "../services/transporterquery.service";


import { TransporterResponse, TransportersResponse } from "../types/transporter.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateTransporterDto, 
CreateOrUpdateTransporterDto, 
TransporterValueInput, 
TransporterDto, 
CreateTransporterDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Transporter)
export class TransporterResolver {

   //Constructor del resolver de Transporter
  constructor(
    private readonly service: TransporterQueryService,
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  // Mutaciones
  @Mutation(() => TransporterResponse<Transporter>)
  async createTransporter(
    @Args("input", { type: () => CreateTransporterDto }) input: CreateTransporterDto
  ): Promise<TransporterResponse<Transporter>> {
    return this.commandBus.execute(new CreateTransporterCommand(input));
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Mutation(() => TransporterResponse<Transporter>)
  async updateTransporter(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateTransporterDto
  ): Promise<TransporterResponse<Transporter>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateTransporterCommand(payLoad, {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Mutation(() => TransporterResponse<Transporter>)
  async createOrUpdateTransporter(
    @Args("data", { type: () => CreateOrUpdateTransporterDto })
    data: CreateOrUpdateTransporterDto
  ): Promise<TransporterResponse<Transporter>> {
    if (data.id) {
      const existingTransporter = await this.service.findById(data.id);
      if (existingTransporter) {
        return this.commandBus.execute(
          new UpdateTransporterCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateTransporterDto | UpdateTransporterDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateTransporterCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateTransporterDto | UpdateTransporterDto).createdBy ||
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteTransporter(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteTransporterCommand(id));
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  // Queries
  @Query(() => TransportersResponse<Transporter>)
  async transporters(
    options?: FindManyOptions<Transporter>,
    paginationArgs?: PaginationArgs
  ): Promise<TransportersResponse<Transporter>> {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => TransportersResponse<Transporter>)
  async transporter(
    @Args("id", { type: () => String }) id: string
  ): Promise<TransporterResponse<Transporter>> {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => TransportersResponse<Transporter>)
  async transportersByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => TransporterValueInput }) value: TransporterValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TransportersResponse<Transporter>> {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => TransportersResponse<Transporter>)
  async transportersWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TransportersResponse<Transporter>> {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => Number)
  async totalTransporters(): Promise<number> {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => TransportersResponse<Transporter>)
  async searchTransporters(
    @Args("where", { type: () => TransporterDto, nullable: false })
    where: Record<string, any>
  ): Promise<TransportersResponse<Transporter>> {
    const transporters = await this.service.findAndCount(where);
    return transporters;
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => TransporterResponse<Transporter>, { nullable: true })
  async findOneTransporter(
    @Args("where", { type: () => TransporterDto, nullable: false })
    where: Record<string, any>
  ): Promise<TransporterResponse<Transporter>> {
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
      .registerClient(TransporterResolver.name)

      .get(TransporterResolver.name),
    })
  @Query(() => TransporterResponse<Transporter>)
  async findOneTransporterOrFail(
    @Args("where", { type: () => TransporterDto, nullable: false })
    where: Record<string, any>
  ): Promise<TransporterResponse<Transporter> | Error> {
    return this.service.findOneOrFail(where);
  }
}

