import { Component } from '@angular/core';
import { Rol, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, AdminEntry, ChatStaticEntry, ChatDinamicEntry} from '../../models/rol.model'; 
import { DEFAULT_COLORS, BASE_URLS, DATA} from '../../config/constants';
import { RolService } from '../../core/rol.services/rol.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../core/login.services/auth.service';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';
import { CompanyService } from '../../core/company.services/company.service';
import { fromEventPattern } from 'rxjs';

@Component({
    selector: 'app-roles',
    imports: [
        CommonModule,
        FormsModule,
        ModalMessageComponent,
        NgSelectModule
    ],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.css'
})
export default class RolesComponent {

  public iconHistory: string = BASE_URLS.URL_FRONT.concat("/icon/default/history.png");
  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconUsers: string = BASE_URLS.URL_FRONT.concat("/icon/default/users.png");
  public iconUpdate: string = BASE_URLS.URL_FRONT.concat("/icon/default/update.png");
  public iconDelete: string = BASE_URLS.URL_FRONT.concat("/icon/default/delete.png");
  public iconVisible: string = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  public iconMigrate: string = BASE_URLS.URL_FRONT.concat("/icon/default/migrate.png");
  public iconSuccessful: string = BASE_URLS.URL_FRONT.concat("/icon/default/checkblack.png");
  public iconError: string = BASE_URLS.URL_FRONT.concat("/icon/default/error.png");
  public iconCancel: string = BASE_URLS.URL_FRONT.concat("/icon/default/cancel.png");
  public iconSave: string = BASE_URLS.URL_FRONT.concat("/icon/default/save.png");
  public iconEditWhite: string = BASE_URLS.URL_FRONT.concat("/icon/default/editWhite.png");
  public iconSaveBlack: string = BASE_URLS.URL_FRONT.concat("/icon/default/saveblack.png");
  public iconRol: string = BASE_URLS.URL_FRONT.concat("/icon/default/roles.png");

  dataAddUpdateRol: Rol = new Rol({
        monday: new Monday(),
        tuesday: new Tuesday(),
        wednesday: new Wednesday(),
        thursday: new Thursday(),
        friday: new Friday(),
        saturday: new Saturday(),
        sunday: new Sunday()
      });

  modulesStaticAdmin: AdminEntry[] = [];
  modulesStaticChat: ChatStaticEntry[] = [];
  modulesDynamicChat: ChatDinamicEntry[] = [];  

  isModalAddUpdate: boolean = false;
  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  isLogin: boolean = false;
  isModalView: boolean = false;
  responseSuccess: boolean = true;
  showResponseModal: boolean = false;
  isView: boolean = false;
  optionDelete: boolean = false;
  optionUpdate: boolean = false;
  optionAdd: boolean = false;
  optionMigrate: boolean = false;
  isLoadingBack: boolean = false;
  isMessageDelete: boolean = false;
  isModalOpen: boolean = false;
  submitted: boolean = false;
  selectAllChecked: boolean = false;
  isViewRol: boolean = false;
  isUpdateRol: boolean = false;
  isDeleteRol: boolean = false;
  isMigrate: boolean = false;
  isModalMigrate: boolean = false;
  isModalSchedule: boolean = false;
  isModalPermission: boolean = false;
  isModalGeneral: boolean = true;

  roles: Rol[] = [];
  typeStatus: any[] = [];
  filteredRoles: Rol[] = [];
  clientData: any = {};
  users: any[] = [];
  selectedUserIds: string[] = [];
  
  searchTerm: string = '';
  selectedStatus: string = '';
  sortOrder: string = '';
  title: string = ''
  messageButton: string = ''
  errorMessage: string = '';  
  colorOneMessage: string = '';
  colorTwoMessage: string = '';
  responseMessage: string = '';
  tittle: string = '';
  nameRol: string = '';
  nameRolSelect: string = '';
  messageOption: string = '';
  messageTittle: string = '';
  idDelete: string = '';
  nameAddUpdate: string = '';
  isIdRol: string = '';
  isIdRolMigrate: string = '';
  idRolMigrate: string = '';

