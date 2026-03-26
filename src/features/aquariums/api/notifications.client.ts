import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IHttpConnectionOptions,
  LogLevel
} from '@microsoft/signalr';
import {
  FeedingUpdatePayload,
  HUB_METHODS,
  HUB_PATH,
  RuleTriggeredPayload,
  SIGNALR_EVENTS
} from '@/features/aquariums/api/notifications.contract';

type Handlers = {
  feedingUpdate?: (payload: FeedingUpdatePayload) => void;
  ruleTriggered?: (payload: RuleTriggeredPayload) => void;
  reconnecting?: (err?: Error) => void;
  reconnected?: (connectionId?: string) => void;
  closed?: (err?: Error) => void;
};

type NotificationClientOptions = {
  baseUrl: string;
  logLevel?: LogLevel;
  httpOptions?: IHttpConnectionOptions;
  handlers?: Handlers;
};

export class NotificationClient {
  private readonly connection: HubConnection;
  private readonly handlers?: Handlers;

  constructor(opts: NotificationClientOptions) {
    this.handlers = opts.handlers;

    const url = `${opts.baseUrl.replace(/\/+$/, '')}${HUB_PATH}`;

    const connectionBuilder = new HubConnectionBuilder();
    if (opts.httpOptions) {
      connectionBuilder.withUrl(url, opts.httpOptions);
    } else {
      connectionBuilder.withUrl(url);
    }

    this.connection = connectionBuilder
      .withAutomaticReconnect()
      .configureLogging(opts.logLevel ?? LogLevel.Information)
      .build();

    this.connection.on(SIGNALR_EVENTS.FEEDING_UPDATE, (payload: FeedingUpdatePayload) => {
      this.handlers?.feedingUpdate?.(payload);
    });

    this.connection.on(SIGNALR_EVENTS.RULE_TRIGGERED, (payload: RuleTriggeredPayload) => {
      this.handlers?.ruleTriggered?.(payload);
    });

    this.connection.onreconnecting((err) => this.handlers?.reconnecting?.(err ?? undefined));
    this.connection.onreconnected((id) => this.handlers?.reconnected?.(id ?? undefined));
    this.connection.onclose((err) => this.handlers?.closed?.(err ?? undefined));
  }

  get state() {
    return this.connection.state;
  }

  async start() {
    if (this.connection.state !== HubConnectionState.Disconnected) return;
    await this.connection.start();
  }

  async stop() {
    if (this.connection.state === HubConnectionState.Disconnected) return;
    await this.connection.stop();
  }

  async subscribeToAquarium(aquariumId: string) {
    await this.connection.invoke(HUB_METHODS.SUBSCRIBE_TO_AQUARIUM, aquariumId);
  }

  async unsubscribeFromAquarium(aquariumId: string) {
    await this.connection.invoke(HUB_METHODS.UNSUBSCRIBE_FROM_AQUARIUM, aquariumId);
  }

  async subscribeToAll() {
    await this.connection.invoke(HUB_METHODS.SUBSCRIBE_TO_ALL);
  }

  async unsubscribeFromAll() {
    await this.connection.invoke(HUB_METHODS.UNSUBSCRIBE_FROM_ALL);
  }
}
