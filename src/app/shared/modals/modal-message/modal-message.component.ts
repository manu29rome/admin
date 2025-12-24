import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/login.services/auth.service';
import { DEFAULT_COLORS, BASE_URLS, DATA } from '../../../config/constants';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modal-message',
    imports: [CommonModule],
    templateUrl: './modal-message.component.html',
    styleUrl: './modal-message.component.css'
})
export class ModalMessageComponent {

  public iconSuccessful: string = BASE_URLS.URL_FRONT.concat("/icon/default/checkblack.png");
  public iconError: string = BASE_URLS.URL_FRONT.concat("/icon/default/error.png");

  @Input() isVisible: boolean = false;  // Variable para controlar la visibilidad del modal
  @Input() errorMessage: string = '';
  @Input() title: string = '';    // Variable para mostrar el mensaje de error
  @Input() isSuccess: boolean = false;
  @Input() colorOne: string = '';
  @Input() colorTwo: string = '';
  @Input() messageButton: string = '';
  @Input() isLogin: boolean = false;
  @Input() isEmailRecovery: boolean = false;

  isHovered: boolean = false;
  hoverColor: string = '';

  clientData: any = {};

  @Output() closeModalEvent = new EventEmitter<void>();  // Para emitir el evento de cierre

  constructor(private authservice: AuthService,
    private router: Router
  ) {}

 ngOnInit(): void {
    this.colorDefaul();

    if(this.colorOne == null)
      this.colorOne = '#e1775f';
  }

  colorDefaul(){
    const storedData = this.authservice.getClient();

    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.colorOne = this.clientData?.ColorOne ?? this.colorOne;
      this.colorTwo = this.clientData?.ColorTwo ?? this.colorTwo;
      
    } 
  }

  closeModal() {
    this.isHovered = false;
    this.closeModalEvent.emit();  
    if(this.isEmailRecovery){
      this.router.navigate(['/login'+this.clientData?.domain]); 
    }
  }

  logout(){
    this.authservice.logout();
  }
}
