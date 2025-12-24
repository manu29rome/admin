export class CountryCode {
  name?: string;
  dial_code?: string;
  code?: string;

  constructor(init?: Partial<CountryCode>) {
    Object.assign(this, init);
  }
}