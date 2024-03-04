import { JwtService } from '@nestjs/jwt';
import { AuthGuardMiddleware } from '../authguard.middleware';
describe('AuthGuardMiddleware', () => {
  let authGuard: AuthGuardMiddleware;
  let req: any;
  let res: any;
  let next: any;
  let jwtService = {
    decode: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  beforeEach(() => {
    req = { headers: {}, query: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
    jwtService = { verify: jest.fn() } as any;
    authGuard = new AuthGuardMiddleware(jwtService);
  });

  it('should call next when token is valid', () => {
    jwtService.verify = jest.fn().mockReturnValue({ purpose: 'ACCESS_TOKEN' });

    req.headers['x-access-token'] = 'valid-token';

    authGuard.use(req, res, next);

    expect(req.user).toEqual({ purpose: 'ACCESS_TOKEN' });
    expect(jwtService.verify).toHaveBeenCalledWith('valid-token', {
      secret: '123456789',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when token is not valid', () => {
    jwtService.verify = jest.fn().mockImplementationOnce(() => {
      throw new Error('jwt expired');
    });
    req.headers['x-access-token'] = 'invalid-token';

    authGuard.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      errorMessage: 'Token Has been Expired',
      statusCode: 403,
    });
    expect(jwtService.verify).toHaveBeenCalledWith('invalid-token', {
      secret: '123456789',
    });
    expect(next).not.toHaveBeenCalled();
  });
  it('should return 401 when no token is provided', () => {
    authGuard.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      errorMessage: 'A token is required for authentication',
      status: 401,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
