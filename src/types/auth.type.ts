export interface ISendOtp {
  email: string | null;
}

export interface IVerifyOtp {
  email: string | null;
  verificationCode: string;
}

export interface ILogin {
  email: string;
  password: string;
}