  userTotal: number = 0;
  
  constructor(
    private rolservice: RolService,
    private authservice: AuthService,
    private companyservice: CompanyService) {}

  ngOnInit(): void {
      this.getRoles();
      this.getModules();
      this.colorDefaul();
      this.companyservice.GetAllTypeStatusDocument().subscribe(response => {
        if (response.success && response.data && response.data.length > 0) {
          const rawData = response.data[0];
          this.typeStatus = JSON.parse(rawData.typeStatus);
        }
      });
      this.getRolPermissions();
  }

  OpenModalGeneral(){
    this.isModalPermission= false;
    this.isModalSchedule = false;
    this.isModalGeneral = true;
  }

  OpenModalSchedule(){
    this.isModalPermission= false;
    this.isModalSchedule = true;
    this.isModalGeneral = false;
  }

  OpenModalPermission(){
    this.isModalPermission= true;
    this.isModalSchedule = false;
    this.isModalGeneral = false;
  }

  OpenModalMigrate(id: string, usersTotal: number = 0){

      if (!usersTotal || usersTotal=== 0) {
          this.tittle = 'Sin Usuarios';
          this.responseMessage = 'La compañia seleccionada no tiene usuarios.';
          this.responseSuccess = false;
          this.showResponseModal = true;
          return;
      }

      this.isModalMigrate = true;
      this.isIdRol = id;
    }

   ClosedModalMigrate(){
      this.isModalMigrate = false;
      this.isIdRol = '';
      this.isIdRolMigrate = '';
      this.selectedUserIds = [];
      this.isMigrate = false;
      this.users.forEach(user => user.selected = false);
    }

  MigrateUsersRol(){

      if (!this.isIdRolMigrate || this.isIdRolMigrate.trim() === '') {
          this.closeModalMessage();
          this.isLoadingBack = false;
          this.tittle = 'Error Datos';
          this.responseMessage = 'Por favor, seleccione un rol';
          this.responseSuccess = false;
          this.showResponseModal = true;
          return;
        }

        this.rolservice.MigrateUsersRol(this.isIdRol, this.isIdRolMigrate, this.selectAllChecked, this.selectedUserIds).subscribe({
        next: (res) => {
          console.log(res)
          if (res.success) {
            this.isLoadingBack = false;
            this.closeModalMessage();
            this.tittle = 'Éxito';
            this.responseMessage = res.data?.message || 'Operación exitosa';
            this.responseSuccess = true;
            this.closeModalView();
            this.ClosedModalMigrate();
          } else {
            this.isLoadingBack = false;
            this.closeModalMessage();
            this.tittle = 'Error';
            this.responseMessage = res.error?.message || 'Ocurrió un error';
            this.responseSuccess = false;
          }
          this.showResponseModal = true;
          },
          error: (err) => {
            this.isLoadingBack = false;
            this.closeModalMessage();
            this.tittle = err.error?.error?.title || 'Error';
            this.responseMessage = err.error?.error?.message || 'Error del servidor al guardar rl rol';
            this.responseSuccess = false;
            this.showResponseModal = true;
            console.error('❌ Error:', err);
          }
        });

    }

  async toggleUserSelection(userCheck: any) {
   
      if (!this.selectedUserIds.includes(userCheck.id)) 
        this.selectedUserIds.push(userCheck.id);
      else 
        this.selectedUserIds = this.selectedUserIds.filter(id => id !== userCheck.id);
        
      if(this.selectedUserIds.length == 0 && !this.selectAllChecked)
        this.isMigrate = false;

      if(this.selectedUserIds.length > 0)
        this.isMigrate = true;
    }

