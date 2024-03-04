import * as path from 'path';

import winston, { format, transports } from 'winston';

export class LoggerConfig {
  private readonly options: winston.LoggerOptions;

  constructor() {
    this.options = {
      exitOnError: false,

      format: format.combine(
        format.timestamp(),
        format.printf((msg) => {
          return `${msg.timestamp} [${msg.level}] - ${msg.message} `;
        }),
      ),

      transports: [
        new transports.Console({ level: 'warn' }),

        new transports.File({
          dirname: path.join(__dirname, '..', '..', '/log/'),
          filename: 'error.log',
          level: 'error',
        }),

        new transports.Console({ level: 'debug' }),
        new transports.File({
          dirname: path.join(__dirname, '..', '..', '/log/'),
          filename: 'debug.log',
          level: 'debug',
        }),
      ],
    };
  }

  public console(): object {
    return this.options;
  }
}
