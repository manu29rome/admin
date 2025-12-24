export class Company {
  idClient?: string;
  tatolUser?: number = 0;
  nameCompany?: string;
  nit?: string;
  addressCompany?:string;
  Status?: string = 'E03154DF-D0DB-4FEF-9570-F698761AF3C0';
  country?: string; 
  city?: string;
  dateCreate?: string;
  url?: string;
  domain?: string;
  createBy?: string;
  urlLogo?: string;
  idCustomizationClients?: string;
  urlImagen?: string;
  colors?: Colors;
  emailCompany?: EmailCompany;
  legalRepresentative?: LegalRepresentative;
  phoneNumberCompany?: number | null = null;
  codeContry?: string = '+57';
  phoneMovil?: number | null = null;
  departament?: string;
  codePostal?: number | null = null;
  Operation?: string;
  timeUpdatePasword?: number = 90;
  timeUpdateToken?: number = 24;
  validatePassword?: ValidatePassword;
  requestCode?: boolean = false;
  ipAuthorized?: IpsAuthorized;
  ipNotAuthorized?: IpsNotAuthorized;
  option?: number = 1;
  listAreas?: string[];

  constructor(init?: Partial<Company>) {
    if (init) {
      Object.assign(this, init);

      if (typeof init.colors === 'string') {
        const parsed = JSON.parse(init.colors);
        this.colors = new Colors(parsed[0]); 
      }

      if (typeof init.validatePassword === 'string') {
        const parsed = JSON.parse(init.validatePassword);
        this.validatePassword = new ValidatePassword(parsed[0]); 
      }

      if (typeof init.emailCompany === 'string') {
        const parsed = JSON.parse(init.emailCompany);
        this.emailCompany = new EmailCompany(parsed);
      }

      if (typeof init.legalRepresentative === 'string') {
        const parsed = JSON.parse(init.legalRepresentative);
        this.legalRepresentative = new LegalRepresentative(parsed[0]);
      }

      if (typeof init.ipAuthorized === 'string') {
        const parsed = JSON.parse(init.ipAuthorized);
        this.ipAuthorized = new IpsAuthorized(parsed);
      }

      if (typeof init.ipNotAuthorized === 'string') {
        const parsed = JSON.parse(init.ipNotAuthorized);
        this.ipNotAuthorized = new IpsNotAuthorized(parsed);
      }
    }
  }
}

export class Colors {
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  colorFour?: string;
  colorFive?: string;
  option?: number = 1;

  constructor(init?: Partial<Colors>) {
    Object.assign(this, init);
  }
}

export class ValidatePassword{
  validate1?: boolean = true;
  validate2?: boolean = true;
  validate3?: boolean = true;
  validate4?: boolean = true;
  validate5?: boolean = true;
  validate6?: boolean = true;
  validate7?: boolean = true;
  validate8?: boolean = false;
  minimumCharacters?: number= 8;
  maximumCharacters?: number= 12;
  listWord?: string[];

  constructor(init?: Partial<ValidatePassword>) {
    Object.assign(this, init);
  }
}


interface IpEntry {
  ip1: string;
  ip2: string;
}

export class IpsAuthorized{
  authorized?: boolean = false;
  ips?: IpEntry[];

  constructor(init?: Partial<IpsAuthorized>) {
    Object.assign(this, init);
     if (!this.ips) {
      this.ips = [];
    }
  }
}

export class IpsNotAuthorized{
  notAuthorized?: boolean = false;
  ips?: IpEntry[];

  constructor(init?: Partial<IpsNotAuthorized>) {
    Object.assign(this, init);
     if (!this.ips) {
      this.ips = [];
    }
  }
}

export class EmailCompany {
  email?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  clientTenant?: string;

  constructor(init?: Partial<EmailCompany>) {
    Object.assign(this, init);
  }
}

export class LegalRepresentative {
  nameLegalRepresentatives?: string;
  typeDocument?: string = 'C26ECBD8-CC98-414F-BF7F-0D1FF361FB36';
  documentNumber?: string;
  email?: string;
  codeContry?: string = '+57';
  numberMovil?: number | null = null;

  constructor(init?: Partial<LegalRepresentative>) {
    Object.assign(this, init);

  }
}


