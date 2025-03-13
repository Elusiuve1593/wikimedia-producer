import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TopicCreateEvent } from './topic-create.event';
import { EventSource } from 'eventsource';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private eventSource: EventSource;
  private readonly WIKIMEDIA_STREAM_URL =
    'https://stream.wikimedia.org/v2/stream/recentchange';

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.startStreaming();
  }

  private startStreaming() {
    const eventSource = new EventSource(this.WIKIMEDIA_STREAM_URL);

    eventSource.onmessage = (event: MessageEvent<any>) => {
      const data = JSON.parse(event.data);
      console.log('Took change from Wikimedia: ', data);

      this.kafkaClient.emit('wikimedia-changes', data);
    };

    eventSource.onerror = (err: ErrorEvent) => {
      console.error('Streamin wikimedia error ', err);
    };
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
    this.eventSource.close();
    console.log('EventSource connection closed');
  }

  sendMessage(message: string) {
    return this.kafkaClient.emit(
      'topic_created',
      new TopicCreateEvent(message),
    );
  }
}
