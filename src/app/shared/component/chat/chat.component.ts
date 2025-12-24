import { Component, AfterViewChecked, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { ChatService } from '../../../core/chat.services/chat.service'
import { AuthService } from '../../../core/login.services/auth.service';
import { ModalMessageComponent } from '../../../shared/modals/modal-message/modal-message.component';
import { BASE_URLS } from '../../../config/constants';
import { PickerComponent }  from  '@ctrl/ngx-emoji-mart' ;
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-chat',
    imports: [
        CommonModule,
        FormsModule,
        PickerComponent,
        ImageViewerComponent,
        ModalMessageComponent
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})

export default class ChatComponent {
  
  @ViewChild('messages') private messagesContainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  @ViewChild(ImageViewerComponent) imageViewer!: ImageViewerComponent;
  private hubConnection!: signalR.HubConnection;

  isMinimized: boolean = false;
  isSent: boolean = false;
  isSearching: boolean = false;  
  isGroup: boolean = false;
  showEmojiPicker: boolean = false;
  showEmojiModal: boolean = false;
  isMessageError: boolean = false;
  isGroupListVisible = false;
  isChatSmall: boolean = false;
  isEmpty: boolean = false;
  isFileTooLarge: boolean = false;
  isMessageDelete: boolean = false;
  isHovered: boolean = false;
  isHovered2: boolean = false;
  isModalVisible: boolean = false;  
  isSuccess: boolean = true; 
  isLogin: boolean = false;private userIsInLowerHalf = true;
 
  hoveredChat: number | null = null; 
  maxFileSize = 7 * 1024 * 1024; // 7 MB en bytes
 
  pendingMessages: { idUserReceiver: string, messageContent: string, imageContent: string, token:string, fileContent: string }[] = [];
  pendingMessagesGroup: { idRoom: string, messageContent: string, imageContent: string, token:string, fileContent: string }[] = [];
  chats: any[] = []; 
  groupNames: any[] = []; 
  chatmessage: any[] = []; 
  clientData: any = {};
  selectedChat: any = null;
  selectedEmojis: string[] = [];

  newMessage: string = ''; 
  idMessage: string = ''; 
  idChatRoom: string = ''; 
  idUserReceiver: string = ''; 
  content: string = '';
  pastedImage: string | null = null; 
  searchText: string = ''; 
  selectedFile: string = ''; 
  selectedFileName: string | null = null;
  truncatedFileName: string | null = null;

  linkChatIconSayHello = BASE_URLS.URL_FRONT.concat("/icon/chat/saludo.ico");
  public urlImageBackground = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");

