import axios from "axios";
import { env } from "env";

const isServer = typeof window === "undefined";

type LogParams = {
  logUrl: string;
  appName: string;
  typeName?: string;
  message: string;
};

export function log(params: LogParams) {
  console.log(
    `>> ${params.typeName ? `[${params.typeName}]` : ""} ${params.message}`
  );

  if (isServer && env.NODE_ENV === "production")
    axios
      .post(params.logUrl, {
        appName: params.appName,
        typeName: params.typeName,
        message: params.message,
      })
      .catch((err) => {
        console.error(
          `\n>> ❌ ${
            params.typeName ? `[${params.typeName}]` : ""
          } FAILED TO SAVE LOG\n`
        );
        console.error(err);
      });
}

type LogClientConfig = {
  logUrl?: string;
  appName: string;
};

export class LogClient {
  private logUrl: string;
  private appName: string;

  constructor(config: LogClientConfig) {
    if (config.logUrl) {
      this.logUrl = config.logUrl;
    } else {
      this.logUrl = env.PUBLIC_LOG_URL;
    }

    this.appName = config.appName;
  }

  log(message: string, typeName?: string) {
    log({
      logUrl: this.logUrl,
      appName: this.appName,
      message: message,
      typeName: typeName,
    });
  }
}
