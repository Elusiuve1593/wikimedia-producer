import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CompressionTypes } from '@nestjs/microservices/external/kafka.interface';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'producer',
            brokers: ['localhost:9092'],
            retry: {
              initialRetryTime: 100,
              retries: 3,
            },
          },
          producer: {
            allowAutoTopicCreation: true,
            idempotent: true,
          },
          send: {
            acks: -1,
            compression: CompressionTypes.GZIP,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
