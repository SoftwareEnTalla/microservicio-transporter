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


import { Module } from "@nestjs/common";
import { TransporterFleetUnitCommandController } from "../controllers/transporterfleetunitcommand.controller";
import { TransporterFleetUnitQueryController } from "../controllers/transporterfleetunitquery.controller";
import { TransporterFleetUnitCommandService } from "../services/transporterfleetunitcommand.service";
import { TransporterFleetUnitQueryService } from "../services/transporterfleetunitquery.service";

import { TransporterFleetUnitCommandRepository } from "../repositories/transporterfleetunitcommand.repository";
import { TransporterFleetUnitQueryRepository } from "../repositories/transporterfleetunitquery.repository";
import { TransporterFleetUnitRepository } from "../repositories/transporterfleetunit.repository";
import { TransporterFleetUnitResolver } from "../graphql/transporterfleetunit.resolver";
import { TransporterFleetUnitAuthGuard } from "../guards/transporterfleetunitauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransporterFleetUnit } from "../entities/transporter-fleet-unit.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTransporterFleetUnitHandler } from "../commands/handlers/createtransporterfleetunit.handler";
import { UpdateTransporterFleetUnitHandler } from "../commands/handlers/updatetransporterfleetunit.handler";
import { DeleteTransporterFleetUnitHandler } from "../commands/handlers/deletetransporterfleetunit.handler";
import { GetTransporterFleetUnitByIdHandler } from "../queries/handlers/gettransporterfleetunitbyid.handler";
import { GetTransporterFleetUnitByFieldHandler } from "../queries/handlers/gettransporterfleetunitbyfield.handler";
import { GetAllTransporterFleetUnitHandler } from "../queries/handlers/getalltransporterfleetunit.handler";
import { TransporterFleetUnitCrudSaga } from "../sagas/transporterfleetunit-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TransporterFleetUnitInterceptor } from "../interceptors/transporterfleetunit.interceptor";
import { TransporterFleetUnitLoggingInterceptor } from "../interceptors/transporterfleetunit.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, TransporterFleetUnit]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [TransporterFleetUnitCommandController, TransporterFleetUnitQueryController],
  providers: [
    //Services
    EventStoreService,
    TransporterFleetUnitQueryService,
    TransporterFleetUnitCommandService,
  
    //Repositories
    TransporterFleetUnitCommandRepository,
    TransporterFleetUnitQueryRepository,
    TransporterFleetUnitRepository,      
    //Resolvers
    TransporterFleetUnitResolver,
    //Guards
    TransporterFleetUnitAuthGuard,
    //Interceptors
    TransporterFleetUnitInterceptor,
    TransporterFleetUnitLoggingInterceptor,
    //CQRS Handlers
    CreateTransporterFleetUnitHandler,
    UpdateTransporterFleetUnitHandler,
    DeleteTransporterFleetUnitHandler,
    GetTransporterFleetUnitByIdHandler,
    GetTransporterFleetUnitByFieldHandler,
    GetAllTransporterFleetUnitHandler,
    TransporterFleetUnitCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    TransporterFleetUnitQueryService,
    TransporterFleetUnitCommandService,
  
    //Repositories
    TransporterFleetUnitCommandRepository,
    TransporterFleetUnitQueryRepository,
    TransporterFleetUnitRepository,      
    //Resolvers
    TransporterFleetUnitResolver,
    //Guards
    TransporterFleetUnitAuthGuard,
    //Interceptors
    TransporterFleetUnitInterceptor,
    TransporterFleetUnitLoggingInterceptor,
  ],
})
export class TransporterFleetUnitModule {}

