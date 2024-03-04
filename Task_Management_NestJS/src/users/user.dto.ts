import { Matches } from 'class-validator';
let password_regex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
);
export class UserCreateDto {
  user_name: string;
  @Matches(
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    {
      message: 'valid email',
      context: {
        errorCode: 101,
      },
    },
  )
  email: string;
  role: number;
}
export class UserEditCreateDto {
  user_name: string;
  @Matches(
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    {
      message: 'valid email',
      context: {
        errorCode: 101,
      },
    },
  )
  email: string;
  role: number;
}
export class AdminuserCreateDto {
  user_name: string;
  @Matches(
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    {
      message: 'valid email',
      context: {
        errorCode: 101,
      },
    },
  )
  email: string;
  @Matches(password_regex)
  password: string;
}

export class ChangePasswordDto {
  old_password: string;
  new_password: string;
}

export class UserProfile {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_no: string;
}