  errorMessage: string = '';  
  colorOneMessage: string = '';
  colorTwoMessage: string = '';
  title: string = ''
  messageButton: string = ''

constructor(
  private chatservice: ChatService, 
  private authservice: AuthService,
  private cdr: ChangeDetectorRef,
  private sanitizer: DomSanitizer){}

ngOnInit() {
  this.colorDefaul();
  this.chatList();
  //conexión SignalR
  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(BASE_URLS.SIGNALR)  
    .withAutomaticReconnect() 
    .build();

  // Iniciar la conexión
  this.hubConnection.start()
  .then(() => { 
    this.hubConnection.invoke('SetUserToken', this.authservice.getToken()?.toString(), false)
    .catch(err => console.error('Error al establecer el token de usuario:', err));
   })
  .catch(err => console.error('Error en la conexión de SignalR:', err));

   //Mensaje eliminado chat de usuarios
  this.hubConnection.on('DeleteMessage', async (idMessage: string, iChat: string) => {
        this.chatmessage.forEach(msg => {
          if (msg.IdChatMessages === idMessage) {
            msg.Content = msg.Content = this.sanitize("<strong>Mensaje Eliminado...</strong>");
            msg.isDelete = true;
            msg.Image = null;
            msg.File = null;
            this.cdr.detectChanges();
            this.chatList(); 
          }});
      });

  //Mensaje eliminado chat de grupos
  this.hubConnection.on('DeleteMessageGroup', async (idMessage: string, idChatGroup: string) => {
    if (idChatGroup === this.idChatRoom) {
        this.chatmessage.forEach(msg => {
          if (msg.IdChatMessages === idMessage) {
            msg.Content = msg.Content = this.sanitize("<strong>Mensaje Eliminado...</strong>");
            msg.isDelete = true;
            msg.Image = null;
            msg.File = null;
            this.cdr.detectChanges();
            this.chatList(); 
          }});
      }});

   //Mensajes vistos
   this.hubConnection.on('ViewMessage', async (idMessage: string, sendId: string) => {
    if (sendId === this.idUserReceiver) {
        this.chatmessage.forEach(msg => {
          if (!msg.IsView && msg.IdStatus) {
            msg.IsView = true;
            this.cdr.detectChanges();
          }});
    this.chatList(); 
      }});

  //Estado del color de Uusario Cuando se conecta y se desconecta
  this.hubConnection.on('StatusLogin', async (color: string, idUser: string) => {
  if ( this.idUserReceiver === idUser) {
    this.selectedChat.color = color;
  }
    this.chatList(); 
  });

  //Escuchar eventos de mensajes recibidos
  this.hubConnection.on('ReceiveMessage', async (message: string, sendId: string, imageContent: string, fileContent: string, idMessage: string) => {
    if (sendId === this.idUserReceiver) {
      this.chatmessage.push({
        IdChatMessages: idMessage,
        Content: message,
        IdStatus: false,
        Image: imageContent,
        File: fileContent,
        CreatedDate: new Date(),
        IsView: true,
        Name: null,
      });
      this.scrollToBottom(true);
      this.cdr.detectChanges();
      this.isEmpty = false;
      let token = this.authservice.getToken()?.toString() ?? '';
      this.hubConnection.invoke('ViewChatUser', idMessage, token, null)
      .then(() => {})
      .catch(err => {
        console.error('Error enviando mensaje por SignalR:', err)
        });
    }
    this.chatList();
    this.chatservice.playNotificationSound();
  });

  //Escuchar eventos de mensajes recibidos a un grupo
  this.hubConnection.on('ReceiveMessageGroup', async (messageContent: string, imageContent: string, idRoom: string, name: string, fileContent: string, idMessage: string) => {
    if(this.idChatRoom == idRoom){
      this.chatmessage.push({
        IdChatMessages: idMessage,
        Content: messageContent,
        IdStatus: false,
        Image: imageContent,
        File: fileContent,
        CreatedDate: new Date(),
        IsView: true,
        Name: name,
      });
      this.scrollToBottom(false);
      this.isEmpty = false;
      this.chatservice.groupView(idRoom).subscribe({
        next: response => {
          if (response.success) {}}
      });
      this.cdr.detectChanges();
    }
    
    this.chatList();
    this.chatservice.playNotificationSound();
  });

  //Conexión perdida
  this.hubConnection.onreconnecting(error => {
    console.warn('Conexión perdida. Intentando reconectar...', error);
  });

  //Mensajes pendientes por enviar
  this.hubConnection.onreconnected(connectionId => {
    this.pendingMessages.forEach(msg => {
      this.hubConnection.invoke('SendMessageToUser', msg.idUserReceiver, msg.messageContent, msg.imageContent, msg.token)
        .then(() => {})
        .catch(err => {
          console.error('Error enviando mensaje pendiente:', err);
        });
    });

  //Mensajes pendientes por enviar a grupos
  this.pendingMessagesGroup.forEach(msg => {
      this.hubConnection.invoke('SendMessageToGroup', msg.idRoom, msg.messageContent, msg.imageContent, msg.token)
        .then(() => {})
        .catch(err => {
          console.error('Error enviando mensaje pendiente:', err);
        });
    });

    this.pendingMessages = [];
    this.pendingMessagesGroup = [];
  });

  //Conexión cerrada.
  this.hubConnection.onclose(error => {
    console.error('Conexión cerrada. No se pudo reconectar:', error);
    setTimeout(() => {
      this.hubConnection.start()
        .then(() => console.log('Reconectado manualmente a SignalR'))
        .catch(err => console.error('Error reconectando manualmente a SignalR:', err));
    }, 5000); 
  });
}

//Valida si el token es valido por la fecha
async validateToken(){
  if(!await this.authservice.isTokenValid())
    {
        this.MessageTokenInvalidate();
    }
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

//Permite ingresar html 
sanitize(content: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(content);
}

//Validar y comvertir Archivo
uploadFile(event: Event): void {
  this.validateToken();
  const input = event.target as HTMLInputElement;
  this.pastedImage = null;

  if (input.files && input.files.length > 0) 
    {
      const file = input.files[0];

      if (file.size > this.maxFileSize) {
        this.isFileTooLarge = true;
        return;  
      }

      this.selectedFileName = file.name;
      this.truncatedFileName = file.name.length > 40 ? file.name.substring(0, 40) + '...' : file.name;
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedFile = reader.result as string;
        const formData = new FormData();
        formData.append('file', this.selectedFile);
      };
    reader.readAsDataURL(file); 
  }
}

truncateFileName(url: string): string {
  const fileName = url.split('/').pop() || url;
  return fileName.length > 40 ? fileName.substring(0, 40) + '...' : fileName;
}

//Limpiar el nombre del archivo
clearSelectedFile(): void {
  this.selectedFile = ''; 
  this.selectedFileName = null;
}

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

//Función para cerrar el contenedor de emojis
closeEmojiPicker() {
  this.showEmojiPicker = false;
}

// Función para agregar el emoji seleccionado al input
addEmoji(event: any) {
  const emoji = event.emoji.native; 
  this.newMessage += emoji; 
}

//Genera valores Guid
generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Funcion enviar mensajes
async sendMessage(): Promise<void> {
  this.validateToken();
  let messageContent = this.newMessage?.trim() ?? '';
  let imageContent = this.pastedImage ?? ''; 
  let fileContent = this.selectedFile ?? ''; 
  let urlimage = '';
  let urlfile = '';
  this.isEmpty = false;
  const idMessage = this.generateGuid();

  // Enviar la imagen si existe
  if (imageContent) {
    try {
      const imageResponse = await this.chatservice.imageBase(imageContent, 'chat','chat').toPromise();
      if (imageResponse.success) {
        urlimage = imageResponse.data;
      }} catch (error) {console.error('Error al enviar la imagen:', error);

        if (typeof error === 'object' && error !== null && 
          'error' in error && typeof (error as any).error === 'object' &&
          'message' in (error as any).error) {
          const errorMessage = (error as any).error.message;
          if (typeof errorMessage === 'string' && errorMessage.includes("Token Invalido")) {
            this.MessageTokenInvalidate();}}
      }
    }

  // Enviar el archivo si existe
  if (this.selectedFile) {
    try {
      const fileResponse = await this.chatservice.fileBase(this.selectedFile, 'client/configure', 'chat').toPromise();
      if (fileResponse.success) {
        urlfile = fileResponse.data;
      }
    } catch (error) {console.error('Error al enviar el archivo:', error);}
    }

  if ((this.idUserReceiver || this.isGroup) 
      && (messageContent !== '' || imageContent !== '' || fileContent !== '')) {
      this.eventMessage(idMessage, messageContent, urlimage, urlfile);
      this.newMessage = '';
      this.selectedFile = '';
      this.selectedFileName = null;
      this.pastedImage = ''; 
      this.truncatedFileName = null;
      
      this.chatmessage.push({
        IdChatMessages: idMessage,
        Content: messageContent,
        IdStatus: true,
        Image: imageContent,
        File: urlfile,
        CreatedDate: new Date(),
        IsView: false,
        Name: this.isGroup,
        isError: this.isMessageError,
        isDelete: false
      });
      
      this.scrollToBottom(false);
      this.clearPastedImage();
    }
  }

