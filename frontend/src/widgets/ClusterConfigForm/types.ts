type SecurityProtocol = 'SASL_SSL' | 'SASL_PLAINTEXT';
type BootstrapServer = {
  host: string;
  port: string;
};

type WithKeystore = {
  keystore?: {
    location: string;
    password: string;
  };
};

type WithAuth = {
  isAuth: boolean;
  username?: string;
  password?: string;
};

type URLWithAuth = WithAuth &
  WithKeystore & {
    url?: string;
    isActive?: string;
  };

type KafkaConnect = WithAuth &
  WithKeystore & {
    name: string;
    address: string;
  };

type Metrics = WithAuth &
  WithKeystore & {
    isActive?: string;
    type: string;
    port: string;
  };

export type ClusterConfigFormValues = {
  name: string;
  supportUrl: string;
  readOnly: boolean;
  bootstrapServers: BootstrapServer[];
  truststore?: {
    location: string;
    password: string;
  };
  auth?: WithKeystore & {
    isActive?: string;
    method: string;
    securityProtocol: SecurityProtocol;
    props: Record<string, string>;
  };
  schemaRegistry?: URLWithAuth;
  ksql?: URLWithAuth;
  properties?: Record<string, string>;
  kafkaConnect?: KafkaConnect[];
  metrics?: Metrics;
  customAuth: Record<string, string>;
};
