import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/login.services/auth.service';
import { FormsModule } from '@angular/forms';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';
import { DEFAULT_COLORS, BASE_URLS, DATA} from '../../config/constants';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
    selector: 'app-email-recovery',
    imports: [
      CommonModule,
      FormsModule,
      ModalMessageComponent,
      RouterLink,
      RecaptchaModule
    ],
    templateUrl: './email-recovery.component.html',
    styleUrls: ['./email-recovery.component.css']
})
export default class EmailRecoveryComponent {

  buttonBackgroundColor: string = DEFAULT_COLORS.PRIMARY;
  color: string = DEFAULT_COLORS.PRIMARY;
  siteKey: string = DATA.SITEKEY;

  paramValue: string | null = null;
  captchaToken: string | null = null;
  urlImageBackground = '';
  urlLogoCompany = '';
  currentColor: string = ''; 
  user: string = '';
  errorMessage: string = '';
  title: string = '';
  domain: string = '';
  email: string = '';

  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  isEmailValid: boolean = true;  
  isEmailTouched: boolean = false;
  isLoading: boolean = false;
  showCaptcha: boolean = false;
  captchaResolved: boolean = false; 
  operation: boolean= false;

  clientData: any = {};

  constructor( 
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute ){}

  ngOnInit(): void {
    this.showCaptcha = true;
    const email = this.authService.getEmail(); 

    this.route.queryParams.subscribe(params => {
      this.operation = params['operation'] === 'true';
      console.log('¿Olvidó su usuario?', this.operation);
    });

    if (email && email.includes('@')) {
      this.domain = email.split('@')[1]; 
      this.domain = '/'+this.domain
    }

    this.colorDefaul();
  }

  async sendEmailRecovery(){
    this.isLoading = true;

    if (!this.email) {
      this.isLoading = false;
      this.isEmailTouched = true;  
      this.title = 'Campo Vacío';
      this.errorMessage = 'No deje espacios en blanco.';
      this.isModalVisible = true;  
      this.isSuccess = false; 
      return;  
    }

    if (!this.esEmailValido(this.email)) {
      this.isLoading = false;
      this.isEmailTouched = true;  
      this.title = 'Correo Electronico';
      this.errorMessage = 'Ingrese un correo electronico valido.';
      this.isModalVisible = true;  
      this.isSuccess = false; 
      return;  
    }

    if (!this.domain) {
      this.isLoading = false;
      this.isEmailTouched = true;  
      this.title = 'Dominio vacío';
      this.errorMessage = 'No hay algun dominio seleccionado.';
      this.isModalVisible = true;  
      this.isSuccess = false; 
      return;  
    }

    this.domain = this.domain.replace(/^\//, '');

    this.authService.SendEmailRecovery(this.email, this.captchaToken ?? '', this.domain, this.operation).subscribe({
        next: (res) => {
          if (res.success) {
            this.isLoading = false;
            this.isEmailTouched = true;  
            this.title = res.data?.data?.title || 'Operación exitosa';
            this.errorMessage = res.data?.data?.message || 'Operación exitosa';
            this.isModalVisible = true;  
            this.isSuccess = true; 
          } else {
            this.isLoading = false;
            this.isEmailTouched = true;  
            this.title = res.data?.data?.title || 'Error';
            this.errorMessage = res.data?.data?.message || 'Error, no fue posible enviar el correo';
            this.isModalVisible = true;  
            this.isSuccess = false; 
          }
          
          },
          error: (err) => {
            this.title = err?.error?.error?.title || 'Error';
            this.errorMessage = err?.error?.error?.message || 'Error en la solicitud al servidor';
            this.isModalVisible = true;  
            this.isSuccess = false; 
            this.isLoading = false;
          }
        });
  }

  onCaptchaSuccess(token: string | null): void {
    this.captchaResolved = !!token; 
    this.captchaToken = token ?? ''; 
  }

  colorDefaul(){
    const storedData = this.authService.getClient();

    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
      this.urlLogoCompany = this.clientData?.urlLogo ?? BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
      this.currentColor = this.clientData?.ColorOne ?? DEFAULT_COLORS.PRIMARY; 
      this.domain = this.clientData?.domain ?? this.domain;
    } else {
      this.router.navigate(['/login'+this.domain]);
    }
  }

  esEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  closeModal() {
    this.isModalVisible = false;  
    this.isLoading = false;
  }
}
