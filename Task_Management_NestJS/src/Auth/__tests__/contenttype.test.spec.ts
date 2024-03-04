import { ContentTypeCheckerMiddleware } from '../contenttype_checker.middleware';
import { Request, Response } from 'express';
describe('ContentTypeCheckerMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNextFunction = jest.fn();
  });

  it('should set Cache-Control header and call next function if content-type is application/json', () => {
    mockRequest.headers = { 'content-type': 'application/json' };
    const middleware = new ContentTypeCheckerMiddleware();

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'no-cache, no-store, must-revalidate',
    );
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should send an error response if content-type is not application/json', () => {
    mockRequest.headers = { 'content-type': 'text/plain' };
    const middleware = new ContentTypeCheckerMiddleware();

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errorMessage: 'Content type should be json',
      statusCode: 400,
    });
  });
});
