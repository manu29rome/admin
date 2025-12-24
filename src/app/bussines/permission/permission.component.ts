import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/login.services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { DEFAULT_COLORS, BASE_URLS, DATA } from '../../config/constants';
import { UserPermission } from '../../models/user.permission.model';
import { UserService } from '../../core/user.services/user.service';
import { ImageViewerComponent } from '../../shared/component/image-viewer/image-viewer.component';
import { CompanyService } from '../../core/company.services/company.service';
import { User, UserSearch } from '../../models/user.model';
import { ChatService } from '../../core/chat.services/chat.service';

@Component({
    selector: 'app-permission',
    imports: [
        NgSelectModule,
        ImageViewerComponent,
        CommonModule,
        FormsModule
    ],
    templateUrl: './permission.component.html',
    styleUrl: './permission.component.css'
})
export default class PermissionComponent {

  @ViewChild(ImageViewerComponent) imageViewer!: ImageViewerComponent;

  public iconCheck: string = BASE_URLS.URL_FRONT.concat("/icon/default/check.png");
  public iconClosed: string = BASE_URLS.URL_FRONT.concat("/icon/default/closed.png");
  public iconVisible: string = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  public iconPermission: string = BASE_URLS.URL_FRONT.concat("/icon/default/permission.png");
  public iconOrder: string = BASE_URLS.URL_FRONT.concat("/icon/default/order.png");
  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconImage: string = BASE_URLS.URL_FRONT.concat("/icon/default/image.png");
  public iconPDF: string = BASE_URLS.URL_FRONT.concat("/icon/default/pdf.png");
  public iconUser: string = BASE_URLS.URL_FRONT.concat("/icon/default/user.png");
  public iconFilter: string = BASE_URLS.URL_FRONT.concat("/icon/default/filter.png");
  public iconEditWhite: string = BASE_URLS.URL_FRONT.concat("/icon/default/editWhite.png");
  public iconSave: string = BASE_URLS.URL_FRONT.concat("/icon/default/save.png");
  public iconUpdate: string = BASE_URLS.URL_FRONT.concat("/icon/default/update.png");
  public iconDelete: string = BASE_URLS.URL_FRONT.concat("/icon/default/delete.png");
  public iconSaveBlack: string = BASE_URLS.URL_FRONT.concat("/icon/default/saveblack.png");
  public iconSuccessful: string = BASE_URLS.URL_FRONT.concat("/icon/default/checkblack.png");
  public iconError: string = BASE_URLS.URL_FRONT.concat("/icon/default/error.png");

  selectedFiles: { name: string; url: string; type: string; idUserPermission: string, idUsersFilesPermission: string | null }[] = [];
  statusLabels: { [key: string]: string } = {'1': 'Aprobado','2': 'Rechazado','3': 'Pendiente'};
  permission: UserPermission = new UserPermission();

  clientData: any = {};
  permissions: UserPermission [] = [];
  selectedTypePermission: string[] = [];
  selectedIds: string[] = [];
  types: any[] = [];
  typePermisssion: any[] = [];
  filteredUsers: UserSearch[] = [];
  info: any = {};
  userSearch: UserSearch = new UserSearch();

  order: boolean = true;
  isFilterType: boolean = false;
  isFilterStatus: boolean = false;
  showFilter: boolean = false;
  showDatePicker: boolean = false;
  dateError: boolean = false;
  isFilterDate: boolean = false;
  isFilterSearch: boolean = false;
  isModalAddUpdate : boolean = false;
  isModalFiles: boolean = false;
  isModalGeneral: boolean = true;
  optionDelete: boolean = false;
  optionUpdate: boolean = false;
  optionAdd: boolean = false;
  isMessageDelete: boolean = false;
  isLoadingBack: boolean = false;
  isView: boolean = false;
  responseSuccess: boolean = true;
  showResponseModal: boolean = false;
  isUpdate: boolean = false;
  isDelete: boolean = false;
  submitted: boolean = false;
  searchExecuted: boolean = false;

  searchText?: string | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  messageOption: string = '';
  messageTittle: string = '';
  idDelete: string = '';
  nameSelected: string = '';
  tittle: string = '';
  responseMessage: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalPermission: number = 0;
  option: number = 0;
  status?: number | null;

  constructor(
    private authservice: AuthService,
    private userservice: UserService,
    private chatservice: ChatService,
    private companyservice: CompanyService
  ) {  }

