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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { TransporterFleetUnit } from "../entities/transporter-fleet-unit.entity";
import { CreateTransporterFleetUnitDto, UpdateTransporterFleetUnitDto, DeleteTransporterFleetUnitDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { TransporterFleetUnitCommandRepository } from "../repositories/transporterfleetunitcommand.repository";
import { TransporterFleetUnitQueryRepository } from "../repositories/transporterfleetunitquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { TransporterFleetUnitResponse, TransporterFleetUnitsResponse } from "../types/transporterfleetunit.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { TransporterFleetUnitQueryService } from "./transporterfleetunitquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class TransporterFleetUnitCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(TransporterFleetUnitCommandService.name);
  //Constructo del servicio TransporterFleetUnitCommandService
  constructor(
    private readonly repository: TransporterFleetUnitCommandRepository,
    private readonly queryRepository: TransporterFleetUnitQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitQueryService.name)
      .get(TransporterFleetUnitQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('transporter-fleet-unit-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: TransporterFleetUnit | null,
    current?: TransporterFleetUnit | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
// No se definieron business-rules target=service.
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitCommandService.name)
      .get(TransporterFleetUnitCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateTransporterFleetUnitDto>("createTransporterFleetUnit", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createTransporterFleetUnitDtoInput: CreateTransporterFleetUnitDto
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    try {
      logger.info("Receiving in service:", createTransporterFleetUnitDtoInput);
      const candidate = TransporterFleetUnit.fromDto(createTransporterFleetUnitDtoInput);
      await this.applyDslServiceRules("create", createTransporterFleetUnitDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createTransporterFleetUnitDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el transporterfleetunit no existe
      if (!entity)
        throw new NotFoundException("Entidad TransporterFleetUnit no encontrada.");
      // Devolver transporterfleetunit
      return {
        ok: true,
        message: "TransporterFleetUnit obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitCommandService.name)
      .get(TransporterFleetUnitCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<TransporterFleetUnit>("createTransporterFleetUnits", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createTransporterFleetUnitDtosInput: CreateTransporterFleetUnitDto[]
  ): Promise<TransporterFleetUnitsResponse<TransporterFleetUnit>> {
    try {
      const entities = await this.repository.bulkCreate(
        createTransporterFleetUnitDtosInput.map((entity) => TransporterFleetUnit.fromDto(entity))
      );

      // Respuesta si el transporterfleetunit no existe
      if (!entities)
        throw new NotFoundException("Entidades TransporterFleetUnits no encontradas.");
      // Devolver transporterfleetunit
      return {
        ok: true,
        message: "TransporterFleetUnits creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitCommandService.name)
      .get(TransporterFleetUnitCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTransporterFleetUnitDto>("updateTransporterFleetUnit", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateTransporterFleetUnitDto
  ): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new TransporterFleetUnit(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el transporterfleetunit no existe
      if (!entity)
        throw new NotFoundException("Entidades TransporterFleetUnits no encontradas.");
      // Devolver transporterfleetunit
      return {
        ok: true,
        message: "TransporterFleetUnit actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitCommandService.name)
      .get(TransporterFleetUnitCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTransporterFleetUnitDto>("updateTransporterFleetUnits", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateTransporterFleetUnitDto[]
  ): Promise<TransporterFleetUnitsResponse<TransporterFleetUnit>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => TransporterFleetUnit.fromDto(entity))
      );
      // Respuesta si el transporterfleetunit no existe
      if (!entities)
        throw new NotFoundException("Entidades TransporterFleetUnits no encontradas.");
      // Devolver transporterfleetunit
      return {
        ok: true,
        message: "TransporterFleetUnits actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitCommandService.name)
      .get(TransporterFleetUnitCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteTransporterFleetUnitDto>("deleteTransporterFleetUnit", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<TransporterFleetUnitResponse<TransporterFleetUnit>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el transporterfleetunit no existe
      if (!entity)
        throw new NotFoundException("Instancias de TransporterFleetUnit no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver transporterfleetunit
      return {
        ok: true,
        message: "Instancia de TransporterFleetUnit eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(TransporterFleetUnitCommandService.name)
      .get(TransporterFleetUnitCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteTransporterFleetUnits", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