  getRolPermissions() {
    const storedModules = localStorage.getItem('appModules');

      if (storedModules) {
        try {
          const appModules = JSON.parse(storedModules);

          const rolModule = appModules.modules?.static?.find(
            (mod: any) => mod.name?.toLowerCase() === 'rol');

          if (rolModule) {
            const actions = rolModule.Actions || [];

            this.isViewRol = true; // Si existe el módulo, se puede ver
            this.isUpdateRol = actions.some((a: any) => a.name?.toLowerCase() === 'editar');
            this.isDeleteRol = actions.some((a: any) => a.name?.toLowerCase() === 'eliminar');
          }
        } catch (error) {
          console.error('Error al parsear appModules:', error);
        }
      }
  }

  toggleSelectAll(): void {
    const checked = this.selectAllChecked;
    this.filteredUsers().forEach((user) => (user.selected = checked));
  
    if(!this.selectAllChecked){
      this.selectedUserIds = [];
      this.isMigrate = false;
    }
    else{
      this.isMigrate = true;
    }
  }

  ValidateDataRol(): string | null {

    this.submitted = true;

    if((!this.dataAddUpdateRol?.name || this.dataAddUpdateRol?.name.trim() === '') ||
      (!this.dataAddUpdateRol?.name || this.dataAddUpdateRol?.name.trim() === '') ||
      (!this.dataAddUpdateRol?.name || this.dataAddUpdateRol?.name.trim() === ''))
      {
        this.OpenModalGeneral();
        return 'Por favor, ingresa los datos obligatorios';
      }
      

    if(this.dataAddUpdateRol.monday?.check)
    {
      const day = this.dataAddUpdateRol.monday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Lunes.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Lunes.';
    }

    if(this.dataAddUpdateRol.tuesday?.check)
    {
      const day = this.dataAddUpdateRol.tuesday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Martes.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Martes.';
    }

    if(this.dataAddUpdateRol.wednesday?.check)
    {
      const day = this.dataAddUpdateRol.wednesday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Miercoles.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Miercoles.';
    }

    if(this.dataAddUpdateRol.thursday?.check)
    {
      const day = this.dataAddUpdateRol.thursday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Jueves.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Jueves.';
    }

    if(this.dataAddUpdateRol.friday?.check)
    {
      const day = this.dataAddUpdateRol.friday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Viernes.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Viernes.';
    }

    if(this.dataAddUpdateRol.saturday?.check)
    {
      const day = this.dataAddUpdateRol.saturday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Sabado.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Sabado.';
    }

    if(this.dataAddUpdateRol.sunday?.check)
    {
      const day = this.dataAddUpdateRol.sunday;

      if (day.hourBefore == null || day.hourAfter == null || day.minutesBefore == null || day.minutesAfter == null)
        return 'Por favor, ingresa los datos obligatorios para el horario del día Domingo.';

        const start = parseInt(day.hourBefore as any) * 60 + parseInt(day.minutesBefore as any);
        const end = parseInt(day.hourAfter as any) * 60 + parseInt(day.minutesAfter as any);

      if (start >= end) 
        return 'La hora inicial no puede ser mayor o igual que la hora final para el día Domingo.';
    }

    return null; 
  }

  validateHourInput(event: any): void {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  value = value.replace(/[^0-9]/g, '');
  let numericValue = value ? parseInt(value, 10) : 0;

  if (numericValue > 23) numericValue = 23;
  if (numericValue < 0) numericValue = 0;

  input.value = numericValue.toString();
}

validateMinuteInput(event: any): void {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  value = value.replace(/[^0-9]/g, '');
  let numericValue = value ? parseInt(value, 10) : 0;

  if (numericValue > 59) numericValue = 59;
  if (numericValue < 0) numericValue = 0;

  input.value = numericValue.toString();
}

