import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/login.services/auth.service';
import { FormsModule } from '@angular/forms';
import { ModalMessageComponent } from '../../shared/modals/modal-message/modal-message.component';
import { DEFAULT_COLORS, BASE_URLS } from '../../config/constants';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        FormsModule,
        ModalMessageComponent,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export default class LoginComponent {

  buttonBackgroundColor: string = DEFAULT_COLORS.PRIMARY;
  color: string = DEFAULT_COLORS.PRIMARY;

  paramValue: string | null = null;
  urlImageBackground: string = '';
  urlLogoCompany: string = '';
  currentColor: string = ''; 
  user: string = '';
  errorMessage: string = '';
  title: string = '';

  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  isEmailValid: boolean = true;  
  isEmailTouched: boolean = false;
  isLoading: boolean = false;

  clientData: any = {};

  constructor( 
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute ){}

  ngOnInit(): void {
    this.authService.loginStar();
    this.getClient();
    // Actualiza el color CSS dinámicamente
    if (this.clientData?.ColorOne) {
      document.documentElement.style.setProperty('--primary-color', this.clientData.ColorOne);
    }
  }

  colorDefaul(){
    const storedData = this.authService.getClient();

    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
      this.urlLogoCompany = this.clientData?.urlLogo ?? BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
      this.currentColor = this.clientData?.ColorOne ?? DEFAULT_COLORS.PRIMARY; 
    } else {
      this.router.navigate(['/login']);
    }
  }

  async getClient(){
    this.route.params.subscribe(params => {
      if (params['code']) {
        this.paramValue = params['code'];
      }
    });

    if(this.paramValue){
      this.authService.getClientData(this.paramValue).subscribe({
        next: response => {
          if (response.success) {
            this.colorDefaul();
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

  esEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  login(): void {

    this.isLoading = true;
    if (!this.user) {
      this.isLoading = false;
      this.isEmailTouched = true;  
      this.title = 'Campo Vacío';
      this.errorMessage = 'No deje espacios en blanco.';
      this.isModalVisible = true;  
      this.isSuccess = false; 
      return;  
    }

    if (!this.esEmailValido(this.user)) {
      this.isLoading = false;
      this.isEmailTouched = true;  
      this.title = 'Correo Electronico';
      this.errorMessage = 'Ingrese un correo electronico valido.';
      this.isModalVisible = true;  
      this.isSuccess = false; 
      return;  
    }

    this.authService.login(this.user).subscribe({
      next: response => {
        if (!response.success) {
          this.isLoading = false;
          this.errorMessage = response.error.Message || 'Error desconocido';
          this.isModalVisible = true;  
          this.isSuccess = true; 
        } else {
          this.isLoading = false;
          this.authService.addEmail(this.user);
          this.router.navigate(['/logintwo']);
        }
      },
      error: err => {
        this.title = err?.error?.error?.title || 'Error';
        this.errorMessage = err?.error?.error?.message || 'Error en la solicitud al servidor';
        this.isModalVisible = true;  
        this.isSuccess = false; 
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.isModalVisible = false;  
    this.isLoading = false;
  }
}
