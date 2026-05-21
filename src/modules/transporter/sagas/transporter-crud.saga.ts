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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  TransporterCreatedEvent,
  TransporterUpdatedEvent,
  TransporterDeletedEvent,
  TransporterApprovedEvent,
  TransporterAvailabilityUpdatedEvent,
  TransporterCapacityUpdatedEvent,
} from '../events/exporting.event';
import {
  SagaTransporterFailedEvent
} from '../events/transporter-failed.event';
import {
  CreateTransporterCommand,
  UpdateTransporterCommand,
  DeleteTransporterCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class TransporterCrudSaga {
  private readonly logger = new Logger(TransporterCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onTransporterCreated = ($events: Observable<TransporterCreatedEvent>) => {
    return $events.pipe(
      ofType(TransporterCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Transporter: ${event.aggregateId}`);
        void this.handleTransporterCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onTransporterUpdated = ($events: Observable<TransporterUpdatedEvent>) => {
    return $events.pipe(
      ofType(TransporterUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Transporter: ${event.aggregateId}`);
        void this.handleTransporterUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onTransporterDeleted = ($events: Observable<TransporterDeletedEvent>) => {
    return $events.pipe(
      ofType(TransporterDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Transporter: ${event.aggregateId}`);
        void this.handleTransporterDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTransporterApproved = ($events: Observable<TransporterApprovedEvent>) => {
    return $events.pipe(
      ofType(TransporterApprovedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TransporterApproved: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTransporterAvailabilityUpdated = ($events: Observable<TransporterAvailabilityUpdatedEvent>) => {
    return $events.pipe(
      ofType(TransporterAvailabilityUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TransporterAvailabilityUpdated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTransporterCapacityUpdated = ($events: Observable<TransporterCapacityUpdatedEvent>) => {
    return $events.pipe(
      ofType(TransporterCapacityUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TransporterCapacityUpdated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterCrudSaga.name)
      .get(TransporterCrudSaga.name),
  })
  private async handleTransporterCreated(event: TransporterCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Transporter Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterCrudSaga.name)
      .get(TransporterCrudSaga.name),
  })
  private async handleTransporterUpdated(event: TransporterUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Transporter Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(TransporterCrudSaga.name)
      .get(TransporterCrudSaga.name),
  })
  private async handleTransporterDeleted(event: TransporterDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Transporter Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaTransporterFailedEvent( error,event));
  }
}
