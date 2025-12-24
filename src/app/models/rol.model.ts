export class Rol {
    idRol?: string;
    name?: string;
    detail?: string;
    status?: string = 'E03154DF-D0DB-4FEF-9570-F698761AF3C0';
    totalUser?: number;
    dateCreate?: string;
    createBy?: string;
    operation?: string;
    apps?:string;
    monday?: Monday;
    tuesday?: Tuesday;
    wednesday?: Wednesday;
    thursday?: Thursday;
    friday?: Friday;
    saturday?: Saturday;
    sunday?: Sunday;
    checkAdmin?: boolean = false;
    checkChat?: boolean = false;
    admin?: AdminEntry[];
    chatStatic?: ChatStaticEntry[];
    ChatDinamic?: ChatDinamicEntry[];

     constructor(init?: Partial<Rol>) {
        if (init) {
          Object.assign(this, init);
          if (!this.admin) {this.admin = [];}
          if (!this.chatStatic) {this.chatStatic = [];}
          if (!this.ChatDinamic) {this.ChatDinamic = [];}
        }

        if (typeof init?.monday === 'string') {
          const parsed = JSON.parse(init.monday);
          this.monday = new Monday(parsed[0]); 
        }

        if (typeof init?.tuesday === 'string') {
          const parsed = JSON.parse(init.tuesday);
          this.tuesday = new Tuesday(parsed[0]); 
        }

        if (typeof init?.wednesday === 'string') {
          const parsed = JSON.parse(init.wednesday);
          this.wednesday = new Wednesday(parsed[0]); 
        }

        if (typeof init?.thursday === 'string') {
          const parsed = JSON.parse(init.thursday);
          this.thursday = new Thursday(parsed[0]); 
        }

        if (typeof init?.friday === 'string') {
          const parsed = JSON.parse(init.friday);
          this.friday = new Friday(parsed[0]); 
        }

        if (typeof init?.saturday === 'string') {
          const parsed = JSON.parse(init.saturday);
          this.saturday = new Saturday(parsed[0]); 
        }

        if (typeof init?.sunday === 'string') {
          const parsed = JSON.parse(init.sunday);
          this.sunday = new Sunday(parsed[0]); 
        }

      }
}

export class Monday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 18;
  minutesAfter?: number = 0;

  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export class Tuesday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 18;
  minutesAfter?: number = 0;

  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export class Wednesday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 18;
  minutesAfter?: number = 0;

  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export class Thursday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 18;
  minutesAfter?: number = 0;
  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export class Friday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 18;
  minutesAfter?: number = 0;

  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export class Saturday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 0;
  minutesAfter?: number = 18;

  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export class Sunday {
  idRoleScheduleConfiguration?: string;
  check?: boolean = false;
  hourBefore?: number = 7;
  minutesBefore?: number = 0;
  hourAfter?: number = 18;
  minutesAfter?: number = 0;

  constructor(init?: any) {
    if (init) {
      this.idRoleScheduleConfiguration = init.idRoleScheduleConfiguration;
      this.check = init.check;
      this.hourBefore = init.HourBefore ?? init.hourBefore;
      this.minutesBefore = init.MinutesBefore ?? init.minutesBefore;
      this.hourAfter = init.HourAfter ?? init.hourAfter;
      this.minutesAfter = init.MinutesAfter ?? init.minutesAfter;
    }
  }
}

export interface AdminEntry {
  module: string;
  moduleMenu: string;
  view: boolean;
  update: boolean;
  delete: boolean;
}

export interface ChatStaticEntry {
  module: string;
  view: boolean;
  update: boolean;
  delete: boolean;
}

export interface ChatDinamicEntry {
  module: string;
  view: boolean;
  update: boolean;
  delete: boolean;
}