  deleteRol(id:string){
      this.rolservice.DeleteIdRol(id ?? '').subscribe({
        next: (res) => {
          console.log(res)
          if (res.success) {
            this.isLoadingBack = false;
            this.closeModalMessage();
            this.tittle = 'Éxito';
            this.responseMessage = res.data?.message || 'Operación exitosa';
            this.responseSuccess = true;
            this.isModalAddUpdate = false;
          } else {
            this.isLoadingBack = false;
            this.closeModalMessage();
            this.tittle = 'Error';
            this.responseMessage = res.error?.message || 'Ocurrió un error';
            this.responseSuccess = false;
          }
          this.showResponseModal = true;
          },
          error: (err) => {
            this.isLoadingBack = false;
            this.closeModalMessage();
            this.tittle = err.error?.error?.title || 'Error';
            this.responseMessage = err.error?.error?.message || 'Error del servidor al guardar el Rol';
            this.responseSuccess = false;
            this.showResponseModal = true;
            console.error('❌ Error:', err);
          }
        });
        this.idDelete = '';
    }

  closeModalMessage(){
      this.isMessageDelete = false;
    }

  messageAddUpdateCompany(isValid: boolean)
    {
      this.isLoadingBack = false;
      if(isValid){
        this.getRoles();

       
          if(this.isModalAddUpdate )
            this.OpenModalAddUpadte('update', this.dataAddUpdateRol.idRol ?? '', 1);
        
        
        this.showResponseModal = false;


      }
      else {
        this.showResponseModal = false
      }
    }

  openModal(action: string) {
      this.nameAddUpdate = action;
      this.isModalOpen = true;
    }

  async OpenModalMessage(option: string, id: string){

      if(option == 'add'){
        this.messageTittle = 'Agregar Rol'
        this.messageOption = '¿Esta seguro de guardar los datos de la rol?';
        this.optionDelete = false;
        this.optionUpdate = false;
        this.optionAdd = true;
        this.optionMigrate = false;
        this.idDelete = '';
      }
      if(option == 'update'){
        this.messageTittle = 'Actualizar Rol'
        this.messageOption = '¿Esta seguro de actualizar los datos de la rol?';
        this.optionDelete = false;
        this.optionUpdate = true;
        this.optionAdd = false;
        this.optionMigrate = false;
        this.idDelete = '';
      }
      if(option == 'delete'){
        this.messageTittle = 'Eliminar Rol'
        this.messageOption = '¿Esta seguro de eliminar La rol?';
        this.optionDelete = true;
        this.optionUpdate = false;
        this.optionAdd = false;
        this.optionMigrate = false;
        this.idDelete = id;
      }
      if(option == 'migrate'){
        this.messageTittle = 'Migrar Rol'
        this.messageOption = '¿Esta seguro de migrar los usuarios de rol?';
        this.optionDelete = false;
        this.optionUpdate = false;
        this.optionAdd = false;
        this.optionMigrate = true;
        this.idDelete = '';
      }


      this.isMessageDelete = !this.isMessageDelete;
    }

  ClosedModalAddUpadte(){ 
      this.isModalAddUpdate = false; 
      this.nameRolSelect = '';
      this.submitted = false;
    }

