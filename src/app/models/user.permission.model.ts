export class UserPermission {
    totalPermission?: number = 0;
    idUserPermission?: string; 
    idUserAccount?: string; 
    description?: string; 
    from?: string; 
    until?: string; 
    time?: string; 
    hoursOrDays?: string; 
    idStatus?: string | null;
    createdDate?: string; 
    modicatedDate?: string; 
    typePermission?: string; 
    operation?: string; 
    createBy?: string; 
    numberDocument?: string;
    primaryName?: string;
    orderNumber?: string;
    urlImagen?: string;
    files?: string;
    authorized?: string;
    selectedFiles?: { 
      name: string;
      url: string;
      type: string;
      idUserPermission: string;
      idUsersFilesPermission: string | null;
      fileExtension: string;
    }[];

    constructor(init?: Partial<UserPermission>) {
        if (init) {
          Object.assign(this, init);
        }
    }
}