export class User {
  totalUsers?: number = 0;
  urlImagen?: string;
  numberDocument?: string;
  primaryName?: string;
  nameCompany?: string;
  userName?: string;
  rol?: string;
  status?: string = 'E03154DF-D0DB-4FEF-9570-F698761AF3C0';
  createdDate?: string;
  idUserAccount?: string;
  color?: string;
  area?: string;
  idClient?: string;
  idUser?: string;
  email?: string;
  numberPhone?: string; 
  code?: string;
  typeDocument?: string; 
  operation?: string; 
  departament?: string; 
  codePostal?: string; 
  address?: string;
  country?: string; 
  city?: string; 
  genre?: string; 
  dateOfBirth?: string; 
  userContact?: UserContact;

  constructor(init?: Partial<User>) {
      if (init) {
        Object.assign(this, init);
  
        if (typeof init.userContact === 'string') {
          const parsed = JSON.parse(init.userContact);
          this.userContact = new UserContact(parsed[0]);
        }
        
      }
    }
}

export class UserContact {
  fullname?: string; 
  code?: string; 
  numberPhone?: string;  
  kinship?: string; 

  constructor(init?: Partial<UserContact>) {
    Object.assign(this, init);
  }
}

export class UserSearch {
  idUserAccount?: string;
  primaryName?: string;
  numberDocument?: string;
}
