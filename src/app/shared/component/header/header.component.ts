import { Component, Input, OnChanges, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../core/login.services/auth.service';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DEFAULT_COLORS } from '../../../config/constants';
import * as signalR from '@microsoft/signalr';
import { BASE_URLS } from '../../../config/constants';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export default class HeaderComponent{

  constructor( 
    private authService: AuthService,
    private router: Router){
    }
  private hubConnection!: signalR.HubConnection;
  @Input() expanded!: boolean;

  public borderColor: string = DEFAULT_COLORS.SECONDARY;
  public clientData: any = {};
  public currentColor: string = DEFAULT_COLORS.PRIMARY;
  public currentColorIcon: string = DEFAULT_COLORS.PRIMARY;
  public buttonHoverColor: string = DEFAULT_COLORS.SECONDARY; 
  public borderHoverColor: string = DEFAULT_COLORS.SECONDARY; 
  public currentBackgroundColor : string = 'white'; 
  public currentTextColor : string = DEFAULT_COLORS.SECONDARY; 
  isExpanded = false; 

  public iconLogout: string = BASE_URLS.URL_FRONT.concat("/icon/default/logout.png");
  public iconBell: string = BASE_URLS.URL_FRONT.concat("/icon/default/bell.png");
  public urlImageBackground = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
  public nameRoute: string = 'dashboard';

  isModalOpen = false;  // Controla si el modal está abierto o no
  userProfileImage = '';

  ngOnInit(): void {
    this.colorDefaul();
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(BASE_URLS.SIGNALR)  
        .withAutomaticReconnect() 
        .build();
    
         // Iniciar la conexión
        this.hubConnection.start()
        .then(() => {
        console.log('Conectado a SignalR');
        this.hubConnection.invoke('SetUserToken', this.authService.getToken()?.toString(), true);});
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

  colorDefaul(){
    const storedData = this.authService.getClient();
    
    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.borderColor = this.clientData.ColorOne ?? DEFAULT_COLORS.PRIMARY; 
      this.currentColor = this.clientData.ColorOne ?? DEFAULT_COLORS.PRIMARY;  
      this.currentColorIcon = this.clientData.ColorOne ?? DEFAULT_COLORS.PRIMARY;
      this.buttonHoverColor = this.clientData.ColorTwo ?? DEFAULT_COLORS.PRIMARY;
      this.borderHoverColor = this.clientData.ColorTwo ?? DEFAULT_COLORS.PRIMARY;  
      this.currentTextColor = this.clientData.ColorFive ?? DEFAULT_COLORS.PRIMARY;  
      this.userProfileImage = localStorage.getItem('userData') ?? 'https://randomuser.me/api/portraits/men/2.jpg';
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
    } 
  }

   toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

   closeModal(event?: MouseEvent) {
    this.isModalOpen = false;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);  // Cambia la ruta según tu configuración
    this.isModalOpen = false;  // Cierra el modal después de navegar
  }

  async logOut() {
    await this.desconectarSignalR(); // Asegurar que SignalR se desconecte antes 
    this.authService.logout();
  }
  
  private async desconectarSignalR() {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('SignalR ya estaba desconectado o no estaba inicializado.');
      return;
    }
  
    try {
      await this.hubConnection.invoke('DisconnectUser', this.authService.getToken()?.toString());
      await this.hubConnection.stop();
    } catch (error) {
      console.error('Error al desconectar usuario de SignalR:', error);
    }
  }
}
