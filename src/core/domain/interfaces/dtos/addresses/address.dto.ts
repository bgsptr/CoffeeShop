export interface AddressData {
  country: string;
  district: string;
  fullAddress: string;
  postalCode: string;
  province: string;
  regency: string;
  street: string;
  village: string;
}

export class AddressDto {
  constructor(
    public label: string,
    public addressData: AddressData,
    public lat: string,
    public lng: string,
    public distance: number,
    public estimatedTime: number,
  ) {}
}
