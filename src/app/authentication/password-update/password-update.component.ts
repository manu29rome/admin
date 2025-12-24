import { Component, OnInit } from '@angular/core';
import { DEFAULT_COLORS, BASE_URLS} from '../../config/constants';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/login.services/auth.service';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidatePasswordRule } from '../../models/password.validate.model';

@Component({
  selector: 'app-password-update',
  imports: [
    RouterLink,
    ModalMessageComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './password-update.component.html',
  styleUrl: './password-update.component.css'
})
export default class PasswordUpdateComponent {

  urlImageBackground = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
  urlLogoCompany = BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
  urlIconVisible = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  urlIconNoVisible = BASE_URLS.URL_FRONT.concat("/icon/login/no-visible-eye.png");
  iconSuccessfull = BASE_URLS.URL_FRONT.concat("/icon/default/successful.png");
  iconError = BASE_URLS.URL_FRONT.concat("/icon/default/errorRed.png");
  iconWarnning = BASE_URLS.URL_FRONT.concat("/icon/default/warnning.png");

  linkColor: string = DEFAULT_COLORS.PRIMARY;
  linkHoverColor: string = DEFAULT_COLORS.SECONDARY; 
  currentLinkColorForgotPassword: string = this.linkColor; 
  currentLinkColorGoBack: string = this.linkColor; 
  iconColor: string = DEFAULT_COLORS.PRIMARY; 
  buttonBackgroundColor: string = DEFAULT_COLORS.PRIMARY;
  buttonHoverColor: string = DEFAULT_COLORS.SECONDARY; 
  currentColor: string = this.buttonBackgroundColor; 

  mayusculaRule: ValidatePasswordRule = new ValidatePasswordRule();
  minusculaRule: ValidatePasswordRule = new ValidatePasswordRule();
  numeroRule: ValidatePasswordRule = new ValidatePasswordRule();
  especialRule: ValidatePasswordRule = new ValidatePasswordRule();
  caracteresMinRule: ValidatePasswordRule = new ValidatePasswordRule();
  caracteresMaxRule: ValidatePasswordRule = new ValidatePasswordRule();
  palabrasNoPermitidasRule: ValidatePasswordRule = new ValidatePasswordRule();
  noUsarAnterioresRule: ValidatePasswordRule = new ValidatePasswordRule();
  clientData: any = {};
  apps: any[] = [];

  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  isLoading: boolean = false;
  showPassword: boolean = false;
  mayuscula: boolean = false;
  minuscula: boolean = false;
  numero: boolean = false;
  especial: boolean = false;
  caracteresMin: boolean = false;
  caracteresMax: boolean = false;
  palabrasNoPermitidas: boolean = true;
  equalsPassword: boolean = false;
  showPalabrasModal: boolean = false;
  responseSuccess: boolean = true;
  showResponseModal: boolean = false;

  idUser: string | null = null;
  domain: string | null = null;
  errorMessage: string = '';  
  title: string = ''
  password: string = '';
  passwordTwo: string = '';
  tittle: string = '';
  responseMessage: string = '';

  constructor(
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getClient();
  }

  get allValid(): boolean {
    return (
      this.mayuscula &&
      this.minuscula &&
      this.numero &&
      this.especial &&
      this.caracteresMin &&
      this.caracteresMax &&
      this.palabrasNoPermitidas &&
      this.equalsPassword
    );
  }

  openPalabrasModal(): void {
    this.showPalabrasModal = true;
  }

  closePalabrasModal(): void {
    this.showPalabrasModal = false;
  }

  togglePalabrasModal() {
    this.showPalabrasModal = !this.showPalabrasModal;
  }

  async updatePassword(){
    this.isLoading = true;
    this.authService.updatePassword(this.idUser ?? '', this.domain ?? '', this.password).subscribe({
        next: response => {
          if (response.success) {
            this.tittle = 'Éxito';
            this.responseMessage = 'Operación realizada con éxito. Inicie sesión para continuar.';
            this.responseSuccess = true;
            this.isLoading = false;
          } else {
            this.tittle = 'Error';
            this.responseMessage = 'Operación no éxito. Escribele a soporte por favor.';
            this.responseSuccess = false;
            this.isLoading = false;
          }
          this.showResponseModal = true;
        }
      });
  }

  login(){
    this.router.navigate(['/login'+this.domain]);
  }

  async getClient(){
    this.idUser = this.route.snapshot.queryParamMap.get('id');
    this.domain = this.route.snapshot.queryParamMap.get('d');

    if(this.domain){

      this.authService.getClientData(this.domain).subscribe({
        next: response => {
          if (response.success) {
            this.colorDefaul();
          } 
        }
      });

      this.authService.ValidatePassword(this.idUser ?? '', this.domain).subscribe({
        next: (response) => {
          if (response.success) {
            const rules: ValidatePasswordRule[] = response.data.data;

            if (rules == null || rules.length === 0) {
              this.tittle = 'Error';
              this.responseMessage = 'Su token ya vencio vuelvalo a solicitar para actualizar la contraseña';
              this.responseSuccess = false;
              this.isLoading = false;
              this.showResponseModal = true;
            } 
          
            // Filtrar según descripción
            this.mayusculaRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5B36985A') || new ValidatePasswordRule();
            this.minusculaRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5B25874A') || new ValidatePasswordRule();
            this.especialRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5B14785A') || new ValidatePasswordRule();
            this.numeroRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5B32145A') || new ValidatePasswordRule();
            this.noUsarAnterioresRule = rules.find(r => r.idConfigureValidationPassword === '26F6064A-585F-40E3-93EF-243D3652144A') || new ValidatePasswordRule();
            this.caracteresMinRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5B78945A') || new ValidatePasswordRule();
            this.caracteresMaxRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5B35789A') || new ValidatePasswordRule();
            this.palabrasNoPermitidasRule = rules.find(r => r.idConfigureValidationPassword === '25F6064A-545F-40E3-93EF-243D5789512A') || new ValidatePasswordRule();

            this.validateStatusPassword();
          }
          else{
            this.router.navigate(['/login'+this.domain]);
          }
        }
      });
    }
    else{
      this.urlImageBackground = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
      this.urlLogoCompany = BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
      this.currentColor = DEFAULT_COLORS.PRIMARY;
    } 
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log('Letra ingresada:', value);
    this.equalsPassword = this.password === this.passwordTwo;
    this.validatePassword(value ?? '');
  }

  onInputChangeTwo(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.equalsPassword = this.password === this.passwordTwo;
  }

  validatePassword(value: string){

    if(this.mayusculaRule.isActive)
      this.mayuscula = /[A-Z]/.test(value);

    if(this.mayusculaRule.isActive)
      this.minuscula = /[a-z]/.test(value);

    if(this.numeroRule.isActive)
      this.numero = /[0-9]/.test(value);

    if(this.especialRule.isActive)
      this.especial = /[^A-Za-z0-9]/.test(value);

    if(this.caracteresMaxRule.isActive)
      this.caracteresMax = value.length <= Number(this.caracteresMaxRule?.value);

    if(this.caracteresMinRule.isActive)
      this.caracteresMin = value.length >= Number(this.caracteresMinRule?.value);

    if(this.palabrasNoPermitidasRule.isActive )
    {
      if (this.palabrasNoPermitidasRule?.word?.some(w => this.password.toLowerCase().includes(w.word.toLowerCase()))) 
        this.palabrasNoPermitidas = false;
    }
      
  }

  async validateStatusPassword(){
    this.mayuscula = this.mayusculaRule.isActive ? false : true;
    this.minuscula = this.minusculaRule.isActive ? false : true;
    this.numero = this.numeroRule.isActive ? false : true;
    this.especial = this.especialRule.isActive ? false : true;
    this.caracteresMax = this.caracteresMaxRule.isActive ? false : true;
    this.caracteresMin = this.caracteresMinRule.isActive ? false : true;
  }

  colorDefaul(){
    const storedData = this.authService.getClient();

    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
      this.urlLogoCompany = this.clientData?.urlLogo ?? BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
      this.currentColor = this.clientData?.ColorOne ?? DEFAULT_COLORS.PRIMARY; 
      this.domain = this.clientData?.domain ?? this.domain;
    } 
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  closeModal() {
    this.isModalVisible = false;  
  }

}