  eventMessage(idMessage: string, messageContent: string, urlImage: string,  urlFile: string){
  const token = this.authservice.getToken()?.toString() ?? '';
  if(!this.isGroup){
    this.hubConnection.invoke('SendMessageToUser', idMessage, this.idUserReceiver, messageContent, urlImage, token, urlFile)
      .then(() => {this.isMessageError = false;})
      .catch(err => {
        console.error('Error enviando mensaje por SignalR:', err);
        this.isMessageError = true;
        this.pendingMessages.push({
          idUserReceiver: this.idUserReceiver,
          messageContent: messageContent,
          imageContent: urlImage,
          token: token,
          fileContent: urlFile,
        });
      });     
  }
  else{
    this.hubConnection.invoke('SendMessageToGroup', idMessage, this.idChatRoom, messageContent, urlImage, token, urlFile )
      .then(() => {this.isMessageError = false;})
      .catch(err => {
        console.error('Error enviando mensaje por SignalR:', err);
        this.isMessageError = true;
        this.pendingMessagesGroup.push({
          idRoom: this.idChatRoom,
          messageContent: messageContent,
          imageContent: urlImage,
          token: token,
          fileContent: urlFile
        });
      });   
  }
}

//Funcion para reducir tamaño imagen pantallazo 0.5MB
handlePaste(event: ClipboardEvent): void {
  const clipboardData = event.clipboardData;
  this.selectedFileName = null;

  if (clipboardData) {
    const items = clipboardData.items;
    const itemsArray = Array.from(items);

    for (const item of itemsArray) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();

        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const image = new Image();
            image.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (ctx) {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                
                const compressImage = (image: HTMLCanvasElement, quality: number): string => {
                  return image.toDataURL('image/jpeg', quality);
                };
                let quality = 1.0;  
                let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                
                while (compressedDataUrl.length > 500 * 1024 && quality > 0.1) {
                  quality -= 0.1;
                  compressedDataUrl = compressImage(canvas, quality);
                }
                this.pastedImage = compressedDataUrl;  
              }
            };
            image.src = e.target.result;
          };
          reader.readAsDataURL(file);
        } else { console.warn('No se pudo obtener el archivo de la imagen.');}
      }
    }
  } else {console.warn('Clipboard data is null.');}
}

