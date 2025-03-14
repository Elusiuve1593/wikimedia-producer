import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  @Get('send')
  sendWikiMediaMessage() {
    this.kafkaClient.emit('wikimedia-changes', {
      message: 'Hello from Kafka!',
    });
    return { status: 'Message sent!' };
  }
}
