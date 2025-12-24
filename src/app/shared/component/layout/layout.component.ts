import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import HeaderComponent from '../header/header.component';
import SidebarComponent from '../sidebar/sidebar.component';
import FooterComponent from '../footer/footer.component';
import { AuthService } from '../../../core/login.services/auth.service';
import { ChatService } from '../../../core/chat.services/chat.service'
import { DEFAULT_COLORS, BASE_URLS } from '../../../config/constants';
import ChatComponent from '../chat/chat.component';
import * as signalR from '@microsoft/signalr';
import { ModalMessageComponent } from '../../../shared/modals/modal-message/modal-message.component';

@Component({
    selector: 'app-layout',
    imports: [
        HeaderComponent,
        SidebarComponent,
        RouterOutlet,
        CommonModule,
        ChatComponent,
        ModalMessageComponent
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})

export default class LayoutComponent {
  private hubConnection!: signalR.HubConnection;
  @ViewChild('boton', { static: true }) boton!: ElementRef;

  constructor(private chatservice: ChatService, 
    private authService: AuthService) {}

  clientData: any = {};
  isChatOpen = false;
  isExpanded = false;
  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  isLogin: boolean = false;
  isMenuOpen: boolean = true;

  errorMessage: string = '';  
  colorOneMessage: string = '';
  colorTwoMessage: string = '';
  title: string = ''
  messageButton: string = ''
  colorDefaultLayout: string = DEFAULT_COLORS.SECONDARY; 
  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconChat: string = BASE_URLS.URL_FRONT.concat("/icon/default/chat.png");
  public iconBackground: string = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
  public iconYounger: string = BASE_URLS.URL_FRONT.concat("/icon/default/younger.png");

  audio: HTMLAudioElement | undefined;


  ngOnInit(): void {
    this.boton.nativeElement.click();

    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(BASE_URLS.SIGNALR)  
    .withAutomaticReconnect() 
    .build();

     // Iniciar la conexión
    this.hubConnection.start()
    .then(() => {
    console.log('Conectado a SignalR');
    this.hubConnection.invoke('SetUserToken', this.authService.getToken()?.toString());});

    this.hubConnection.on('ReceiveMessage', async (message: string, sendId: string, imageContent: string, fileContent: string, idMessage: string) => 
      {this.chatservice.playNotificationSound();});

    this.hubConnection.on('ReceiveMessageGroup', async (messageContent: string, imageContent: string, idRoom: string, name: string, fileContent: string) => 
      {this.chatservice.playNotificationSound();});

    this.colorDefaul();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  onSidebarToggle(expanded: boolean) {
    this.isExpanded = expanded;
  }

  colorDefaul(){
    const storedData = this.authService.getClient();
    
    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.colorDefaultLayout = this.clientData.ColorFive;
      //this.iconBackground = this.clientData.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
    } 
  }
  
  async openChat(): Promise<void> {
    if(!await this.authService.isTokenValid())
      this.messageValidateToken();
    else
      this.isChatOpen = !this.isChatOpen;
  }

  playNotificationSound() {
    this.audio = new Audio(BASE_URLS.URL_SOUND_NOTIFICATION);
  this.audio.volume = 0;
  this.audio.play().then(() => {
    this.audio!.volume = 1;
  }).catch(err => console.warn('Audio no desbloqueado aún:', err));
  }

  async messageValidateToken(){
        this.title = 'Token Inválido';
        this.errorMessage = 'El token ha vencido. Por favor, inicie sesión nuevamente.';
        this.isModalVisible = true;  
        this.isSuccess = false; 
        this.messageButton = "Cerrar Sesion";
        this.colorOneMessage = "#ff5733";
        this.colorTwoMessage = "#ff5733";
        this.isLogin = true;
        return;
  }

}
