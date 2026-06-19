export interface AdminPersonal {
  id: number;
  fullName: string;
  phoneNumber: string;
  workAddress: string;
  email: string;
  password: string;
}

export interface AddPersonalRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface VerifyPersonalOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface ClaimVenueByLinkRequest {
  url: string;
}

export interface ClaimVenueByLinkResponse {
  success: boolean;
  venueId: number;
  message: string;
  httpStatus: string;
}