  ngOnInit(): void {
    this.getAllPermission();
    this.colorDefaul();
    this.status = null;
    this.companyservice.GetAllTypeStatusDocument().subscribe(response => {
        if (response.success && response.data && response.data.length > 0) {
          const rawData = response.data[0];
          this.typePermisssion = JSON.parse(rawData.typePermission);
        }
      });
    this.getPermissions();
  }

  ValidateData(): string | null {
    this.submitted = true;

    if ((!this.permission?.idUserAccount || this.permission?.idUserAccount .trim() === '') ||
      (!this.permission?.description || this.permission?.description.trim() === '') ||
      (!this.permission?.from || this.permission?.from.trim() === '') ||
      (!this.permission?.until || this.permission?.until.trim() === '') ||
      (!this.permission?.time) ||
      (!this.permission?.hoursOrDays || this.permission?.hoursOrDays.trim() === '')
      ) {
      this.OpenModalGeneral();
      return 'Por favor, ingresa los datos generales obligatorios';
    }

    if (new Date(this.permission.from) > new Date(this.permission.until)
    ) {
      this.OpenModalGeneral();
      return 'La fecha desde no puede ser mayor que la fecha hasta';
    }

    return null;

  }

  validateDates() {
    if (!this.permission?.from || !this.permission?.until) 
      return;

    const from = new Date(this.permission.from);
    const until = new Date(this.permission.until);

    const mismoDia =
      from.getFullYear() === until.getFullYear() &&
      from.getMonth() === until.getMonth() &&
      from.getDate() === until.getDate();

    if (mismoDia) {
      this.permission.hoursOrDays = 'Horas'
    } else {
      this.permission.hoursOrDays = 'Días'
    }
  }

   getPermissions() {
    const storedModules = localStorage.getItem('appModules');

    if (storedModules) {
      try {
        const appModules = JSON.parse(storedModules);

        const Module = appModules.modules?.static?.find(
          (mod: any) => mod.name?.toLowerCase() === 'permiso');

        if (Module) {
          const actions = Module.Actions || [];

          this.isView = true; // Si existe el módulo, se puede ver
          this.isUpdate = actions.some((a: any) => a.name?.toLowerCase() === 'editar');
          this.isDelete = actions.some((a: any) => a.name?.toLowerCase() === 'eliminar');
        }
      } catch (error) {
        console.error('Error al parsear appModules:', error);
      }
    }
  }

