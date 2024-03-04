import { ExecutionContext, HttpException } from '@nestjs/common';
import { CurrentUserInterceptor } from '../currentuser.interceptor';
import { Repository } from 'typeorm';
import { User } from '../../Entity/User';
import { JwtService } from '@nestjs/jwt';
import { of } from 'rxjs';
import { currentUserObj } from '../../notification/__tests__/data';
interface CustomExecutionContext extends ExecutionContext {
  getRequest(): any;
}
const userRepoMock = {
  findOne: jest.fn().mockResolvedValue(undefined),
} as unknown as Repository<User>;

// Mock the JwtService

const jwtServiceMock = {
  decode: jest.fn(),
  sign: jest.fn(),
  verify: jest.fn(),
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
} as unknown as JwtService;

// Set up the interceptor with the mock JwtService
const interceptor = new CurrentUserInterceptor(userRepoMock, jwtServiceMock);
let user = currentUserObj;
describe('CurrentUserInterceptor', () => {
  let context: CustomExecutionContext;

  beforeEach(() => {
    // Create a mock request object
    const request = {
      headers: {
        'x-access-token': 'some-access-token',
      },
    };

    // Create a mock ExecutionContext object with a mock getRequest method
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(request),
    } as unknown as CustomExecutionContext;
  });
  const next = { handle: jest.fn().mockReturnValue(of('data')) };

  it('should not set request currentUser if no access token is provided', async () => {
    // Create a mock ExecutionContext object with a mock getRequest method
    const request = {
      headers: {},
    };
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(request),
    } as unknown as CustomExecutionContext;

    const next = { handle: jest.fn().mockReturnValue(of('data')) };

    const result = await interceptor.intercept(context, next);
    expect(await result.toPromise()).toEqual('data');
    expect(context.getRequest().currentUser).toBeUndefined();
    expect(context.getRequest().currentUserId).toBeUndefined();
  });

  it('should throw HttpException if access token is provided but user is not found', async () => {
    // Set up the mock return values for the JwtService and UserRepository
    jwtServiceMock.decode = jest.fn().mockReturnValue({ id: 1 });
    (userRepoMock.findOne as jest.Mock).mockReturnValue(undefined);

    // Call the interceptor and expect it to throw an HttpException
    await expect(
      interceptor.intercept(context, { handle: () => of('data') }),
    ).rejects.toThrow(new HttpException('Unauthorized access', 399));
  });
  it('should set currentUser and currentUserId on the request object if user is found', async () => {
    // Set up the mock return values for the JwtService and UserRepository
    jwtServiceMock.decode = jest.fn().mockReturnValue({ id: 1 });
    (userRepoMock.findOne as jest.Mock).mockReturnValue(user);
    const result = await interceptor.intercept(context, next);
    expect(context.getRequest().currentUser).toEqual(user);
    expect(context.getRequest().currentUserId).toEqual(user.user_id);
    expect(result).toBeDefined();
    expect(await result.toPromise()).toEqual('data');
    expect(next.handle).toHaveBeenCalledTimes(1);
  });
});
