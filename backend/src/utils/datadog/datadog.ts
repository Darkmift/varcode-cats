import { ConsoleLogger, Injectable } from '@nestjs/common';
import { client, v2 } from '@datadog/datadog-api-client';
import { RootConfig } from '@/config/env.validation';

@Injectable()
export class DatadogLogger extends ConsoleLogger {
  private datadogLogger: v2.LogsApi;

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
    const apiInstance = new v2.LogsApi(configuration);

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

    const payload = {
      message,
      trace,
      context,
    };

    const logEntry = {
      ddsource: 'nestjs',
      ddtags: `level:${level}`,
      hostname: 'cats-app',
      service: 'cats-app-service',
      message: JSON.stringify(payload),
      additionalProperties: {
        metada: JSON.stringify(payload),
      },
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

//a fn that tries to json.parse a string and returns the string if it fails
function tryParseJSON(jsonString: string) {
  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (e) {
    return jsonString;
  }
}