   removeFile(index: number, id: string) {
    this.userservice.AddOrDeletFile(
      this.permission.idUserPermission ?? '',
      id, // idFile
      null,
      null,
      null,
      true
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedFiles.splice(index, 1);
          this.getAllPermission();
        }
      },
      error: (err) => {
        this.tittle = 'Error Archivo';
        this.responseMessage = 'Error al guardar archivo';
        this.responseSuccess = false;
        this.showResponseModal = true;
      }
    });

  }

  async onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    const newFiles = Array.from(files);

    const validFiles = newFiles.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5 MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== newFiles.length) {
      this.tittle = 'Restricciones de archivos';
      this.responseMessage = 'Solo se permiten archivos PDF, JPG o PNG de máximo 5 MB cada uno.';
      this.responseSuccess = false;
      this.showResponseModal = true;
    }

    const existingCount = this.selectedFiles?.length || 0;

    if (existingCount + validFiles.length > 5) {
      this.tittle = 'Límite de archivos alcanzado';
      this.responseMessage = 'Solo puedes subir hasta 5 archivos en total.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    for (const file of validFiles) {
      try {
        const base64File = await this.convertFileToBase64(file);
        const fileResponse = await this.chatservice
          .fileBase(base64File, 'users/file', 'usuario')
          .toPromise();

        if (fileResponse.success) {
          const urlfile: string = fileResponse.data;

          this.userservice.AddOrDeletFile(
            this.permission.idUserPermission ?? '',
            null, // idFile
            urlfile,
            file.name,
            file.type,
            true
          ).subscribe({
            next: (res) => {
              if (res.success && res.data) {
                if (!this.selectedFiles) {
                  this.selectedFiles = [];
                }
                this.selectedFiles.push({
                  name: file.name,
                  type: file.type,
                  url: urlfile,
                  idUserPermission: this.permission.idUserPermission ?? '',
                  idUsersFilesPermission: res.data.idFile,
                });
                this.getAllPermission();
              }
            },
            error: (err) => {
              this.tittle = 'Error Archivo';
              this.responseMessage = 'Error al guardar archivo';
              this.responseSuccess = false;
              this.showResponseModal = true;
            }
          });
        }
      } catch (error) {
        this.tittle = 'Error Archivo';
        this.responseMessage = 'Error al subir archivo';
        this.responseSuccess = false;
        this.showResponseModal = true;
      }
    }

    event.target.value = ''; // limpiar input
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  DeletePermission(id: string) {
    this.userservice.DeleteIdPermission(id ?? '').subscribe({
      next: (res) => {
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
        this.responseMessage = err.error?.error?.message || 'Error del servidor al eliminar el usuario';
        this.responseSuccess = false;
        this.showResponseModal = true;
        console.error('❌ Error:', err);
      }
    });
    this.idDelete = '';

  }

   messageAddUpdate(isValid: boolean) {
    this.isLoadingBack = false;
    if (isValid) {
      this.getAllPermission();
      this.showResponseModal = false;
    }
    else {
      this.showResponseModal = false
    }
  }

  async AddUpdatePermission(operation: string){
    this.isLoadingBack = true;
    this.permission.operation = operation;
    this.permission.idUserAccount = this.userSearch.idUserAccount;

    const result = this.ValidateData();
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

    console.log("pasa")

    this.userservice.AddOrUpdateUserPermission(this.permission).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeModalMessage();
          this.tittle = 'Éxito';
          this.responseMessage = res.data?.message || 'Operación exitosa';
          this.responseSuccess = true;
          this.permission.idUserPermission = res.data?.idUserPermission;
          this.isLoadingBack = false;
          this.option = 0;
        } else {
          this.closeModalMessage();
          this.tittle = 'Error';
          this.responseMessage = res.error?.message || 'Ocurrió un error';
          this.responseSuccess = false;
          this.isLoadingBack = false;
        }
        this.showResponseModal = true;
      },
      error: (err) => {
        this.closeModalMessage();
        this.tittle = err.error?.error?.title || 'Error';
        this.responseMessage = err.error?.error?.message || 'Error del servidor al guardar la compañía';
        this.responseSuccess = false;
        this.showResponseModal = true;
        this.isLoadingBack = false;
      }
    });

  }

  validarSoloNumeros(event: any): void {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');

    if (valor.length > 3) {
      valor = valor.slice(0, 3);
    }
    valor = valor.replace(/^0+(?!$)/, '');

    event.target.value = valor;
    this.permission.time = valor;
  }

  closeModalMessage() {
    this.isMessageDelete = false;
  }

  async OpenModalMessage(option: string, id: string) {

    if (option == 'add') {
      this.messageTittle = 'Agregar Permiso'
      this.messageOption = '¿Esta seguro de guardar los datos de la permiso?';
      this.optionDelete = false;
      this.optionUpdate = false;
      this.optionAdd = true;
      this.idDelete = '';
    }
    if (option == 'update') {
      this.messageTittle = 'Actualizar Permiso'
      this.messageOption = '¿Esta seguro de actualizar los datos de la permiso?';
      this.optionDelete = false;
      this.optionUpdate = true;
      this.optionAdd = false;
      this.idDelete = '';
    }
    if (option == 'delete') {
      this.messageTittle = 'Eliminar Permiso'
      this.messageOption = '¿Esta seguro de eliminar La permiso?';
      this.optionDelete = true;
      this.optionUpdate = false;
      this.optionAdd = false;
      this.idDelete = id;
    }

    this.isMessageDelete = !this.isMessageDelete;
  }

  OpenModalFiles() {
    this.isModalFiles = true;
    this.isModalGeneral = false;
  }

  OpenModalGeneral() {
    this.isModalFiles = false;
    this.isModalGeneral = true;
  }

  permissionInfo() {
    this.userservice.getInfoPermission().subscribe({
      next: (infoData) => {
        if (infoData?.data?.length > 0) {
          this.info = infoData.data[0]; // Extrae el único objeto del array
          console.log('info:', this.info);
        } else {
          this.info = {};
          console.warn('No se encontró información de usuarios.');
        }
      },
      error: (error) => {
        console.error('Error al obtener la info de usuarios:', error);
        this.info = {};
      }
    });
  }

  updateStatusPermissionUser(status: number, id: string) {
  this.userservice.UpdateStatusPermisssionUser(status, id).subscribe(response => {
    if (response.success) {

      const user = this.permissions.find(u => u.idUserPermission === id);
      if (user) {
        user.idStatus = status.toString();
        user.authorized = this.clientData.NameUser;
        this.permissionInfo();
      }
    }
  });
}
  onSearchUser(term: string): void {
    this.searchExecuted = true;
    if (!term.trim()) {
      this.filteredUsers = [];
      return;
    }

    this.userservice.GetAllUsers([], [], [], term, 1, 5, null, null,true 
    ).subscribe(result => {
      this.filteredUsers = result.data
        .map((user: any) => {
          return {
            idUserAccount: user.idUserAccount,
            primaryName: user.primaryName,
            numberDocument: user.numberDocument,
          } as UserSearch;
        })
        .slice(0, 5); 
    });
  }

  ClosedModalAddUpadte() {
    this.submitted = false;
    this.isModalAddUpdate = false;
  }

  OpenModalAddUpadte(name: string, id: string, option: number){
    this.isModalAddUpdate = true;
    this.OpenModalGeneral();
    this.selectedFiles = [];
    this.submitted = false;
    this.searchExecuted = false;
    
    this.userSearch = new UserSearch();;
    this.permission = new UserPermission();
    if (name != 'Nuevo' && id != '') {
      this.userservice.GetIdPermission(id ?? '').subscribe({
              next: (res) => {
                if (res.success && res.data) {
                  console.log(res.data)
                  const raw = res.data;
                  this.permission.idUserAccount = raw.idUserAccount;
                  this.permission.typePermission = raw.typePermission?.toUpperCase().toString() ?? '';
                  this.permission.from = raw.from ?? '';
                  this.permission.until = raw.until ?? '';
                  this.permission.time = raw.time;
                  this.permission.hoursOrDays = raw.hoursOrDays;
                  this.permission.description = raw.description;
                  this.permission.orderNumber = raw.orderNumber;
                  this.userSearch.idUserAccount = raw.idUserAccount;
                  this.userSearch.numberDocument = raw.numberDocument;
                  this.userSearch.primaryName = raw.primaryName;
                  this.permission.idUserPermission = id;
                  this.permission.idStatus = raw.idStatus;

                  try {
                    this.selectedFiles = JSON.parse(raw.files);
                  } catch (e) {
                    console.error('Error al parsear archivos:', e);
                    this.selectedFiles = [];
                  }
      
                }
                this.option = 0;
                  this.nameSelected = 'Ver Permiso #'+this.permission.orderNumber;
              }
            });
    }
    else {
      this.permission.typePermission = '003DB409-E574-4D19-BFF9-C40D4D7AF86D';
      this.nameSelected = 'Agregar Permiso';
      this.option = 1;
    }
    this.isModalAddUpdate = true;
  }

  selectUser(user: UserSearch) {
    this.userSearch.idUserAccount = user.idUserAccount;
    this.userSearch.primaryName = user.primaryName;
    this.userSearch.numberDocument = user.numberDocument;
    this.permission.idUserAccount = user.idUserAccount;
    this.searchExecuted = false;
    this.filteredUsers = []; 
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.permissions.slice(start, start + this.pageSize);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;

    if (total <= 3) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (this.currentPage === 1) pages.push(1, 2, 3);
      else if (this.currentPage === total) pages.push(total - 2, total - 1, total);
      else pages.push(this.currentPage - 1, this.currentPage, this.currentPage + 1);
    }

    return pages.filter(p => p > 0 && p <= total); // Evita valores fuera de rango
  }

  get totalPages(): number {
    return Math.ceil(this.totalPermission / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageNumber = page; // si usas pageNumber para la consulta
      this.getAllPermission(); // recarga datos
    }
  }

  clickPage() {
    this.pageNumber = 1;
    this.getAllPermission();
  }

  async clearFilterType() {
    this.selectedIds = [];
    this.isFilterType = false;
    this.getAllPermission();
  }

  async clearFilterStatus() {
    this.status = null;
    this.isFilterStatus = false;
    this.getAllPermission();
  }

  async clearFilterDate() {
    this.dateStart = null;
    this.dateEnd = null;
    this.isFilterDate = false;
    this.getAllPermission();
  }

  filterStatus(){
    this.pageNumber = 1;
    this.currentPage = 1;
    if(this.status == null){
      this.status = null;
      this.isFilterStatus = false;
    } 
    else
    {
      this.isFilterStatus = true;
    }
      this.getAllPermission();
  }

  async filterPermission() {
    this.isFilterType = this.selectedIds.length > 0;
    this.isFilterDate = !!this.dateStart || !!this.dateEnd;
    this.isFilterSearch = !!this.searchText;
    this.status = null;

    this.pageNumber = 1;
    this.currentPage = 1;
    this.totalPermission = 0;
    this.getAllPermission();
    this.closeFilter();
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.selectedIds.includes(value)) {
        this.selectedIds.push(value);
      }
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== value);
    }
    console.log(this.selectedIds)
  }

  OpenFilterDate() {
    this.showDatePicker = true;
  }

  async clearFilterSearch() {
    this.searchText = null;
    this.isFilterSearch = false;
    this.getAllPermission();
  }

  async clearFilter() {
    this.isFilterType = false;
    this.isFilterStatus = false;
    this.isFilterStatus = false;
    this.isFilterDate = false;
    this.isFilterSearch = false;

    this.selectedIds = [];
    this.searchText = null;
    this.dateStart = null;
    this.dateEnd = null;
    this.status = null;
    this.getAllPermission();
  }

  applyDateRange() {
    if (!this.dateError && this.dateStart && this.dateEnd) {
      console.log('Aplicado:', this.dateStart, this.dateEnd);
      this.showDatePicker = false;
    }
  }

  OpenFilterType() {
    this.showFilter = true;
    this.isFilterType = false;
    //this.selectedIds = [];
  }

  closeFilter() {
    this.showFilter = false;
    this.showDatePicker = false;
    this.isFilterType = !!(this.selectedIds && this.selectedIds.length > 0);
  }

  resetDates() {
    this.dateStart = null;
    this.dateEnd = null;
    this.dateError = false;
  }

  validateDateRange() {
    console.log("Fecha Inicial:", this.dateStart);
    console.log("Fecha Final:", this.dateEnd);
    if (this.dateStart && this.dateEnd) {
      const start = new Date(this.dateStart);
      const end = new Date(this.dateEnd);
      const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      this.dateError = diffInDays > 30;
    } else {
      this.dateError = false;
    }
  }

  colorDefaul() {
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
    }
  }

  async orderUsers() {
    this.order = !this.order;
    this.getAllPermission();
  }

  getAllPermission() {
    this.permissionInfo();
  this.userservice.GetAllPermissionUsers(
    this.selectedIds,
    this.status!,
    this.searchText!,
    this.pageNumber,
    this.pageSize,
    this.dateStart!,
    this.dateEnd!,
    this.order
  ).subscribe(result => {
    this.permissions = result.data.map((permission: UserPermission) => {

      const formatDate = (dateValue: any): string | undefined => {
        if (!dateValue) return undefined;
        try {
          const fecha = new Date(dateValue);
          if (isNaN(fecha.getTime())) return undefined;
          return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        } catch {
          return undefined;
        }
      };

      permission.createdDate = formatDate(permission.createdDate);
      permission.from = formatDate(permission.from);
      permission.until = formatDate(permission.until);

      let files: any[] = [];
      if (permission.files) {
        try {
          const raw = permission.files.trim();
          if (raw.startsWith('[{')) {
            files = JSON.parse(raw);
          } else {
            files = JSON.parse(JSON.parse(raw));
          }
        } catch (error) {
          console.error('Error parseando files:', error, permission.files);
        }
      }

      permission.selectedFiles = files.map(f => ({
        ...f,
        fileExtension: f.type?.split('/')[1] ?? ''
      }));

      this.totalPermission = permission.totalPermission ?? 0;
      return permission;
    });

  });
}


  openFile(file: { name: string; url: string; type: string; idUserPermission: string, idUsersFilesPermission: string | null}) {
    if (file.type.includes('pdf')) {
      window.open(file.url, '_blank');
    }
    if ( file.type.includes('image'))
    this.imageViewer.openViewer(file.url);
  }

  // users.component.ts
convertToRgba(hex: string, alpha: number): string {
  // Elimina el "#" si existe
  hex = hex.replace(/^#/, '');

  // Convierte valores cortos (#abc) a formato largo (#aabbcc)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

  

}
