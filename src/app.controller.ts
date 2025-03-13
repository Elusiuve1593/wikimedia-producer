import { Body, Controller, Inject, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly appService: AppService,
  ) {}

  @Post()
  sendMessage(@Body() body: { message: string }) {
    return this.appService.sendMessage(body.message);
  }

  @Get('send')
  sendWikiMediaMessage() {
    this.kafkaClient.emit('wikimedia-changes', {
      message: 'Hello from Kafka!',
    });
    return { status: 'Message sent!' };
  }
}
