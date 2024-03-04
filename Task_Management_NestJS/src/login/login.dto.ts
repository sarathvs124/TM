export class LoginDto {
  email: string;
  password: string;
}

export class ValidateEmailDto {
  email: string;
}

export class PasswordDto {
  newPassword: string;
}

export class RefreshTokenDto {
  refresh_token: any;
}