  async OpenModalAddUpadte(name: string, id:string, option: number){ 

        this.isModalAddUpdate = true;
        this.submitted = false;
        this.OpenModalGeneral();

        this.isView = option !== 1;
  
        this.dataAddUpdateRol = new Rol({
          monday: new Monday(),
          tuesday: new Tuesday(),
          wednesday: new Wednesday(),
          thursday: new Thursday(),
          friday: new Friday(),
          saturday: new Saturday(),
          sunday: new Sunday()
        });
  
        this.modulesStaticAdmin = [];
        this.modulesStaticChat = [];
        this.modulesDynamicChat = [];  
        
        if(name != 'Nuevo' && id != '')
        {
            this.rolservice.GetIdRol(id).subscribe({
            next: (res) => {
              if (res.success && res.data) {

                const raw = res.data;
                const parsedmonday= new Monday(JSON.parse(raw.monday));
                const parsedTuesday = new Tuesday(JSON.parse(raw.tuesday));
                const parsedWednesday = new Wednesday(JSON.parse(raw.wednesday));
                const parsedThursday = new Thursday(JSON.parse(raw.thursday));
                const parsedFriday = new Friday(JSON.parse(raw.friday));
                const parsedSaturday = new Saturday(JSON.parse(raw.saturday));
                const parsedSunday = new Sunday(JSON.parse(raw.sunday));

                try {
                  this.modulesDynamicChat = JSON.parse(raw.ChatDinamic) as ChatDinamicEntry[];
                } catch (error) {
                  this.modulesDynamicChat = [];
                }

                try {
                  this.modulesStaticChat = JSON.parse(raw.chatStatic) as ChatStaticEntry[];
                } catch (error) {
                  this.modulesStaticChat = [];
                }

                try {
                  this.modulesStaticAdmin = JSON.parse(raw.admin) as AdminEntry[];
                } catch (error) {
                  this.modulesStaticAdmin = [];
                }

                console.log(res.data)
                this.dataAddUpdateRol.name = raw.name;
                this.dataAddUpdateRol.detail = raw.detail;
                this.dataAddUpdateRol.idRol = raw.idRol;
                this.dataAddUpdateRol.status = raw.status?.toUpperCase().toString() ?? '';
                this.dataAddUpdateRol.checkAdmin = raw.checkAdmin;
                this.dataAddUpdateRol.checkChat = raw.checkChat;
                this.dataAddUpdateRol.totalUser = raw.totalUser;
                this.dataAddUpdateRol.monday = parsedmonday;
                this.dataAddUpdateRol.tuesday = parsedTuesday;
                this.dataAddUpdateRol.wednesday = parsedWednesday;
                this.dataAddUpdateRol.thursday = parsedThursday;
                this.dataAddUpdateRol.friday = parsedFriday;
                this.dataAddUpdateRol.saturday = parsedSaturday;
                this.dataAddUpdateRol.sunday = parsedSunday;
              }
  
              this.nameAddUpdate = this.dataAddUpdateRol.name ?? '';


            }
          });
        }
        else{
          this.nameAddUpdate = 'Nuevo'
          this.getModules();
          this.typeStatus
        }
        this.nameAddUpdate = name;
        this.isModalAddUpdate = true; 
    }

addUpdateRol(operation: string){

  this.isLoadingBack = true;

        const result = this.ValidateDataRol();
        if (result) {
          this.closeModalMessage();
          this.isLoadingBack = false;
          this.tittle = 'Datos Invalidos';
          this.responseMessage = result;
          this.responseSuccess = false;
          this.showResponseModal = true;
          return;
        }
      
    this.submitted = false;
    this.dataAddUpdateRol.ChatDinamic = this.modulesDynamicChat
    this.dataAddUpdateRol.chatStatic = this.modulesStaticChat
    this.dataAddUpdateRol.admin = this.modulesStaticAdmin
    this.dataAddUpdateRol.operation = operation
    
    this.rolservice.AddUpdateRol(this.dataAddUpdateRol).subscribe({
        next: (res) => {
          if (res.success) {
            this.closeModalMessage();
            //this.ClosedModalAddUpadte();
            this.getRoles();
            this.tittle = 'Éxito';
            this.responseMessage = res.data?.message || 'Operación exitosa';
            this.dataAddUpdateRol.idRol = res.data?.idRol;
            this.responseSuccess = true;
            this.nameAddUpdate = this.dataAddUpdateRol.name ?? '';
          } else {
            this.closeModalMessage();
            this.tittle = 'Error';
            this.responseMessage = res.error?.message || 'Ocurrió un error';
            this.responseSuccess = false;
          }
          this.showResponseModal = true;
          },
          error: (err) => {
            this.closeModalMessage();
            this.tittle = err.error?.error?.title || 'Error';
            this.responseMessage = err.error?.error?.message || 'Error del servidor al guardar el Rol';
            this.responseSuccess = false;
            this.showResponseModal = true;
          }
        });
  }