//Limpiar variable de imagen
clearPastedImage(): void {
  this.pastedImage = null; 
}

scrollToBottom(forceScroll: boolean = false): void {
  const container = this.messagesContainer?.nativeElement;
  if (!container) return;

  // Solo hacer scroll si el usuario está en la mitad inferior o si se fuerza
  if (forceScroll || this.userIsInLowerHalf) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }
}

onUserScroll(): void {
  const container = this.messagesContainer?.nativeElement;
  if (!container) return;

  // Verificar si el usuario está en la mitad inferior del chat
  this.userIsInLowerHalf =
    container.scrollTop + container.clientHeight >= container.scrollHeight * 0.5;
}

//Funcion mostrar input buscador
async toggleSearch(): Promise<void> {
  this.isSearching = !this.isSearching;
  this.searchText = '';  
  if (this.isSearching) {
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    });
  }
}

// Filtra la lista de chats según el texto de búsqueda
filteredChats(): any[] {
  if (this.searchText.trim() === '') {
    return this.chats;
  } else {
    return this.chats.filter(chat => chat.primaryName.toLowerCase().includes(this.searchText.toLowerCase()));
  }
}

//Funcion listar usarios chat
async chatList(){
  this.validateToken();
  this.chats = [];
  this.chatservice.chatList().subscribe({
    next: (response) => {
      if (response.success) {
        this.chats = response.data.map((chat: any) => ({
          primaryName: chat.primaryName,
          color: chat.color,
          nameStatus: chat.nameStatus,
          urlImagen: chat.urlImagen,
          content: chat.content,
          idChatRoom: chat.idChatRoom,
          createdDate: chat.createdDate,
          idUserAccount: chat.idUserAccount,
          isGroup: chat.isGroup,
          isView: chat.isView
        }));
      }
    },
    error: (error) => {console.error('Error fetching chat list:', error);
      if (typeof error === 'object' && error !== null && 
        'error' in error && typeof (error as any).error === 'object' &&
        'message' in (error as any).error) {
        const errorMessage = (error as any).error.message;
        if (typeof errorMessage === 'string' && errorMessage.includes("Token Invalido")) {
          this.MessageTokenInvalidate();}}
    }
  });
}

//Funcion para consultar mensajes de chat seleccionado
private chat(idRoom: string, isGroup: boolean){
  this.validateToken();
  this.chatservice.chat(idRoom, isGroup).subscribe({
    next: (response) => {
      if (response.success) {
        this.chatmessage = response.data.map((messsage: any) => ({
          IdChatMessages: messsage.IdChatMessages,
          Content: messsage. Content,
          CreatedDate: messsage.CreatedDate,
          Image: messsage.ContentImage,
          File: messsage.ContentFile,
		      IdStatus: messsage.IdStatus,
          IsView: messsage.IsView,
          Name: messsage.Name
        }));

        if(this.chatmessage.length > 0)
          this.isEmpty = false;
        else
          this.isEmpty = true;
      }
    },
    error: (err) => {
      console.error('Error fetching chat:', err);
    }
  }); 
}

