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
import { Transporter } from "../entities/transporter.entity";
import { CreateTransporterDto, UpdateTransporterDto, DeleteTransporterDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { TransporterCommandRepository } from "../repositories/transportercommand.repository";
import { TransporterQueryRepository } from "../repositories/transporterquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { TransporterResponse, TransportersResponse } from "../types/transporter.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { TransporterQueryService } from "./transporterquery.service";
import { BaseEvent } from "../events/base.event";
import { TransporterApprovedEvent } from '../events/transporterapproved.event';
import { TransporterAvailabilityUpdatedEvent } from '../events/transporteravailabilityupdated.event';
import { TransporterCapacityUpdatedEvent } from '../events/transportercapacityupdated.event';

@Injectable()
export class TransporterCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(TransporterCommandService.name);
  //Constructo del servicio TransporterCommandService
  constructor(
    private readonly repository: TransporterCommandRepository,
    private readonly queryRepository: TransporterQueryRepository,
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
      .registerClient(TransporterQueryService.name)
      .get(TransporterQueryService.name),
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
        await this.eventStore.appendEvent('transporter-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Transporter | null,
    current?: Transporter | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: transporter-must-reference-user
      // Todo transportista debe mantener referencia a un user canónico.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'userId') === undefined || this.dslValue(entityData, currentData, inputData, 'userId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'userId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && this.dslValue(entityData, currentData, inputData, 'userId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'userId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'userId'))).length === 0)))) {
        throw new Error('TRANSPORTER_001: Todo transportista debe referenciar un user canónico');
      }

      // Regla de servicio: person-transporter-requires-identity
      // Un transportista persona natural debe declarar documento y licencia cuando corresponda.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'transporterType') === 'PERSON') || (!(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === undefined || this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === null || (typeof this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')) && this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === undefined || this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === null || (typeof this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')) && this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber'))).length === 0)))))) {
        throw new Error('TRANSPORTER_002: El transportista persona natural requiere documento y licencia');
      }

      // Regla de servicio: company-transporter-requires-fiscal-data
      // Un transportista jurídico debe declarar identificador fiscal y representante legal.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'transporterType') === 'COMPANY') || (!(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === undefined || this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === null || (typeof this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')) && this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === undefined || this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === null || (typeof this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')) && this.dslValue(entityData, currentData, inputData, 'legalRepresentative').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'legalRepresentative'))).length === 0)))))) {
        throw new Error('TRANSPORTER_003: El transportista jurídico requiere datos fiscales y representante legal');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: transporter-must-reference-user
      // Todo transportista debe mantener referencia a un user canónico.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'userId') === undefined || this.dslValue(entityData, currentData, inputData, 'userId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'userId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && this.dslValue(entityData, currentData, inputData, 'userId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'userId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'userId'))).length === 0)))) {
        throw new Error('TRANSPORTER_001: Todo transportista debe referenciar un user canónico');
      }

      // Regla de servicio: person-transporter-requires-identity
      // Un transportista persona natural debe declarar documento y licencia cuando corresponda.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'transporterType') === 'PERSON') || (!(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === undefined || this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === null || (typeof this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')) && this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'identityDocumentNumber'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === undefined || this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === null || (typeof this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')) && this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'driverLicenseNumber'))).length === 0)))))) {
        throw new Error('TRANSPORTER_002: El transportista persona natural requiere documento y licencia');
      }

      // Regla de servicio: company-transporter-requires-fiscal-data
      // Un transportista jurídico debe declarar identificador fiscal y representante legal.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'transporterType') === 'COMPANY') || (!(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === undefined || this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === null || (typeof this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')) && this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'fiscalIdentifier'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === undefined || this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === null || (typeof this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')) && this.dslValue(entityData, currentData, inputData, 'legalRepresentative').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'legalRepresentative') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'legalRepresentative')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'legalRepresentative'))).length === 0)))))) {
        throw new Error('TRANSPORTER_003: El transportista jurídico requiere datos fiscales y representante legal');
      }

      // Regla de servicio: approved-transporter-emits-domain-event
      // Cuando un transportista queda aprobado debe emitirse un evento para shipping y returns.
      if (this.dslValue(entityData, currentData, inputData, 'approvalStatus') === 'APPROVED') {
        pendingEvents.push(TransporterApprovedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'transporter-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'transporter-update')
        ));
      }

    }
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
      .registerClient(TransporterCommandService.name)
      .get(TransporterCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateTransporterDto>("createTransporter", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createTransporterDtoInput: CreateTransporterDto
  ): Promise<TransporterResponse<Transporter>> {
    try {
      logger.info("Receiving in service:", createTransporterDtoInput);
      const candidate = Transporter.fromDto(createTransporterDtoInput);
      await this.applyDslServiceRules("create", createTransporterDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createTransporterDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el transporter no existe
      if (!entity)
        throw new NotFoundException("Entidad Transporter no encontrada.");
      // Devolver transporter
      return {
        ok: true,
        message: "Transporter obtenido con éxito.",
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
      .registerClient(TransporterCommandService.name)
      .get(TransporterCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Transporter>("createTransporters", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createTransporterDtosInput: CreateTransporterDto[]
  ): Promise<TransportersResponse<Transporter>> {
    try {
      const entities = await this.repository.bulkCreate(
        createTransporterDtosInput.map((entity) => Transporter.fromDto(entity))
      );

      // Respuesta si el transporter no existe
      if (!entities)
        throw new NotFoundException("Entidades Transporters no encontradas.");
      // Devolver transporter
      return {
        ok: true,
        message: "Transporters creados con éxito.",
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
      .registerClient(TransporterCommandService.name)
      .get(TransporterCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTransporterDto>("updateTransporter", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateTransporterDto
  ): Promise<TransporterResponse<Transporter>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Transporter(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el transporter no existe
      if (!entity)
        throw new NotFoundException("Entidades Transporters no encontradas.");
      // Devolver transporter
      return {
        ok: true,
        message: "Transporter actualizada con éxito.",
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
      .registerClient(TransporterCommandService.name)
      .get(TransporterCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTransporterDto>("updateTransporters", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateTransporterDto[]
  ): Promise<TransportersResponse<Transporter>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Transporter.fromDto(entity))
      );
      // Respuesta si el transporter no existe
      if (!entities)
        throw new NotFoundException("Entidades Transporters no encontradas.");
      // Devolver transporter
      return {
        ok: true,
        message: "Transporters actualizadas con éxito.",
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
      .registerClient(TransporterCommandService.name)
      .get(TransporterCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteTransporterDto>("deleteTransporter", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<TransporterResponse<Transporter>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el transporter no existe
      if (!entity)
        throw new NotFoundException("Instancias de Transporter no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver transporter
      return {
        ok: true,
        message: "Instancia de Transporter eliminada con éxito.",
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
      .registerClient(TransporterCommandService.name)
      .get(TransporterCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteTransporters", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