  getRoles(){
    this.rolservice.getAllRoles().subscribe(result => {
    this.roles = result.map((rol: Rol) => {
    if (rol.dateCreate) {
      const fecha = new Date(rol.dateCreate);
      rol.dateCreate = fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });}
        return rol;
      }); 
      this.filteredRoles = [...this.roles];
    });
  }

  getModules() {
  this.rolservice.getAllModules().subscribe(result => {
    console.log(result);

    if (result?.success && result.data?.length > 0) {
      const rawData = result.data[0];

      // Inicializar los módulos con permisos en false
      this.modulesStaticAdmin = JSON.parse(rawData.ModulesStaticAdmin).map((m: any) => ({
        moduleMenu: m.moduleMenu,
        module: m.name,
        view: false,
        update: false,
        delete: false
      }));

      this.modulesStaticChat = JSON.parse(rawData.ModulesStaticChat).map((m: any) => ({
        module: m.name,
        view: false,
        update: false,
        delete: false
      }));

      this.modulesDynamicChat = JSON.parse(rawData.ModulesDynamicChat).map((m: any) => ({
        module: m.name,
        view: false,
        update: false,
        delete: false
      }));
    }
  });
}

  colorDefaul(){
    this.validateToken();
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
    } 
  }

  async validateToken(){
    if(!await this.authservice.isTokenValid())
      this.MessageTokenInvalidate();
  }

  MessageTokenInvalidate(){
    this.title = 'Token Invalido';
    this.errorMessage = 'El token ha vencido. Por favor, inicie sesión nuevamente.';
    this.isModalVisible = true;  
    this.isSuccess = false; 
    this.messageButton = "Cerrar Sesion";
    this.colorOneMessage = this.clientData.ColorOne;
    this.colorTwoMessage = this.clientData.ColorThree;
    this.isLogin = true;
    return;
  }

  filterRoles() {
    let temp = [...this.roles];
  
    if (this.searchTerm.trim()) {
      temp = temp.filter(rol =>
        rol.name?.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
        (rol.detail && rol.detail.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
        (rol.createBy && rol.createBy.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ) ||
        (rol.apps && rol.apps.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) )
      ));
    }

    if (this.selectedStatus.trim()) {
      temp = temp.filter(rol => rol.status === this.selectedStatus);
    }

    if (this.sortOrder) {
      temp.sort((a, b) => {
        const fechaA = new Date(a.dateCreate!);
        const fechaB = new Date(b.dateCreate!);
        return this.sortOrder === 'asc'
          ? fechaA.getTime() - fechaB.getTime()
          : fechaB.getTime() - fechaA.getTime();
      });
    }
    this.filteredRoles = temp;
  }

  loadUsers(id: string, nameRol:string, usersTotal: number = 0) {

      if (!usersTotal || usersTotal === 0) {
          this.tittle = 'Sin Usuarios';
          this.responseMessage = 'El Rol seleccionada no tiene usuarios.';
          this.responseSuccess = false;
          this.showResponseModal = true;
          return;
      }

      this.userTotal = usersTotal;
      this.idRolMigrate = id;

      if(nameRol != '')
        this.nameRol = nameRol;
        
      this.isModalView  = !this.isModalView;
      if(this.isModalView ){
        this.companyservice.GetAllUsersFilters('', id).subscribe(response => {
          if (response.success) {
            this.users = response.data.map((user: any) => ({
              id: user.idUserAccount,
              fullName: user.primaryName,
              color: user.color,
              imageUrl: user.urlImagen,
              email: user.userName,
              rol: user.name ?? 'Sin definir'
            }));
            console.warn('Respuesta ', response);
          } else {
            console.warn('Respuesta no exitosa:', response);
            this.users = [];
          }
        });
      }
    }

    filteredUsers() {
  return this.users.filter(user => {
    const fullName = user.fullName ? user.fullName.toLowerCase() : '';
    const email = user.email ? user.email.toLowerCase() : '';
    const term = this.searchTerm.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });
}

    closeModalView() {
      this.isModalView  = false;
      this.searchTerm = '';
      this.users = [];
      this.selectedUserIds = [];
      this.isMigrate = false;
      this.selectAllChecked = false;
    }
}
