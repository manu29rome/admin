import { Component, ViewChild } from '@angular/core';
import { User, UserContact } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/login.services/auth.service';
import { UserService } from '../../core/user.services/user.service';
import { DEFAULT_COLORS, BASE_URLS, DATA } from '../../config/constants';
import { CompanyService } from '../../core/company.services/company.service';
import { Country, State, City } from 'country-state-city';
import { CountryCode } from '../../models/contry.model';
import { UtilService } from '../../core/util.services/util.service';
import { ChatService } from '../../core/chat.services/chat.service';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageViewerComponent } from '../../shared/component/image-viewer/image-viewer.component';


@Component({
    selector: 'app-users',
    imports: [
        CommonModule,
        FormsModule,
        ImageViewerComponent,
        NgSelectModule
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})

export default class UsersComponent {

  @ViewChild(ImageViewerComponent) imageViewer!: ImageViewerComponent;

  countries: ReturnType<typeof Country.getAllCountries> = [];
  states: ReturnType<typeof State.getStatesOfCountry> = [];
  cities: ReturnType<typeof City.getCitiesOfState> = [];

  public iconUpdate: string = BASE_URLS.URL_FRONT.concat("/icon/default/update.png");
  public iconDelete: string = BASE_URLS.URL_FRONT.concat("/icon/default/delete.png");
  public iconVisible: string = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconSearch: string = BASE_URLS.URL_FRONT.concat("/icon/default/search.png");
  public iconFilter: string = BASE_URLS.URL_FRONT.concat("/icon/default/filter.png");
  public iconCalendary: string = BASE_URLS.URL_FRONT.concat("/icon/default/calendary.png");
  public iconStatus: string = BASE_URLS.URL_FRONT.concat("/icon/default/status.png");
  public iconClear: string = BASE_URLS.URL_FRONT.concat("/icon/default/clear.png");
  public iconRol: string = BASE_URLS.URL_FRONT.concat("/icon/default/roles.png");
  public iconCompany: string = BASE_URLS.URL_FRONT.concat("/icon/default/companies.png");
  public iconOrder: string = BASE_URLS.URL_FRONT.concat("/icon/default/order.png");
  public iconUser: string = BASE_URLS.URL_FRONT.concat("/icon/default/user.png");
  public iconCancel: string = BASE_URLS.URL_FRONT.concat("/icon/default/cancel.png");
  public iconSave: string = BASE_URLS.URL_FRONT.concat("/icon/default/save.png");
  public iconUsers: string = BASE_URLS.URL_FRONT.concat("/icon/default/users.png");
  public iconEditWhite: string = BASE_URLS.URL_FRONT.concat("/icon/default/editWhite.png");
  public iconSaveBlack: string = BASE_URLS.URL_FRONT.concat("/icon/default/saveblack.png");
  public iconSuccessful: string = BASE_URLS.URL_FRONT.concat("/icon/default/checkblack.png");
  public iconError: string = BASE_URLS.URL_FRONT.concat("/icon/default/error.png");
  public iconImage: string = BASE_URLS.URL_FRONT.concat("/icon/default/image.png");
  public iconPDF: string = BASE_URLS.URL_FRONT.concat("/icon/default/pdf.png");
  public iconPassword: string = BASE_URLS.URL_FRONT.concat("/icon/default/password.png");
  public iconHistory: string = BASE_URLS.URL_FRONT.concat("/icon/default/history.png");

  dataAddUpdateUser: User = new User({ userContact: new UserContact() });
  selectedFiles: { name: string; url: string; type: string; idUserAccount: string, idUsersFiles: string | null }[] = [];

  user: User = new User();
  clientData: any = {};
  userInfo: any = {};
  users: User[] = [];
  typeStatus: any[] = [];
  typeRoles: any[] = [];
  typeDocuments: any[] = [];
  typeCompany: any[] = [];
  selectedStatusIds: string[] = [];
  selectedClientsIds: string[] = [];
  selectedRolesIds: string[] = [];
  countriesCode: CountryCode[] = [];
  typeArea: any[] = [];
  filteredCountries: any[] = [];
  filteredStates: any[] = [];
  filteredCities: any[] = [];

  isModalVisible: boolean = false;
  isSuccess: boolean = false;
  isLogin: boolean = false;
  showFilterStatus: boolean = false;
  showFilterRol: boolean = false;
  showFilterCompany: boolean = false;
  showDatePicker: boolean = false;
  dateError: boolean = false;
  order: boolean = true;
  isModalAddUpdate: boolean = false;
  isModalPersonal: boolean = false;
  isModalContact: boolean = false;
  isModalFiles: boolean = false;
  isModalGeneral: boolean = true;
  image: boolean = false;
  isFilterRol: boolean = false;
  isFilterCompany: boolean = false;
  isFilterStatus: boolean = false;
  isFilterDate: boolean = false;
  isFilterSearch: boolean = false;
  isLoadingBack: boolean = false;
  optionDelete: boolean = false;
  optionUpdate: boolean = false;
  optionAdd: boolean = false;
  isMessageDelete: boolean = false;
  responseSuccess: boolean = true;
  showResponseModal: boolean = false;
  isView: boolean = false;
  submitted: boolean = false;
  isViewUser: boolean = false;
  isUpdateUser: boolean = false;
  isDeleteUser: boolean = false;

  title: string = '';
  idDelete: string = '';
  errorMessage: string = '';
  messageButton: string = '';
  colorOneMessage: string = '';
  colorTwoMessage: string = '';
  nameAddUpdate: string = '';
  searchText?: string | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  selectedCountryCode: string = '';
  countryInput: string = '';
  stateInput: string = '';
  cityInput: string = '';
  selectedStatesCode: string = '';
  selectedCityCode: string = '';
  selectedImage: string | null = null;
  messageOption: string = '';
  messageTittle: string = '';
  tittle: string = '';
  responseMessage: string = '';
  nameUserSelected: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalUsers: number = 0;
  option: number = 0;

  constructor(
    private authservice: AuthService,
    private userservice: UserService,
    private chatservice: ChatService,
    private companyservice: CompanyService,
    private utilservice: UtilService) { }

  ngOnInit(): void {
    this.colorDefaul();
    this.getAllUsers();
    this.utilservice.getCountries().subscribe((data) => {
      this.countriesCode = data;
      this.countries = Country.getAllCountries();
    });
    this.companyservice.GetAllTypeStatusDocument().subscribe(response => {
      if (response.success && response.data && response.data.length > 0) {
        const rawData = response.data[0];
        this.typeStatus = JSON.parse(rawData.typeStatus);
        this.typeRoles = JSON.parse(rawData.typeRoles);
        this.typeCompany = JSON.parse(rawData.typeCompany);
        this.typeDocuments = JSON.parse(`[${rawData.typeDocuments}]`);
      }
    });
    this.getUserPermissions();
  }

  getUserPermissions() {
    const storedModules = localStorage.getItem('appModules');

    if (storedModules) {
      try {
        const appModules = JSON.parse(storedModules);

        const Module = appModules.modules?.static?.find(
          (mod: any) => mod.name?.toLowerCase() === 'usuario');

        if (Module) {
          const actions = Module.Actions || [];

          this.isViewUser = true; // Si existe el módulo, se puede ver
          this.isUpdateUser = actions.some((a: any) => a.name?.toLowerCase() === 'editar');
          this.isDeleteUser = actions.some((a: any) => a.name?.toLowerCase() === 'eliminar');
        }
      } catch (error) {
        console.error('Error al parsear appModules:', error);
      }
    }
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
            this.dataAddUpdateUser.idUserAccount ?? '',
            null, // idFile
            urlfile,
            file.name,
            file.type,
            false
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
                  idUserAccount: this.dataAddUpdateUser.idUserAccount ?? '',
                  idUsersFiles: res.data.idFile,
                });
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

  openFile(file: { name: string; url: string; type: string; idUserAccount: string, idUsersFiles: string | null}) {
    if (file.type.includes('pdf')) {
      window.open(file.url, '_blank');
    }
    if ( file.type.includes('image'))
    this.imageViewer.openViewer(file.url);
  }

  removeFile(index: number, id: string) {
    this.userservice.AddOrDeletFile(
      this.dataAddUpdateUser.idUserAccount ?? '',
      id, // idFile
      null,
      null,
      null,
      false
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedFiles.splice(index, 1);
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

  async OpenModalAddUpadte(name: string, id: string, option: number) {

    this.isModalAddUpdate = true;
    this.submitted = false;
    this.selectedImage = '';
    this.OpenModalGeneral();
    this.selectedFiles = [];

    this.isView = option !== 1;

    this.dataAddUpdateUser = new User({
      userContact: new UserContact()
    });

    if (name != 'Nuevo' && id != '') {
      this.userservice.GetIdUser(id ?? '').subscribe({
        next: (res) => {
          if (res.success && res.data) {
            console.log(res.data)
            const raw = res.data;
            const userContact = typeof raw.userContact === 'string' ? JSON.parse(raw.userContact)[0] : raw.userContact;

            this.dataAddUpdateUser = new User();
            this.dataAddUpdateUser.idUserAccount = raw.idUserAccount.toString() ?? '';
            this.dataAddUpdateUser.userName = raw.userName;
            this.dataAddUpdateUser.urlImagen = raw.urlImagen;
            this.dataAddUpdateUser.numberDocument = raw.numberDocument;
            this.dataAddUpdateUser.primaryName = raw.primaryName;
            this.dataAddUpdateUser.nameCompany = raw.nameCompany;
            this.dataAddUpdateUser.rol = raw.rol?.toUpperCase().toString() ?? '';
            this.dataAddUpdateUser.status = raw.status?.toUpperCase().toString() ?? '';
            this.dataAddUpdateUser.createdDate = raw.createdDate;
            this.dataAddUpdateUser.color = raw.color;
            this.dataAddUpdateUser.area = raw.area?.toUpperCase().toString() ?? '';
            this.dataAddUpdateUser.idClient = raw.idClient?.toUpperCase().toString() ?? '';
            this.dataAddUpdateUser.idUser = raw.idUser;
            this.dataAddUpdateUser.email = raw.email;
            this.dataAddUpdateUser.numberPhone = raw.numberPhone;
            this.dataAddUpdateUser.code = raw.code;
            this.dataAddUpdateUser.typeDocument = raw.typeDocument?.toUpperCase().toString() ?? '';
            this.dataAddUpdateUser.operation = raw.operation;
            this.dataAddUpdateUser.departament = raw.departament;
            this.dataAddUpdateUser.codePostal = raw.codePostal;
            this.dataAddUpdateUser.address = raw.address;
            this.dataAddUpdateUser.country = raw.country;
            this.dataAddUpdateUser.city = raw.city;
            this.dataAddUpdateUser.genre = raw.genre;
            this.dataAddUpdateUser.dateOfBirth = raw.dateOfBirth?.split('T')[0] ?? '';

            this.dataAddUpdateUser.userContact = new UserContact(userContact);
            this.selectedImage = this.dataAddUpdateUser.urlImagen ?? '';

            try {
              this.selectedFiles = JSON.parse(raw.files);
            } catch (e) {
              console.error('Error al parsear archivos:', e);
              this.selectedFiles = [];
            }

          }
          this.option = 0;
          this.getAreas();
          this.countryInput = this.dataAddUpdateUser.country ?? '';
          this.stateInput = this.dataAddUpdateUser.departament ?? '';
          this.cityInput = this.dataAddUpdateUser.city ?? '';

          if (!this.isView)
            this.nameUserSelected = 'Actualizar Usuario '.concat(this.dataAddUpdateUser.userName ?? '')
          else
            this.nameUserSelected = 'Usuario '.concat(this.dataAddUpdateUser.userName ?? '');
        }
      });

    }
    else {
      this.nameUserSelected = 'Agregar nuevo usuario';
      this.option = 1;
      this.countryInput = '';
      this.stateInput = '';
      this.cityInput = '';
    }
    this.isModalAddUpdate = true;
    this.nameAddUpdate = name;
  }

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

  onUsernameInput(input: HTMLInputElement) {
    const cleanValue = input.value.replace(/\s+/g, '');
    input.value = cleanValue;
    this.dataAddUpdateUser.userName = cleanValue;
  }

  validarSoloNumeros(event: any, id: number): void {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');

    if (valor.length > 11) { valor = valor.slice(0, 11); }

    event.target.value = valor;

    if (id === 1) this.dataAddUpdateUser.numberPhone = valor;
    if (id === 2) this.dataAddUpdateUser.userContact!.numberPhone = valor;
  }

  ValidateDataUser(): string | null {

    this.submitted = true;

    if ((!this.dataAddUpdateUser.userName || this.dataAddUpdateUser?.userName.trim() === '') ||
      (!this.dataAddUpdateUser?.idClient || this.dataAddUpdateUser?.idClient.trim() === '') ||
      (!this.dataAddUpdateUser?.rol || this.dataAddUpdateUser?.rol.trim() === '') ||
      (!this.dataAddUpdateUser?.area || this.dataAddUpdateUser?.area.trim() === '')
    ) {
      this.OpenModalGeneral();
      return 'Por favor, ingresa los datos generales obligatorios';
    }

    if ((!this.dataAddUpdateUser.primaryName || this.dataAddUpdateUser?.primaryName.trim() === '') ||
      (!this.dataAddUpdateUser?.typeDocument || this.dataAddUpdateUser?.typeDocument.trim() === '') ||
      (!this.dataAddUpdateUser?.numberDocument || this.dataAddUpdateUser?.numberDocument.trim() === '') ||
      (!this.dataAddUpdateUser?.email || this.dataAddUpdateUser?.email.trim() === '') ||
      (!this.dataAddUpdateUser?.code || this.dataAddUpdateUser?.code.trim() === '') ||
      (!this.dataAddUpdateUser?.numberPhone || this.dataAddUpdateUser?.numberPhone.trim() === '') ||
      (!this.dataAddUpdateUser?.dateOfBirth || this.dataAddUpdateUser?.dateOfBirth.trim() === '')
    ) {
      this.OpenModalPersonal();
      return 'Por favor, ingresa los datos personales obligatorios';
    }

    if ((!this.dataAddUpdateUser.userContact?.fullname || this.dataAddUpdateUser.userContact?.fullname.trim() === '') ||
      (!this.dataAddUpdateUser.userContact?.kinship || this.dataAddUpdateUser.userContact?.kinship.trim() === '') ||
      (!this.dataAddUpdateUser.userContact?.code || this.dataAddUpdateUser.userContact?.code.trim() === '') ||
      (!this.dataAddUpdateUser.userContact?.numberPhone || this.dataAddUpdateUser.userContact?.numberPhone.trim() === '')
    ) {
      this.OpenModalContact()
      return 'Por favor, ingresa los datos de contacto obligatorios';
    }

    return null;
  }

  messageAddUpdateCompany(isValid: boolean) {
    this.isLoadingBack = false;
    if (isValid) {
      this.getAllUsers();
      this.showResponseModal = false;
    }
    else {
      this.showResponseModal = false
    }
  }

  onImageSelected(event: Event): void {
    let input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.image = true;

      if (!file.type.startsWith('image/')) {
        this.tittle = 'Error Tipo Archivo';
        this.responseMessage = 'El archivo seleccionado no es una imagen.';
        this.responseSuccess = false;
        this.showResponseModal = true;
        this.image = false;
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width >= 90 && img.height >= 90) {
            this.selectedImage = reader.result as string;
          } else {
            this.tittle = 'Error tamaño Imagen';
            this.responseMessage = 'La imagen debe tener un tamaño mínimo de 1280 x 720 píxeles.';
            this.responseSuccess = false;
            this.showResponseModal = true;
            this.image = false;
            return;
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  DeleteImage() {
    this.selectedImage = null
    this.dataAddUpdateUser.urlImagen = undefined;
  }

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  async OpenModalMessage(option: string, id: string) {

    if (option == 'add') {
      this.messageTittle = 'Agregar Usuario'
      this.messageOption = '¿Esta seguro de guardar los datos de la usuario?';
      this.optionDelete = false;
      this.optionUpdate = false;
      this.optionAdd = true;
      this.idDelete = '';
    }
    if (option == 'update') {
      this.messageTittle = 'Actualizar Usuario'
      this.messageOption = '¿Esta seguro de actualizar los datos de la usuario?';
      this.optionDelete = false;
      this.optionUpdate = true;
      this.optionAdd = false;
      this.idDelete = '';
    }
    if (option == 'delete') {
      this.messageTittle = 'Eliminar Usuario'
      this.messageOption = '¿Esta seguro de eliminar La usuario?';
      this.optionDelete = true;
      this.optionUpdate = false;
      this.optionAdd = false;
      this.idDelete = id;
    }

    this.isMessageDelete = !this.isMessageDelete;
  }

  DeleteUser(id: string) {
    this.userservice.DeleteIdUser(id ?? '').subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoadingBack = false;
          this.closeModalMessage();
          this.tittle = 'Éxito';
          this.responseMessage = res.data?.message || 'Operación exitosa';
          this.responseSuccess = true;
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

  ClosedModalAddUpadte() {
    this.isModalAddUpdate = false;
    this.submitted = false;
  }

  async AddUpdateUser(operation: string) {
    this.isLoadingBack = true;

    const result = this.ValidateDataUser();
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
    this.dataAddUpdateUser.country = this.countryInput;
    this.dataAddUpdateUser.departament = this.stateInput;
    this.dataAddUpdateUser.city = this.cityInput;
    this.dataAddUpdateUser.operation = operation;

    if (this.image && this.selectedImage) {
      const imageResult = await this.AddImage(this.selectedImage ?? '');
      if (!imageResult) throw new Error('Error al subir la imagen');
      this.dataAddUpdateUser.urlImagen = imageResult;
      this.image = false;
      this.isLoadingBack = false;
      this.closeModalMessage();
    }
    this.userservice.AddOrUpdateUser(this.dataAddUpdateUser).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeModalMessage();
          this.tittle = 'Éxito';
          this.responseMessage = res.data?.message || 'Operación exitosa';
          this.responseSuccess = true;
          this.dataAddUpdateUser.idUserAccount = res.data?.idUserAccount;
          this.dataAddUpdateUser.idUser = res.data?.idUser;
          this.option = 0;
          this.nameUserSelected = 'Actualizar ' + this.dataAddUpdateUser.userName;
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

  closeModalMessage() {
    this.isMessageDelete = false;
  }

  async AddImage(imageContent: string): Promise<string | null> {
    if (imageContent) {
      try {
        console.log('imagen: ', imageContent)
        const response = await this.chatservice.imageBase(imageContent, 'users/imageProfile', 'usuario').toPromise();
        if (response.success) {
          return response.data ?? '';
        }
      }
      catch (error) {
        console.error('Error al enviar la imagen:', error);

        if (typeof error === 'object' && error !== null &&
          'error' in error && typeof (error as any).error === 'object' &&
          'message' in (error as any).error) {
          const errorMessage = (error as any).error.message;
          if (typeof errorMessage === 'string' && errorMessage.includes("Token Invalido")) {
            this.MessageTokenInvalidate();
          }
        }
      }
    }
    return null;
  }

  selectCity(city: any): void {
    this.cityInput = city.name;
    this.dataAddUpdateUser.city = city.name;
    this.selectedCityCode = city.code; // opcional
    this.filteredCities = [];
  }

  filterCities(): void {
    const query = this.cityInput.toLowerCase().trim();
    this.filteredCities = this.cities.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }

  selectState(state: any): void {
    this.cityInput = '';
    this.stateInput = state.name;
    this.dataAddUpdateUser.departament = state.name;
    this.selectedStatesCode = state.isoCode;
    this.filteredStates = [];
    this.onStateChange(); // si necesitas ejecutar algo más
  }

  filterStates(): void {
    const query = this.stateInput.toLowerCase().trim();
    this.filteredStates = this.states.filter(s =>
      s.name.toLowerCase().includes(query)
    );
  }

  onStateChange() {
    const selected = this.states.find(c => c.isoCode === this.selectedStatesCode);
    if (selected) {
      this.dataAddUpdateUser.departament = selected.name;
      this.dataAddUpdateUser.city = ''
    }

    if (this.selectedCountryCode && this.selectedStatesCode) {
      this.cities = City.getCitiesOfState(this.selectedCountryCode, this.selectedStatesCode);
    } else {
      this.cities = [];
    }
  }

  onCountryChange() {
    this.states = State.getStatesOfCountry(this.selectedCountryCode);
    this.cities = [];
    const selected = this.countries.find(c => c.isoCode === this.selectedCountryCode);

    if (selected) {
      this.dataAddUpdateUser.country = selected.name;
      this.dataAddUpdateUser.departament = '';
      this.dataAddUpdateUser.city = ''
    }
    this.states = State.getStatesOfCountry(this.selectedCountryCode);
  }

  selectCountry(country: any): void {
    this.stateInput = '';
    this.cityInput = '';
    this.countryInput = country.name;
    this.selectedCountryCode = country.isoCode;
    this.filteredCountries = [];
    this.onCountryChange(); // si necesitas actualizar algo más
  }

  filterCountries(): void {
    const query = this.countryInput.toLowerCase().trim();
    this.filteredCountries = this.countries.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }

  getAreas() {
    this.companyservice.GetIdCompanyArea(this.dataAddUpdateUser.idClient!).subscribe(response => {
      if (response.success && response.data) {
        const rawData = response.data;
        this.typeArea = JSON.parse(rawData.typeAreas);
      }
    });
  }

  clickPage() {
    this.pageNumber = 1;
    this.getAllUsers();
  }

  OpenModalContact() {
    this.isModalPersonal = false;
    this.isModalContact = true;
    this.isModalFiles = false;
    this.isModalGeneral = false;
  }
  OpenModalPersonal() {
    this.isModalPersonal = true;
    this.isModalContact = false;
    this.isModalFiles = false;
    this.isModalGeneral = false;
  }
  OpenModalFiles() {
    this.isModalPersonal = false;
    this.isModalContact = false;
    this.isModalFiles = true;
    this.isModalGeneral = false;
  }
  OpenModalGeneral() {
    this.isModalPersonal = false;
    this.isModalContact = false;
    this.isModalFiles = false;
    this.isModalGeneral = true;
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

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageNumber = page; // si usas pageNumber para la consulta
      this.getAllUsers(); // recarga datos
    }
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

  applyDateRange() {
    if (!this.dateError && this.dateStart && this.dateEnd) {
      console.log('Aplicado:', this.dateStart, this.dateEnd);
      this.showDatePicker = false;
    }
  }

  resetDates() {
    this.dateStart = null;
    this.dateEnd = null;
    this.dateError = false;
  }

  async clearFilter() {
    this.selectedStatusIds = [];
    this.selectedClientsIds = [];
    this.selectedRolesIds = [];
    this.searchText = null;
    this.dateStart = null;
    this.dateEnd = null;
    this.isFilterRol = false;
    this.isFilterCompany = false;
    this.isFilterStatus = false;
    this.isFilterDate = false;
    this.isFilterSearch = false;
    this.getAllUsers();
  }

  async clearFilterRol() {
    this.selectedRolesIds = [];
    this.isFilterRol = false;
    this.getAllUsers();
  }

  async clearFilterCompany() {
    this.selectedClientsIds = [];
    this.isFilterCompany = false;
    this.getAllUsers();
  }

  async clearFilterStatus() {
    this.selectedStatusIds = [];
    this.isFilterStatus = false;
    this.getAllUsers();
  }

  async clearFilterDate() {
    this.dateStart = null;
    this.dateEnd = null;
    this.isFilterDate = false;
    this.getAllUsers();
  }

  async clearFilterSearch() {
    this.searchText = null;
    this.isFilterSearch = false;
    this.getAllUsers();
  }

  toggleFilter() {
    this.showFilterStatus = !this.showFilterStatus;
  }

  OpenFilterRol() {
    this.showFilterRol = true;
  }

  OpenFilterCompany() {
    this.showFilterCompany = true;
  }

  OpenFilterDate() {
    this.showDatePicker = true;
  }

  closeFilter() {
    this.showFilterStatus = false;
    this.showFilterRol = false;
    this.showFilterCompany = false;
    this.showDatePicker = false;
  }

  onCheckboxChangeStatus(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.selectedStatusIds.includes(value)) {
        this.selectedStatusIds.push(value);
      }
    } else {
      this.selectedStatusIds = this.selectedStatusIds.filter(id => id !== value);
    }
  }

  onCheckboxChangeRol(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.selectedRolesIds.includes(value)) {
        this.selectedRolesIds.push(value);
      }
    } else {
      this.selectedRolesIds = this.selectedRolesIds.filter(id => id !== value);
    }
  }

  onCheckboxChangeCompany(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.selectedClientsIds.includes(value)) {
        this.selectedClientsIds.push(value);
      }
    } else {
      this.selectedClientsIds = this.selectedClientsIds.filter(id => id !== value);
    }
  }

  async filterUsers() {

    this.isFilterRol = this.selectedRolesIds.length > 0;
    this.isFilterCompany = this.selectedClientsIds.length > 0
    this.isFilterStatus = this.selectedStatusIds.length > 0
    this.isFilterDate = !!this.dateStart || !!this.dateEnd;
    this.isFilterSearch = !!this.searchText;

    this.pageNumber = 1;
    this.currentPage = 1;
    this.totalUsers = 0;
    this.getAllUsers();
    this.closeFilter();
  }

  usersInfo() {
    this.userservice.getInfoUsers().subscribe({
      next: (infoData) => {
        if (infoData?.data?.length > 0) {
          this.userInfo = infoData.data[0]; // Extrae el único objeto del array
          console.log('info:', this.userInfo);
        } else {
          this.userInfo = {};
          console.warn('No se encontró información de usuarios.');
        }
      },
      error: (error) => {
        console.error('Error al obtener la info de usuarios:', error);
        this.userInfo = {};
      }
    });
  }

  async orderUsers() {
    this.order = !this.order;
    this.getAllUsers();
  }

  getAllUsers() {
    this.usersInfo();
    this.userservice.GetAllUsers(
      this.selectedClientsIds, this.selectedRolesIds, this.selectedStatusIds, this.searchText!, this.pageNumber,
      this.pageSize, this.dateStart!, this.dateEnd!, this.order
    ).subscribe(result => {
      this.users = result.data.map((user: User) => {
        if (user.createdDate) {
          const fecha = new Date(user.createdDate);
          user.createdDate = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
        this.totalUsers = user.totalUsers ?? 0;
        return user;
      });
    });
  }

  colorDefaul() {
    this.validateToken();
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
    }
  }

  async validateToken() {
    if (!await this.authservice.isTokenValid())
      this.MessageTokenInvalidate();
  }

  MessageTokenInvalidate() {
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

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

}
