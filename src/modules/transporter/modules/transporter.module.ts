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
import { TransporterCommandController } from "../controllers/transportercommand.controller";
import { TransporterQueryController } from "../controllers/transporterquery.controller";
import { TransporterCommandService } from "../services/transportercommand.service";
import { TransporterQueryService } from "../services/transporterquery.service";

import { TransporterCommandRepository } from "../repositories/transportercommand.repository";
import { TransporterQueryRepository } from "../repositories/transporterquery.repository";
import { TransporterRepository } from "../repositories/transporter.repository";
import { TransporterResolver } from "../graphql/transporter.resolver";
import { TransporterAuthGuard } from "../guards/transporterauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transporter } from "../entities/transporter.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTransporterHandler } from "../commands/handlers/createtransporter.handler";
import { UpdateTransporterHandler } from "../commands/handlers/updatetransporter.handler";
import { DeleteTransporterHandler } from "../commands/handlers/deletetransporter.handler";
import { GetTransporterByIdHandler } from "../queries/handlers/gettransporterbyid.handler";
import { GetTransporterByFieldHandler } from "../queries/handlers/gettransporterbyfield.handler";
import { GetAllTransporterHandler } from "../queries/handlers/getalltransporter.handler";
import { TransporterCrudSaga } from "../sagas/transporter-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TransporterInterceptor } from "../interceptors/transporter.interceptor";
import { TransporterLoggingInterceptor } from "../interceptors/transporter.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Transporter]), // Incluir BaseEntity para herencia
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
  controllers: [TransporterCommandController, TransporterQueryController],
  providers: [
    //Services
    EventStoreService,
    TransporterQueryService,
    TransporterCommandService,
  
    //Repositories
    TransporterCommandRepository,
    TransporterQueryRepository,
    TransporterRepository,      
    //Resolvers
    TransporterResolver,
    //Guards
    TransporterAuthGuard,
    //Interceptors
    TransporterInterceptor,
    TransporterLoggingInterceptor,
    //CQRS Handlers
    CreateTransporterHandler,
    UpdateTransporterHandler,
    DeleteTransporterHandler,
    GetTransporterByIdHandler,
    GetTransporterByFieldHandler,
    GetAllTransporterHandler,
    TransporterCrudSaga,
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
    TransporterQueryService,
    TransporterCommandService,
  
    //Repositories
    TransporterCommandRepository,
    TransporterQueryRepository,
    TransporterRepository,      
    //Resolvers
    TransporterResolver,
    //Guards
    TransporterAuthGuard,
    //Interceptors
    TransporterInterceptor,
    TransporterLoggingInterceptor,
  ],
})
export class TransporterModule {}

