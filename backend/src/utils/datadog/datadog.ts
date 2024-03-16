import { ConsoleLogger, Injectable } from '@nestjs/common';
import { client, v1 } from '@datadog/datadog-api-client';
import { RootConfig } from '@/config/env.validation';

@Injectable()
export class DatadogLogger extends ConsoleLogger {
  private datadogLogger;

  constructor(private readonly rootConfig: RootConfig) {
    super();
    const configuration = client.createConfiguration({
      authMethods: {
        apiKeyAuth: this.rootConfig.DATADOG_API_KEY,
        appKeyAuth: this.rootConfig.DATADOG_APP_KEY,
      },
    });

    configuration.setServerVariables({
      site: 'datadoghq.eu',
    });
    const apiInstance = new v1.LogsApi(configuration);

    this.datadogLogger = apiInstance;
  }

  log(message: string, context?: string) {
    super.log(message, context); // Call the original NestJS log method
    this.sendLogToDatadog(message, 'info', context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.sendLogToDatadog(message, 'error', context, trace);
  }

  // Similarly, override warn, debug, verbose as needed

  private sendLogToDatadog(
    message: string,
    level: string,
    context?: string,
    trace?: string,
  ) {
    // Prepare the log entry
    const logEntry = {
      ddsource: 'nestjs',
      ddtags: `level:${level},context:${context}`,
      hostname: 'your-app-hostname', // Optional
      service: 'your-service-name',
      message: trace ? `${message} - Trace: ${trace}` : message,
      // Additional metadata can be included here
    };

    // Send the log to Datadog
    this.datadogLogger
      .submitLog({ body: [logEntry] })
      .then((data) => {
        // console.log('Log sent to Datadog', data)
      })
      .catch((error) => console.error('Failed to send log to Datadog', error));
  }
}
