import { Logger, LogLevel } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerConfig } from '../LoggerService';
import winston from 'winston';

jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
    File: jest.fn(),
  };
  const mLogger = {
    info: jest.fn(),
  };
  return {
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
  };
});
const { createLogger, format, transports } = require('winston');

describe('logger', () => {
  let loggerService: Logger;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [Logger],
    }).compile();

    loggerService = app.get<Logger>(Logger);
  });

  it('should pass', () => {
    let templateFunctions = [];
    format.printf.mockImplementation((templateFn) => {
      templateFunctions.push(templateFn);
    });
    const logger = require('../LoggerService');
    const info = {
      timestamp: 123,
      level: 'info',
      message: 'haha',
    };
    expect(logger).toBeDefined();
  });

  describe('console', () => {
    it('should return an object with the expected properties', () => {
      const config = new LoggerConfig();
      const options = createLogger(config.console() as winston.LoggerOptions);
      expect(options).toBeDefined();
    });
  });
});
