export interface PaymentDetail {
  venueTitle: string;
  taxIdentificationNumber: string;
  bankAccountNumber: string;
  bankName: string;
  qrCodeUrl: string;
}
export interface GetPaymentDetailResponse {
  id: number;
  venueTitle: string;
  taxIdentificationNumber: string;
  bankAccountNumber: string;
  bankName: string;
  qrcodeUrl: string;
}
