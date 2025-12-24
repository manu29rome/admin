import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/login.services/auth.service';
import { FormsModule } from '@angular/forms';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';
import { DEFAULT_COLORS, BASE_URLS, DATA} from '../../config/constants';
import { RecaptchaModule } from 'ng-recaptcha';

declare var grecaptcha: any; 

@Component({
    selector: 'app-login-two',
    imports: [
        CommonModule,
        FormsModule,
        ModalMessageComponent,
        RecaptchaModule,
        RouterLink
    ],
    templateUrl: './login-two.component.html',
    styleUrl: './login-two.component.css'
})

export default class LoginTwoComponent {

  urlImageBackground = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
  urlLogoCompany = BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
  urlIconVisible = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  urlIconNoVisible = BASE_URLS.URL_FRONT.concat("/icon/login/no-visible-eye.png");

  linkColor: string = DEFAULT_COLORS.PRIMARY;
  linkHoverColor: string = DEFAULT_COLORS.SECONDARY; 
  currentLinkColorForgotPassword: string = this.linkColor; 
  currentLinkColorGoBack: string = this.linkColor; 
  iconColor: string = DEFAULT_COLORS.PRIMARY; 
  buttonBackgroundColor: string = DEFAULT_COLORS.PRIMARY;
  buttonHoverColor: string = DEFAULT_COLORS.SECONDARY; 
  currentColor: string = this.buttonBackgroundColor; 
  siteKey: string = DATA.SITEKEY;

  clientData: any = {};
  apps: any[] = [];

  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  captchaResolved: boolean = false;  
  isLoading: boolean = false;
  isLoadingBack: boolean = false;
  showPassword: boolean = false;
  showCaptcha: boolean = false;
  
  captchaToken: string | null = null;
  selectedAppUrl: string = '';
  errorMessage: string = '';  
  title: string = ''
  user!: string;
  password: string = '';
  token: string = '';
  code: string = '';
  domain: string = '';

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.showCaptcha = true;

    const email = this.authService.getEmail(); 
      if (email && email.includes('@')) {
        this.domain = email.split('@')[1]; 
        this.domain = '/'+this.domain
      }

    this.colorDefaul();
  }

  onCaptchaSuccess(token: string | null): void {
    this.captchaResolved = !!token;
    this.captchaToken = token ?? ''; 
  }

  colorDefaul(){
    const storedData = this.authService.getClient();

    if (storedData) {
      this.clientData = JSON.parse(storedData);

      if (this.clientData) {
        this.apps = JSON.parse(this.clientData.Apps);

        if (this.apps.length > 0) {
          this.selectedAppUrl = this.apps[0].url;
        }
      }
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
      this.urlLogoCompany = this.clientData?.urlLogo ?? BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
      this.currentColor = this.clientData?.ColorOne ?? DEFAULT_COLORS.PRIMARY; 

    } else {
      this.router.navigate(['/login/'+this.domain]);
    }
  }

  resolved(token: string) {
  console.log("Captcha resuelto:", token);
  this.captchaToken = token; // si quieres guardarlo
}

  onCheckboxSelected(url: string): void {
    this.selectedAppUrl = url;
    console.log('Selected from checkbox:', this.selectedAppUrl);
  }

  login(): void {

    this.isLoading = true;

    if (!this.password) { 
      this.isLoading = false;
      this.title = 'Datos incompletos';
      this.errorMessage = 'Escriba su contraseña.';
      this.isModalVisible = true;  
      this.isSuccess = false; 
      return;  
    }

    if (!this.captchaResolved && this.captchaToken == null)  {
      this.isLoading = false;
      this.errorMessage = 'Por favor, completa el captcha';
      this.isModalVisible = true;
      this.isSuccess = false; 
      this.title = 'Error Captcha';
      this.resetCaptcha();
      return;
    }

    this.user = this.authService.getEmail() as string;

    this.authService.loginTwo(this.user, this.password, this.captchaToken ?? '', this.code).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage = response?.error?.message || 'Error desconocido';
          this.title = response?.error?.title || 'Error';
          this.isModalVisible = true;  
          this.isSuccess = true; 
          this.isLoading = false;
          this.resetCaptcha();
        } else {
          this.isLoading = false;
          this.authService.setApp();
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        this.errorMessage = err.error?.error?.message || 'Error en la solicitud al servidor';
        this.isModalVisible = true;  
        this.isSuccess = false; 
        this.title = err?.error?.error?.title || 'Error';
        this.isLoading = false;
        this.resetCaptcha();
      }
    });
  }

  closeModal() {
    this.isModalVisible = false;  
  }

  goback(){
    this.isLoadingBack = true;
    this.authService.loginStar();
    this.router.navigate(['/login'+this.domain]);
  }

  resetCaptcha(): void {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.reset();  
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