colorDefaul(){
    this.validateToken();
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
    } 
  }

  removeImage(): void {
    this.pastedImage = null;
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  async close(): Promise<void> {
    document.querySelector('app-chat')?.classList.add('hidden');
    this.searchText = '';
    this.isGroup = false;
    this.idChatRoom = '';
    this.isSearching = false;
    this.idUserReceiver = '';
    this.newMessage = '';
    this.chatmessage = [];
    this.isGroupListVisible = false;
    this.groupNames = [];
    this.isEmpty = false;
    this.closeEmojiPicker();
  }

  async openChat(chat: any) {
    this.validateToken();
    this.groupNames = [];
    this.selectedChat = chat;
    this.idUserReceiver = chat.idUserAccount;
    this.idChatRoom = chat.idChatRoom;
    this.isSearching = false;
    this.isGroup = chat.isGroup;
    this.searchText = '';
    this.isMessageError = false;
    this.chat(chat.idChatRoom, this.isGroup);
    setTimeout(() => this.scrollToBottom(), 200);
    this.closeEmojiPicker();
      let token = this.authservice.getToken()?.toString() ?? '';
      this.hubConnection.invoke('ViewChatUser', chat.idChatRoom, token, this.idUserReceiver)
      .then(() => {})
  }

  backToChatList() {
    this.chatmessage = [];
    this.idUserReceiver = '';
    this.selectedChat = null;
    this.newMessage = '';
    this.idChatRoom = '';
    this.isGroupListVisible = false;
    this.isEmpty = false;
    this.closeEmojiPicker();
    this.chatList();
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); 
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
  }

  //Hover con el mouse
  onMouseOver(chatIndex: number) {
    this.hoveredChat = chatIndex; 
  }

  //Hover con el mouse cuando no esta encima 
  onMouseOut() {
    this.hoveredChat = null;
  }

  //Modal de imagen
  showImageViewer(imageUrl: string) {
    this.imageViewer.openViewer(imageUrl);
  }

  //Cerrar modal
  closeModal() {
    this.isModalVisible = false;  
  }

  // Alternar visibilidad del recuadro
  async toggleGroupList() {
    this.groupNames = [];
    this.isGroupListVisible = !this.isGroupListVisible;

    if(this.isGroupListVisible)
    {
      this.chatservice.GroupNameList(this.idChatRoom , true).subscribe({
        next: (response) => {
          if (response.success) {
            this.groupNames = response.data.map((group: any) => ({
              Color: group.color,
              IdUser: group.idUserAccount,
              Name: group.primaryName,
              Image: group.urlImagen
            }));
          }
        },
        error: (err) => {
          console.error('Error fetching chat:', err);
        }
      }); 
    }
  }

  //Se abre sub menu de opciones de un mensaje
  toggleMenu(message: any) {
    this.chatmessage.forEach(msg => {
      if (msg !== message) msg.showMenu = false; 
    });
    message.showMenu = !message.showMenu;
  }

  //Abrir modal de eliminar
  deleteMessage(message: any, idMessage: string) {
    this.isMessageDelete = true;
    this.idMessage = idMessage;
    message.showMenu = false;
  }

  //Valida el tamaño maximo del archivo
  checkFileSize(fileSize: number) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    this.isFileTooLarge = fileSize > maxSize;
  }

  // Cerrar mensaje de error
  closeFileSizeWarning() {
    this.isFileTooLarge = false;
  }

  //Cierra el modal de eliminar
  closeModalMessageDelete(){
    this.isHovered = false;
    this.isHovered2 = false;
    this.isMessageDelete = false;
  }

  //Funcion para eliminar los mensajes
  async DeleteMessages(idMessage: string) {
    this.validateToken();
    let token = this.authservice.getToken()?.toString() ?? '';
      this.hubConnection.invoke('DeleteMessageAsync', idMessage, this.isGroup, this.idUserReceiver, this.idChatRoom, token)
      .then(() => {})
    this.isMessageDelete = false;
  }
}
