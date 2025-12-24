import { Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/login.services/auth.service';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../core/company.services/company.service';
import { UtilService } from '../../core/util.services/util.service';
import { Colors, Company, EmailCompany, LegalRepresentative, ValidatePassword, IpsAuthorized, IpsNotAuthorized } from '../../models/company.model';
import { DEFAULT_COLORS, BASE_URLS, DATA } from '../../config/constants';
import { CountryCode } from '../../models/contry.model';
import { Country, State, City } from 'country-state-city';
import { ChatService } from '../../core/chat.services/chat.service';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';

@Component({
    selector: 'app-domain',
    imports: [
        CommonModule,
        FormsModule,
        ModalMessageComponent,
        NgSelectModule
    ],
    templateUrl: './domain.component.html',
    styleUrl: './domain.component.css'
})

export default class DomainComponent {
  clientData: any = {};


  public iconUsers: string = BASE_URLS.URL_FRONT.concat("/icon/default/users.png");
  public iconVisible: string = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  public iconUpdate: string = BASE_URLS.URL_FRONT.concat("/icon/default/update.png");
  public iconEditWhite: string = BASE_URLS.URL_FRONT.concat("/icon/default/editWhite.png");
  public iconDelete: string = BASE_URLS.URL_FRONT.concat("/icon/default/delete.png");
  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconCancel: string = BASE_URLS.URL_FRONT.concat("/icon/default/cancel.png");
  public iconSave: string = BASE_URLS.URL_FRONT.concat("/icon/default/save.png");
  public iconImage: string = BASE_URLS.URL_FRONT.concat("/icon/default/image.png");
  public icon: string = BASE_URLS.URL_FRONT.concat("/icon/default/icon.png");
  public iconMigrate: string = BASE_URLS.URL_FRONT.concat("/icon/default/migrate.png");
  public iconHistory: string = BASE_URLS.URL_FRONT.concat("/icon/default/history.png");
  public iconCheck: string = BASE_URLS.URL_FRONT.concat("/icon/default/check.png");
  public iconSuccessful: string = BASE_URLS.URL_FRONT.concat("/icon/default/checkblack.png");
  public iconError: string = BASE_URLS.URL_FRONT.concat("/icon/default/error.png");
  public iconSaveBlack: string = BASE_URLS.URL_FRONT.concat("/icon/default/saveblack.png");
  public iconCompany: string = BASE_URLS.URL_FRONT.concat("/icon/default/companies.png");


  dataAddUpdateCompany: Company = new Company({
    emailCompany: new EmailCompany(),
    colors: new Colors(),
    legalRepresentative: new LegalRepresentative(),
    validatePassword: new ValidatePassword(),
    ipAuthorized: new IpsAuthorized(),
    ipNotAuthorized: new IpsNotAuthorized()
  });

  selectedColorIndex: number | null = 1;
  countriesCode: CountryCode[] = [];
  typeDocuments: any[] = [];
  typeStatus: any[] = [];
  countryInput: string = '';
  filteredCountries: any[] = [];
  stateInput: string = '';
  filteredStates: any[] = [];
  cityInput: string = '';
  filteredCities: any[] = [];
  selectedUserIds: string[] = [];
  selectedCityCode: string = '';
  nameCompanySelect: string = '';

  inputValue: string = '';
  inputValueArea: string = '';
  ipAuthorized1: string = '';
  ipAuthorized2: string = '';
  ipNotAuthorized1: string = '';
  ipNotAuthorized2: string = '';
  isIdClient: string = '';
  isIdClientMigrate: string = '';
  showResponseModal: boolean = false;
  emailInvalid: boolean = false;
  emailInvalid2: boolean = false;
  isEmail1Valid: boolean = true;
  isEmail2Valid: boolean = true;
  isModalMigrate: boolean = false;
  isMigrate: boolean = false;
  image: boolean = false;
  icons: boolean = false;
  responseMessage: string = '';
  tittle: string = '';
  responseSuccess: boolean = true;
  isView: boolean = true;
  selectedCountryCode: string = '';
  selectedStatesCode: string = '';
  submitted = false;
  selectAllChecked: boolean = false;
  isModalDesign: boolean = false;
  isModalConfigure: boolean = false;
  isModalGeneral: boolean = true;
  isModalLegal: boolean = false;

  countries: ReturnType<typeof Country.getAllCountries> = [];
  states: ReturnType<typeof State.getStatesOfCountry> = [];
  cities: ReturnType<typeof City.getCitiesOfState> = [];

  nameCompany: string = '';
  errorMessage: string = '';
  colorOneMessage: string = '';
  colorTwoMessage: string = '';
  title: string = ''
  messageButton: string = ''
  currentColor: string = '';
  nameAddUpdate: string = '';
  searchTerm = '';
  colorOne: string = '';
  colorTwo: string = '';
  colorThree: string = '';
  colorFour: string = '';
  colorFive: string = '';

  messageOption: string = '';
  messageTittle: string = '';
  idDelete: string = '';
  optionDelete: boolean = false;
  optionUpdate: boolean = false;
  optionAdd: boolean = false;
  optionMigrate: boolean = false;
  isLoadingBack: boolean = false;

  isModalVisible: boolean = false;
  isSuccess: boolean = true;
  isLogin: boolean = false;
  isMessageDelete: boolean = false;
  domainStatus = 'Activo';
  isModalView = false;
  isHexColorValidOne: boolean = false;
  isHexColorValidTwo: boolean = false;
  isHexColorValidThree: boolean = false;
  isHexColorValidFour: boolean = false;
  isHexColorValidFive: boolean = false;
  isViewDomain = false;
  isUpdateDomain = false;
  isDeleteDomain = false;

  isModalAddUpdate: boolean = false; //cambiar estado
  isModalAdd: boolean = true;

  isColorPickerOpen: boolean = false; // Estado de apertura del selector de color
  colorIndex: number | null = null;
  selectedImage: string | null = null;
  iconPreview: string | null = null;
  emailInput: string = '';
  emails: string[] = [];
  countryCodeInput: string = '';
  phoneNumberInput: string = '';
  phoneNumbers: string[] = [];
  companies: Company[] = [];

  newEmail: string = '';  // Valor del input
  emailList: string[] = [];

  page: number = 1;
  itemsPerPage: number = 10;
  userTotal: number = 0;
  valueOption: number = 0;
  idCompanyMigrate: string = '';

  isModalOpen = false; // Estado del modal
  newDomainName = ''; // Nombre del nuevo dominio
  selectedColor: string = ''; // Color seleccionado
  colorOptions1: string[] = ['#503d5c', '#624b6e', '#6f597a', '#8b7991', '#f0d4ff'];
  colorOptions2: string[] = ['#194a7a', '#476f95', '#7593af', '#a3b7ca', '#d1dbe4'];
  selectedColors = [false, false, false];
  hexColorValue: string = ''; // Valor hexadecimal del color

  users: any[] = [];

  constructor(private authservice: AuthService,
    private companyservice: CompanyService,
    private chatservice: ChatService,
    private utilservice: UtilService
  ) { }

  ngOnInit(): void {
    this.colorDefaul();
    this.getCompanies();
    this.utilservice.getCountries().subscribe((data) => {
      this.countriesCode = data;
      this.countries = Country.getAllCountries();
    });
    this.companyservice.GetAllTypeStatusDocument().subscribe(response => {
      if (response.success && response.data && response.data.length > 0) {
        const rawData = response.data[0];
        this.typeDocuments = JSON.parse(`[${rawData.typeDocuments}]`);
        this.typeStatus = JSON.parse(rawData.typeStatus);
      }
    });
    this.getDomainPermissions();
  }

  OpenModalConfigure() {
    this.isModalDesign = false;
    this.isModalConfigure = true;
    this.isModalGeneral = false;
    this.isModalLegal = false;
  }
  OpenModalDesing() {
    this.isModalDesign = true;
    this.isModalConfigure = false;
    this.isModalGeneral = false;
    this.isModalLegal = false;
  }

  OpenModalGeneral() {
    this.isModalDesign = false;
    this.isModalConfigure = false;
    this.isModalGeneral = true;
    this.isModalLegal = false;
  }
  OpenModalLegal() {
    this.isModalDesign = false;
    this.isModalConfigure = false;
    this.isModalGeneral = false;
    this.isModalLegal = true;
  }

  async toggleUserSelection(userCheck: any) {

    if (!this.selectedUserIds.includes(userCheck.id))
      this.selectedUserIds.push(userCheck.id);
    else
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userCheck.id);

    if (this.selectedUserIds.length == 0 && !this.selectAllChecked)
      this.isMigrate = false;

    if (this.selectedUserIds.length > 0)
      this.isMigrate = true;
  }



  getDomainPermissions() {
    const storedModules = localStorage.getItem('appModules');

    if (storedModules) {
      try {
        const appModules = JSON.parse(storedModules);

        const domainModule = appModules.modules?.static?.find(
          (mod: any) => mod.name?.toLowerCase() === 'dominio');

        if (domainModule) {
          const actions = domainModule.Actions || [];

          this.isViewDomain = true; // Si existe el módulo, se puede ver
          this.isUpdateDomain = actions.some((a: any) => a.name?.toLowerCase() === 'editar');
          this.isDeleteDomain = actions.some((a: any) => a.name?.toLowerCase() === 'eliminar');
        }
      } catch (error) {
        console.error('Error al parsear appModules:', error);
      }
    }
  }

  getCompanies() {
    this.companyservice.getCompanies().subscribe(result => {
      this.companies = result.map((company: Company) => {
        if (!company.urlLogo) {
          company.urlLogo = BASE_URLS.URL_FRONT.concat("/icon/default/iconheader.png");
        }
        if (company.dateCreate) {
          const fecha = new Date(company.dateCreate);
          company.dateCreate = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
        return company;
      });
    });
  }

  async OpenModalAddUpadte(name: string, id: string, option: number) {

    this.OpenModalGeneral();

    this.isView = option !== 1;

    this.dataAddUpdateCompany = new Company({
      emailCompany: new EmailCompany(),
      colors: new Colors(),
      legalRepresentative: new LegalRepresentative(),
      validatePassword: new ValidatePassword(),
      ipAuthorized: new IpsAuthorized(),
      ipNotAuthorized: new IpsNotAuthorized()
    });

    this.colorOne = '';
    this.colorTwo = '';
    this.colorThree = '';
    this.colorFour = '';
    this.colorFive = '';
    this.iconPreview = '';
    this.selectedImage = '';

    if (name != 'Nuevo' && id != '') {
      this.companyservice.GetIdCompany(id).subscribe({
        next: (res) => {
          if (res.success && res.data) {

            const raw = res.data;
            const colors = typeof raw.colors === 'string' ? JSON.parse(raw.colors) : raw.colors;
            let validatePasswordRaw = raw.validatePassword;
            let listAreasRaw = raw.listAreas;

            if (typeof validatePasswordRaw === 'string')
              validatePasswordRaw = JSON.parse(validatePasswordRaw);

            if (validatePasswordRaw.listWord && Array.isArray(validatePasswordRaw.listWord))
              validatePasswordRaw.listWord = validatePasswordRaw.listWord.map((item: any) => item.word);

            if (typeof listAreasRaw === 'string') {
              try {
                listAreasRaw = JSON.parse(listAreasRaw);
              } catch (e) {
                listAreasRaw = [];
              }
            }

            if (Array.isArray(listAreasRaw)) {
              raw.listAreas = listAreasRaw.map((item: any) => item.area);
            } else {
              raw.listAreas = [];
            }

            const emailCompany = typeof raw.EmailCompany === 'string' ? JSON.parse(raw.EmailCompany)[0] : raw.EmailCompany;
            const legalRepresentative = typeof raw.LegalRepresentative === 'string' ? JSON.parse(raw.LegalRepresentative)[0] : raw.LegalRepresentative;
            const ipAuthorized = typeof raw.ipAuthorized === 'string' ? JSON.parse(raw.ipAuthorized)[0] : raw.ipAuthorized;
            const ipNotAuthorized = typeof raw.ipNotAuthorized === 'string' ? JSON.parse(raw.ipNotAuthorized)[0] : raw.ipNotAuthorized;

            this.dataAddUpdateCompany = new Company();
            this.dataAddUpdateCompany.idClient = raw.idClient.toString() ?? '';
            this.dataAddUpdateCompany.tatolUser = raw.tatolUser;
            this.dataAddUpdateCompany.nameCompany = raw.nameCompany;
            this.dataAddUpdateCompany.nit = raw.nit;
            this.dataAddUpdateCompany.addressCompany = raw.addressCompany;
            this.dataAddUpdateCompany.Status = raw.Status?.toUpperCase().toString() ?? '';
            this.dataAddUpdateCompany.country = raw.country;
            this.dataAddUpdateCompany.city = raw.city;
            this.dataAddUpdateCompany.dateCreate = raw.dateCreate;
            this.dataAddUpdateCompany.url = raw.url;
            this.dataAddUpdateCompany.domain = raw.domain;
            this.dataAddUpdateCompany.createBy = raw.createBy;
            this.dataAddUpdateCompany.urlLogo = raw.urlLogo;
            this.dataAddUpdateCompany.urlImagen = raw.urlImagen;
            this.dataAddUpdateCompany.departament = raw.departament;
            this.dataAddUpdateCompany.codePostal = raw.codePostal;
            this.dataAddUpdateCompany.codeContry = raw.extension;
            this.dataAddUpdateCompany.phoneMovil = raw.PhoneMovil;
            this.dataAddUpdateCompany.phoneNumberCompany = raw.PhoneNumberCompany;
            this.dataAddUpdateCompany.timeUpdatePasword = raw.timeUpdatePasword;
            this.dataAddUpdateCompany.timeUpdateToken = raw.timeUpdateToken;
            this.dataAddUpdateCompany.requestCode = Boolean(raw.requestCode);
            this.dataAddUpdateCompany.listAreas = raw.listAreas;

            // Instancia clases anidadas con datos ya parseados
            this.dataAddUpdateCompany.colors = new Colors(colors);
            this.dataAddUpdateCompany.validatePassword = new ValidatePassword(validatePasswordRaw);
            this.dataAddUpdateCompany.emailCompany = new EmailCompany(emailCompany);
            this.dataAddUpdateCompany.legalRepresentative = new LegalRepresentative(legalRepresentative);
            this.dataAddUpdateCompany.ipAuthorized = new IpsAuthorized(ipAuthorized);
            this.dataAddUpdateCompany.ipNotAuthorized = new IpsNotAuthorized(ipNotAuthorized);

            // Imagenes
            this.iconPreview = this.dataAddUpdateCompany.urlLogo ?? '';
            this.selectedImage = this.dataAddUpdateCompany.urlImagen ?? '';
          }

          this.countryInput = this.dataAddUpdateCompany.country ?? '';
          this.stateInput = this.dataAddUpdateCompany.departament ?? '';
          this.cityInput = this.dataAddUpdateCompany.city ?? '';

          if (!this.isView)
            this.nameCompanySelect = ' / Personalización '.concat(this.dataAddUpdateCompany.nameCompany ?? '')
          else
            this.nameCompanySelect = ' / Vizualización '.concat(this.dataAddUpdateCompany.nameCompany ?? '')

          if (this.dataAddUpdateCompany.colors?.option === 3) {

            this.colorOne = this.dataAddUpdateCompany.colors.colorOne ?? '';
            this.colorTwo = this.dataAddUpdateCompany.colors.colorTwo ?? '';
            this.colorThree = this.dataAddUpdateCompany.colors.colorThree ?? '';
            this.colorFour = this.dataAddUpdateCompany.colors.colorFour ?? '';
            this.colorFive = this.dataAddUpdateCompany.colors.colorFive ?? '';
            this.selectedColorIndex = 3;

            this.onColorChange(1);
            this.onColorChange(2);
            this.onColorChange(3);
            this.onColorChange(4);
            this.onColorChange(5);
          }
          else {
            this.selectedColorIndex = this.dataAddUpdateCompany.colors!.option ?? 1;
          }
        }
      });
    }
    else {
      this.nameCompanySelect = ' / Crear Nueva Compañia'
      this.countryInput = '';
      this.stateInput = '';
      this.cityInput = '';
    }
    this.isModalAdd = true;
    this.isModalAddUpdate = true;
    this.nameAddUpdate = name;
  }

  DeleteCompany(id: string) {
    this.companyservice.DeleteIdCompany(id ?? '').subscribe({
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
        this.responseMessage = err.error?.error?.message || 'Error del servidor al eliminar la compañía';
        this.responseSuccess = false;
        this.showResponseModal = true;
        console.error('❌ Error:', err);
      }
    });
    this.idDelete = '';
  }

  ClosedModalAddUpadte() {
    this.isModalAddUpdate = false;
    this.isModalAdd = true;
    this.nameCompanySelect = '';
    this.submitted = false;
  }

  OpenModalMigrate(idClient: string, usersTotal: number = 0) {

    if (!usersTotal || usersTotal === 0) {
      this.tittle = 'Sin Usuarios';
      this.responseMessage = 'La compañia seleccionada no tiene usuarios.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    this.isModalMigrate = true;
    this.isIdClient = idClient;
  }

  ClosedModalMigrate() {
    this.isModalMigrate = false;
    this.isIdClient = '';
    this.isIdClientMigrate = '';
    this.selectedUserIds = [];
    this.isMigrate = false;
    this.users.forEach(user => user.selected = false);
  }

  MigrateUsersCompany() {

    if (!this.isIdClientMigrate || this.isIdClientMigrate.trim() === '') {
      this.closeModalMessage();
      this.isLoadingBack = false;
      this.tittle = 'Error Datos';
      this.responseMessage = 'Por favor, seleccione una compañia';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    this.companyservice.MigrateUsersCompany(this.isIdClient, this.isIdClientMigrate, this.selectAllChecked, this.selectedUserIds).subscribe({
      next: (res) => {
        console.log(res)
        if (res.success) {
          this.isLoadingBack = false;
          this.closeModalMessage();
          this.tittle = 'Éxito';
          this.responseMessage = res.data?.message || 'Operación exitosa';
          this.responseSuccess = true;
          this.closeModalView();
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
        this.responseMessage = err.error?.error?.message || 'Error del servidor al guardar la compañía';
        this.responseSuccess = false;
        this.showResponseModal = true;
        console.error('❌ Error:', err);
      }
    });

  }

  filterCountries(): void {
    const query = this.countryInput.toLowerCase().trim();
    this.filteredCountries = this.countries.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }

  selectCountry(country: any): void {
    this.stateInput = '';
    this.cityInput = '';
    this.countryInput = country.name;
    this.dataAddUpdateCompany.country = country.name;
    this.selectedCountryCode = country.isoCode;
    this.filteredCountries = [];
    this.onCountryChange(); // si necesitas actualizar algo más
  }

  filterStates(): void {
    const query = this.stateInput.toLowerCase().trim();
    this.filteredStates = this.states.filter(s =>
      s.name.toLowerCase().includes(query)
    );
  }

  selectState(state: any): void {
    this.cityInput = '';
    this.stateInput = state.name;
    this.dataAddUpdateCompany.departament = state.name;
    this.selectedStatesCode = state.isoCode;
    this.filteredStates = [];
    this.onStateChange(); // si necesitas ejecutar algo más
  }

  filterCities(): void {
    const query = this.cityInput.toLowerCase().trim();
    this.filteredCities = this.cities.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }

  selectCity(city: any): void {
    this.cityInput = city.name;
    this.dataAddUpdateCompany.city = city.name;
    this.selectedCityCode = city.code; // opcional
    this.filteredCities = [];
  }

  ValidateDataCompany(): string | null {

    this.submitted = true;

    if ((!this.dataAddUpdateCompany?.nameCompany || this.dataAddUpdateCompany?.nameCompany.trim() === '') ||
      (!this.dataAddUpdateCompany?.domain || this.dataAddUpdateCompany?.nameCompany.trim() === '') ||
      (!this.dataAddUpdateCompany?.nit || this.dataAddUpdateCompany?.nit.trim() === '') ||
      (!this.dataAddUpdateCompany?.Status || this.dataAddUpdateCompany?.Status.trim() === '') ||
      (!this.dataAddUpdateCompany.legalRepresentative!.nameLegalRepresentatives || this.dataAddUpdateCompany.legalRepresentative!.nameLegalRepresentatives.trim() === '') ||
      (!this.dataAddUpdateCompany.legalRepresentative!.documentNumber || this.dataAddUpdateCompany.legalRepresentative!.documentNumber.trim() === '')
    )
      return 'Por favor, ingresa los datos obligatorios';

    if (!this.isEmail1Valid)
      return 'Correo electronico para la compañia suministrado es invalido';

    if (!this.isEmail2Valid)
      return 'Correo electronico para representante legal suministrado es invalido';

    if (this.dataAddUpdateCompany.validatePassword?.validate6 === true && this.dataAddUpdateCompany.validatePassword?.validate7 === true) {
      const v1 = Number(this.dataAddUpdateCompany.validatePassword?.minimumCharacters ?? 0);
      const v2 = Number(this.dataAddUpdateCompany.validatePassword?.maximumCharacters ?? 0);
      if (v1 >= v2){
        console.log('menor'+v1+"mayor"+v2)
        return 'El valor de los caracteres mínimos de validación de contraseña no puede ser mayor o igual a los caracteres máximos';
      }
        
    }

    if (!this.dataAddUpdateCompany.timeUpdatePasword || this.dataAddUpdateCompany.timeUpdatePasword == 0)
      return 'El tiempo de la contraseña no puede ser 0 ni nulo';

    if (!this.dataAddUpdateCompany.timeUpdateToken || this.dataAddUpdateCompany.timeUpdateToken == 0)
      return 'El tiempo del token no puede ser 0 ni nulo';

    
    return null;
  }

  OpenModalAdd(option: number = 1) {
    this.isModalAdd = true
    this.valueOption = option;
  }
  closedModalAdd() { this.isModalAdd = false }

  DeleteImage() {
    this.selectedImage = null
    this.dataAddUpdateCompany.urlImagen = undefined;
  }

  DeleteIcon() {
    this.iconPreview = null;
    this.dataAddUpdateCompany.urlLogo = undefined;
  }

  async AddImage(imageContent: string): Promise<string | null> {
    if (imageContent) {
      try {
        console.log('imagen: ', imageContent)
        const response = await this.chatservice.imageBase(imageContent, 'client/configure', 'dominio').toPromise();
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

  removeItem(item: string) {
    const list = this.dataAddUpdateCompany.validatePassword?.listWord;
    if (list) {
      this.dataAddUpdateCompany.validatePassword!.listWord = list.filter(i => i !== item);
    }
  }

  removeItemArea(item: string) {
    const list = this.dataAddUpdateCompany.listAreas;
    if (list) {
      this.dataAddUpdateCompany.listAreas = list.filter(i => i !== item);
    }
  }

  addItem() {
    const word = this.inputValue.trim();

    if (word) {
      if (!this.dataAddUpdateCompany.validatePassword?.listWord)
        this.dataAddUpdateCompany.validatePassword!.listWord = [];

      const list = this.dataAddUpdateCompany.validatePassword!.listWord;
      const exists = list.some(item => item.toLowerCase() === word.toLowerCase());

      if (!exists) list.unshift(word);
      this.inputValue = '';
    }
  }

  addItemArea() {
    const area = this.inputValueArea.trim();

    if (area) {
      if (!this.dataAddUpdateCompany.listAreas)
        this.dataAddUpdateCompany.listAreas = [];

      const list = this.dataAddUpdateCompany.listAreas;
      const exists = list.some(item => item.toLowerCase() === area.toLowerCase());

      if (!exists) list.unshift(area);
      this.inputValueArea = '';
    }
  }

  addNotAuthorizedIps() {
    if (!this.dataAddUpdateCompany.ipNotAuthorized)
      this.dataAddUpdateCompany.ipNotAuthorized = new IpsAuthorized();

    if (!this.dataAddUpdateCompany.ipNotAuthorized.ips)
      this.dataAddUpdateCompany.ipNotAuthorized.ips = [];

    const ip1 = this.ipNotAuthorized1.trim();
    const ip2 = this.ipNotAuthorized2.trim();
    const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

    if (!ipv4Regex.test(ip1) || !ipv4Regex.test(ip2)) {
      this.tittle = 'Ips No Validas';
      this.responseMessage = 'Una o ambas direcciones IP no son válidas.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    const ipToNumber = (ip: string): number =>
      ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);

    const ip1Num = ipToNumber(ip1);
    const ip2Num = ipToNumber(ip2);

    if (ip1Num >= ip2Num) {
      this.tittle = 'Ips No Validas';
      this.responseMessage = 'La IP inicial no puede ser mayor o igual que la IP final.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    const list = this.dataAddUpdateCompany.ipNotAuthorized.ips;

    const exists = list.some(item =>
      item.ip1.toLowerCase() === ip1.toLowerCase() &&
      item.ip2.toLowerCase() === ip2.toLowerCase()
    );

    if (!exists) list.unshift({ ip1, ip2 });

    this.ipNotAuthorized1 = '';
    this.ipNotAuthorized2 = '';
  }

  validarSoloNumeros(event: any, id: number): void {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');

    if (valor.length > 11) { valor = valor.slice(0, 11); }

    event.target.value = valor;

    if (id === 3) this.dataAddUpdateCompany.phoneNumberCompany = valor;
    if (id === 2) this.dataAddUpdateCompany.legalRepresentative!.numberMovil = valor;
    if (id === 1) this.dataAddUpdateCompany.phoneMovil = valor;
  }

  removeIpNotAuthorized(item: any) {
    const ips = this.dataAddUpdateCompany.ipNotAuthorized?.ips;
    if (ips) {
      this.dataAddUpdateCompany.ipNotAuthorized!.ips = ips.filter(i => i !== item);
    }
  }

  isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
    return regex.test(email);
  }

  validateEmailField() {
    const email = this.dataAddUpdateCompany.emailCompany?.email || '';
    this.emailInvalid = !this.isValidEmail(email);

    if (this.emailInvalid && email != '')
      this.isEmail1Valid = false;
    else
      this.isEmail1Valid = true;
  }

  validateEmailField2() {
    const email = this.dataAddUpdateCompany.legalRepresentative?.email || '';
    this.emailInvalid2 = !this.isValidEmail(email);

    if (this.emailInvalid2 && email != '')
      this.isEmail2Valid = false;
    else
      this.isEmail2Valid = true;
  }

  addAuthorizedIps() {
    if (!this.dataAddUpdateCompany.ipAuthorized)
      this.dataAddUpdateCompany.ipAuthorized = new IpsAuthorized();

    if (!this.dataAddUpdateCompany.ipAuthorized.ips)
      this.dataAddUpdateCompany.ipAuthorized.ips = [];

    const ip1 = this.ipAuthorized1.trim();
    const ip2 = this.ipAuthorized2.trim();
    const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

    if (!ipv4Regex.test(ip1) || !ipv4Regex.test(ip2)) {
      this.tittle = 'Ips No Validas';
      this.responseMessage = 'Una o ambas direcciones IP no son válidas.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    const ipToNumber = (ip: string): number =>
      ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);

    const ip1Num = ipToNumber(ip1);
    const ip2Num = ipToNumber(ip2);

    if (ip1Num >= ip2Num) {
      this.tittle = 'Ips No Validas';
      this.responseMessage = 'La IP inicial no puede ser mayor o igual que la IP final.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    const list = this.dataAddUpdateCompany.ipAuthorized.ips;

    const exists = list.some(item =>
      item.ip1.toLowerCase() === ip1.toLowerCase() &&
      item.ip2.toLowerCase() === ip2.toLowerCase()
    );

    if (!exists) list.unshift({ ip1, ip2 });

    this.ipAuthorized1 = '';
    this.ipAuthorized2 = '';
  }

  removeIpAuthorized(item: any) {
    const ips = this.dataAddUpdateCompany.ipAuthorized?.ips;
    if (ips) {
      this.dataAddUpdateCompany.ipAuthorized!.ips = ips.filter(i => i !== item);
    }
  }

  async AddUpdateCompany(operation: string) {
    this.isLoadingBack = true;
    const result = this.ValidateDataCompany();
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
    this.SelectColors();

    if (this.image && this.selectedImage) {
      const imageResult = await this.AddImage(this.selectedImage ?? '');
      if (!imageResult) throw new Error('Error al subir la imagen');
      this.dataAddUpdateCompany.urlImagen = imageResult;
      this.image = false;
      this.isLoadingBack = false;
      this.closeModalMessage();
    }

    if (this.icons && this.iconPreview) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const logoResult = await this.AddImage(this.iconPreview ?? '');
      if (!logoResult) throw new Error('Error al subir el logo');
      this.dataAddUpdateCompany.urlLogo = logoResult;
      this.icons = false;
      this.isLoadingBack = false;
      this.closeModalMessage();
    }

    this.dataAddUpdateCompany.country = this.countryInput;
    this.dataAddUpdateCompany.departament = this.stateInput;
    this.dataAddUpdateCompany.city = this.cityInput;
    this.dataAddUpdateCompany.Operation = operation;

    this.companyservice.AddOrUpdateCompany(this.dataAddUpdateCompany).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeModalMessage();
          this.tittle = 'Éxito';
          this.responseMessage = res.data?.message || 'Operación exitosa';
          this.dataAddUpdateCompany.idClient = res.data?.idClient;
          this.responseSuccess = true;
          this.ipNotAuthorized1 = '';
          this.ipNotAuthorized2 = '';
          this.ipAuthorized1 = '';
          this.ipAuthorized2 = '';
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

  messageAddUpdateCompany(isValid: boolean) {
    this.isLoadingBack = false;
    if (isValid) {
      this.getCompanies();

      
        if (this.isModalAddUpdate)
          this.OpenModalAddUpadte('update', this.dataAddUpdateCompany.idClient ?? '', 1);
      

      this.showResponseModal = false;
      this.isModalMigrate = false;
      this.isIdClient = '';
      this.isIdClientMigrate = '';
    }
    else {
      this.showResponseModal = false
    }
  }

  onIconSelected(event: Event): void {
    let input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.icons = true;

      if (!file.type.startsWith('image/')) {
        this.tittle = 'Error Tipo Archivo';
        this.responseMessage = 'El archivo seleccionado no es una imagen.';
        this.responseSuccess = false;
        this.showResponseModal = true;
        this.image = false;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;

          if (width >= 90 && width <= 1000 && height >= 90 && height <= 1000) {
            this.iconPreview = reader.result as string;
          } else {
            this.tittle = 'Tamaño de Icono';
            this.responseMessage = 'El tamaño del Icono es mayor.';
            this.responseSuccess = false;
            this.showResponseModal = true;
            this.image = false;
            input.value = ''
            return;
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
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
          if (img.width >= 1280 && img.height >= 720) {
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

  toggleColorSelection(index: number): void {

    this.dataAddUpdateCompany!.colors!.option = index;
    if (index == 3)
      this.dataAddUpdateCompany!.colors!.option = 3;

    if (this.selectedColorIndex === index) {
      this.selectedColorIndex = 1;
      this.dataAddUpdateCompany!.colors!.option = 1;

    } else {
      this.selectedColorIndex = index;
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
    this.isModalView = false;
    this.searchTerm = '';
    this.users = [];
    this.nameCompany = '';
    this.userTotal = 0;
    this.idCompanyMigrate = '';
    this.selectedUserIds = [];
    this.isMigrate = false;
    this.selectAllChecked = false;
  }

  loadUsers(id: string, nameComapny: string, usersTotal: number = 0) {

    if (!usersTotal || usersTotal === 0) {
      this.tittle = 'Sin Usuarios';
      this.responseMessage = 'La compañia seleccionada no tiene usuarios.';
      this.responseSuccess = false;
      this.showResponseModal = true;
      return;
    }

    this.userTotal = usersTotal;
    this.idCompanyMigrate = id;

    if (nameComapny != '')
      this.nameCompany = nameComapny;

    this.isModalView = !this.isModalView;
    if (this.isModalView) {
      this.companyservice.GetAllUsersFilters(id, '').subscribe(response => {
        if (response.success) {
          this.users = response.data.map((user: any) => ({
            id: user.idUserAccount,
            fullName: user.primaryName,
            color: user.color,
            imageUrl: user.urlImagen,
            email: user.userName,
            rol: user.name ?? 'Sin definir'
          }));
        } else {
          console.warn('Respuesta no exitosa:', response);
          this.users = [];
        }
      });
    }
  }

  SelectColors() {
    if (this.selectedColorIndex == 1) {
      this.dataAddUpdateCompany.colors!.colorOne = this.colorOptions1[0];
      this.dataAddUpdateCompany.colors!.colorTwo = this.colorOptions1[1];
      this.dataAddUpdateCompany.colors!.colorThree = this.colorOptions1[2];
      this.dataAddUpdateCompany.colors!.colorFour = this.colorOptions1[3];
      this.dataAddUpdateCompany.colors!.colorFive = this.colorOptions1[4];
      this.dataAddUpdateCompany.colors!.option = 1;
    }
    else if (this.selectedColorIndex == 2) {
      this.dataAddUpdateCompany.colors!.colorOne = this.colorOptions2[0];
      this.dataAddUpdateCompany.colors!.colorTwo = this.colorOptions2[1];
      this.dataAddUpdateCompany.colors!.colorThree = this.colorOptions2[2];
      this.dataAddUpdateCompany.colors!.colorFour = this.colorOptions2[3];
      this.dataAddUpdateCompany.colors!.colorFive = this.colorOptions2[4];
      this.dataAddUpdateCompany.colors!.option = 2;
    }
    else if (this.selectedColorIndex == 3) {
      this.dataAddUpdateCompany.colors!.colorOne = this.colorOne;
      this.dataAddUpdateCompany.colors!.colorTwo = this.colorTwo;
      this.dataAddUpdateCompany.colors!.colorThree = this.colorThree;
      this.dataAddUpdateCompany.colors!.colorFour = this.colorFour;
      this.dataAddUpdateCompany.colors!.colorFive = this.colorFive;
      this.dataAddUpdateCompany.colors!.option = 3;
    }
    else {

    }
  }

  onCountryChange() {
    this.states = State.getStatesOfCountry(this.selectedCountryCode);
    this.cities = [];
    const selected = this.countries.find(c => c.isoCode === this.selectedCountryCode);

    if (selected) {
      this.dataAddUpdateCompany.country = selected.name;
      this.dataAddUpdateCompany.departament = '';
      this.dataAddUpdateCompany.city = ''
    }
    this.states = State.getStatesOfCountry(this.selectedCountryCode);
  }

  onStateChange() {
    const selected = this.states.find(c => c.isoCode === this.selectedStatesCode);
    if (selected) {
      this.dataAddUpdateCompany.departament = selected.name;
      this.dataAddUpdateCompany.city = ''
    }

    if (this.selectedCountryCode && this.selectedStatesCode) {
      this.cities = City.getCitiesOfState(this.selectedCountryCode, this.selectedStatesCode);
    } else {
      this.cities = [];
    }
  }


  openModal(action: string) {
    this.nameAddUpdate = action;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }



  saveDomain() {
    if (this.newDomainName && this.selectedColor) {
      // Guardar el dominio
      this.displayedDomains.push({
        nameCompany: 'suitextech',
        domain: this.newDomainName,
        tatolUser: 0,
        Status: this.domainStatus,
        dateCreate: new Date().toLocaleDateString(),
        colors: new Colors({
          colorOne: '#1f2937',
          colorTwo: '#374151',
          colorThree: '#4b5563',
          colorFour: '#6b7280',
          colorFive: '#9ca3af'
        })
      });
      this.closeModal(); // Cerrar modal después de guardar
    }
  }

  eliminar(dominio: string) {
    this.companies = this.companies.filter(domain => domain.idClient !== dominio);
    this.closeModalMessage();
  }

  editar(dominio: string) {
    // Lógica de edición
    console.log('Editar dominio:', dominio);
  }

  colorDefaul() {
    this.validateToken();
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.currentColor = this.clientData.ColorOne ?? DEFAULT_COLORS.PRIMARY;
    }
  }

  //Valida si el token es valido por la fecha
  async validateToken() {
    if (!await this.authservice.isTokenValid()) {
      this.MessageTokenInvalidate();
    }
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

  getColorArray(colors: Colors): string[] {
    if (!colors) return [];  // Si colors es undefined o null, retorna un array vacío
    const colorArray: string[] = [];

    // Verifica cada propiedad de colores y agrega solo las válidas
    if (colors.colorOne) colorArray.push(colors.colorOne);
    if (colors.colorTwo) colorArray.push(colors.colorTwo);
    if (colors.colorThree) colorArray.push(colors.colorThree);
    if (colors.colorFour) colorArray.push(colors.colorFour);
    if (colors.colorFive) colorArray.push(colors.colorFive);

    return colorArray;  // Devuelve el array de colores válidos
  }

  get displayedDomains(): Company[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = this.page * this.itemsPerPage;
    return this.companies.slice(startIndex, endIndex);
  }

  // Cambiar la página actual
  setPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
    }
  }

  // Número total de páginas
  get totalPages() {
    return Math.ceil(this.companies.length / this.itemsPerPage);
  }

  handleMouseEnter() {
    this.currentColor = this.clientData.ColorThree;
  }

  handleMouseLeave() {
    this.currentColor = this.clientData.ColorOne;
  }

  closeModalMessage() {
    this.isMessageDelete = false;
  }

  async OpenModalMessage(option: string, id: string) {

    if (option == 'add') {
      this.messageTittle = 'Agregar Compañia'
      this.messageOption = '¿Esta seguro de guardar los datos de la compañia?';
      this.optionDelete = false;
      this.optionUpdate = false;
      this.optionAdd = true;
      this.optionMigrate = false;
      this.idDelete = '';
    }
    if (option == 'update') {
      this.messageTittle = 'Actualizar Compañia'
      this.messageOption = '¿Esta seguro de actualizar los datos de la compañia?';
      this.optionDelete = false;
      this.optionUpdate = true;
      this.optionAdd = false;
      this.optionMigrate = false;
      this.idDelete = '';
    }
    if (option == 'delete') {
      this.messageTittle = 'Eliminar Compañia'
      this.messageOption = '¿Esta seguro de eliminar La compañia?';
      this.optionDelete = true;
      this.optionUpdate = false;
      this.optionAdd = false;
      this.optionMigrate = false;
      this.idDelete = id;
    }
    if (option == 'migrate') {
      this.messageTittle = 'Migrar Usuarios'
      this.messageOption = '¿Esta seguro de migrar los usuarios de compañia?';
      this.optionDelete = false;
      this.optionUpdate = false;
      this.optionAdd = false;
      this.optionMigrate = true;
      this.idDelete = '';
    }

    this.isMessageDelete = !this.isMessageDelete;
  }

  onIpsChange(id: number) {
    if (this.dataAddUpdateCompany.ipAuthorized && id === 2)
      this.dataAddUpdateCompany.ipAuthorized.authorized = false;
    if (this.dataAddUpdateCompany.ipNotAuthorized && id === 1)
      this.dataAddUpdateCompany.ipNotAuthorized.notAuthorized = false;
  }

  onColorChange(number: number): void {

    const normalized1 = this.colorOne.startsWith('#') ? this.colorOne : '#' + this.colorOne;
    const normalized2 = this.colorTwo.startsWith('#') ? this.colorTwo : '#' + this.colorTwo;
    const normalized3 = this.colorThree.startsWith('#') ? this.colorThree : '#' + this.colorThree;
    const normalized4 = this.colorFour.startsWith('#') ? this.colorFour : '#' + this.colorFour;
    const normalized5 = this.colorFive.startsWith('#') ? this.colorFive : '#' + this.colorFive;

    if (number == 1) {
      if (normalized1.length >= 4 && this.isValidHex(normalized1)) {
        this.isHexColorValidOne = true;
        this.colorOne = normalized1;
      } else { this.isHexColorValidOne = false; }
    }

    if (number == 2) {
      if (normalized2.length >= 4 && this.isValidHex(normalized2)) {
        this.isHexColorValidTwo = true;
        this.colorTwo = normalized2;
      } else { this.isHexColorValidTwo = false; }
    }

    if (number == 3) {
      if (normalized3.length >= 4 && this.isValidHex(normalized3)) {
        this.isHexColorValidThree = true;
        this.colorThree = normalized3;
      } else { this.isHexColorValidThree = false; }
    }

    if (number == 4) {
      if (normalized4.length >= 4 && this.isValidHex(normalized4)) {
        this.isHexColorValidFour = true;
        this.colorFour = normalized4;
      } else { this.isHexColorValidFour = false; }
    }

    if (number == 5) {
      if (normalized5.length >= 4 && this.isValidHex(normalized5)) {
        this.isHexColorValidFive = true;
        this.colorFive = normalized5;
      } else { this.isHexColorValidFive = false; }
    }

  }

  isValidHex(hex: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex);
  }


  addEmail() {
    const email = this.emailInput.trim();
    const isValid = this.validateEmail(email);

    if (email && isValid && this.emails.length < 3 && !this.emails.includes(email)) {
      this.emails.push(email);
    }

    this.emailInput = '';
  }

  removeEmail(index: number) {
    this.emails.splice(index, 1);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addEmail();
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addPhone() {
    const code = this.countryCodeInput.trim();
    const number = this.phoneNumberInput.trim();
    const fullNumber = `${code}-${number}`;

    if (code && number && this.validatePhone(code, number) && this.phoneNumbers.length < 3) {
      this.phoneNumbers.push(fullNumber);
      this.countryCodeInput = '';
      this.phoneNumberInput = '';
    }
  }

  removePhone(index: number) {
    this.phoneNumbers.splice(index, 1);
  }

  onPhoneKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addPhone();
    }
  }

  validatePhone(code: string, number: string): boolean {
    const codeRegex = /^\+\d{1,4}$/;
    const numberRegex = /^\d{6,14}$/;
    return codeRegex.test(code) && numberRegex.test(number);
  }

  getCompanyActions(company: any) {
    return [
      {
        icon: this.iconUsers,
        title: 'Usuarios',
        click: () => this.loadUsers(company.idClient!, company.nameCompany!, company.tatolUser!)
      },
      {
        icon: this.iconUpdate,
        title: 'Editar',
        click: () => this.OpenModalAddUpadte(company?.nameCompany, company?.idClient, 1)
      },
      {
        icon: this.iconVisible,
        title: 'Ver',
        click: () => this.OpenModalAddUpadte(company?.nameCompany, company?.idClient, 2)
      },
      {
        icon: this.iconDelete,
        title: 'Eliminar',
        click: () => this.OpenModalMessage('delete', company?.idClient)
      }
    ];
  }

  toggleSelectAll(): void {
    const checked = this.selectAllChecked;
    this.filteredUsers().forEach((user) => (user.selected = checked));

    if (!this.selectAllChecked) {
      this.selectedUserIds = [];
      this.isMigrate = false;
    }
    else {
      this.isMigrate = true;
      this.selectedUserIds = this.users.map(user => user.id);
    }

  }

}
