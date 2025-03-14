import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  @Get('send')
  sendMessage() {
    this.kafkaClient.emit('test', {
      message: 'Hello from Kafka!',
    });
    return { status: 'Message sent!' };
  }
}
