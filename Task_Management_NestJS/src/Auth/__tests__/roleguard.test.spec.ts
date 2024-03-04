import { ExecutionContext, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let jwtService: JwtService;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    jwtService = {
      decode: jest.fn(),
    } as unknown as JwtService;

    rolesGuard = new RolesGuard(reflector, jwtService);
  });

  describe('canActivate', () => {
    it('should return true if no required roles', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
      } as unknown as ExecutionContext;

      const result = rolesGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw an HttpException if the user does not have the required role', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { 'x-access-token': 'test-token' } }),
      } as unknown as ExecutionContext;

      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(['admin']);
      (jwtService.decode as jest.Mock).mockReturnValueOnce({ role: 'user' });

      expect(() => rolesGuard.canActivate(context)).toThrow(HttpException);
    });

    it('should return true if the user has the required role', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { 'x-access-token': 'test-token' } }),
      } as unknown as ExecutionContext;

      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(['admin']);
      (jwtService.decode as jest.Mock).mockReturnValueOnce({ role: 'admin' });

      const result = rolesGuard.canActivate(context);
      expect(result).toBe(true);
    });
  });
});
