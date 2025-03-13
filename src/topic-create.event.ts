export class TopicCreateEvent {
  constructor(private readonly message: string) {}

  toString() {
    return JSON.stringify({
      message: this.message,
    });
  }
}
