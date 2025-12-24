import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DEFAULT_COLORS, BASE_URLS } from '../../../config/constants';
import { AuthService } from '../../../core/login.services/auth.service';
import  HeaderComponent  from '../../../shared/component/header/header.component';
import { CustomTooltipDirective } from '../../../shared/directives/custom-tooltip.directive';


@Component({
    selector: 'app-sidebar',
    imports: [
        RouterLink,
        CommonModule,
        CustomTooltipDirective 
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})

export default class SidebarComponent {
  @Output() sidebarToggle = new EventEmitter<boolean>();
  isExpanded = false; 
  isChatsSubmenuOpen = false;
  hoveredItemIndex: number | null = null;
  selectedIndex: number | null = null;

  isCallsSubmenuOpen: boolean = false;
  staticModule: any[] = [];
  domainModule: any = null;
  usersModule: any = null;
  rolModule: any = null;
  permissionModule: any = null;
  mailModule: any = null;
  appModule: any = null;

  domain: boolean = false;
  user: boolean = false;
  rol: boolean = false;
  permission: boolean = false;
  isSubmenuOpen: boolean = false;
  mail: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public clientData: any = {};
  public colorDefaultbar: string = DEFAULT_COLORS.PRIMARY;
  activeItem: string = ''; 
  public colorBase : string = DEFAULT_COLORS.SECONDARY;
  public colorText : string = "#FFFFFF";

  public iconMenu: string = BASE_URLS.URL_FRONT.concat("/icon/default/menu.png");
  public iconYounger: string = BASE_URLS.URL_FRONT.concat("/icon/default/younger.png");
  public iconHome: string = BASE_URLS.URL_FRONT.concat("/icon/default/home.png");
  public iconCompany: string = BASE_URLS.URL_FRONT.concat("/icon/default/companies.png");
  public iconRol: string = BASE_URLS.URL_FRONT.concat("/icon/default/roles.png");
  public iconUsers: string = BASE_URLS.URL_FRONT.concat("/icon/default/users.png");
  public iconAdminUsers: string = BASE_URLS.URL_FRONT.concat("/icon/default/adminUsers.png");
  public iconPermission: string = BASE_URLS.URL_FRONT.concat("/icon/default/permission.png");
  public iconMail: string = BASE_URLS.URL_FRONT.concat("/icon/default/mail.png");
  urlImageBackground = BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");

  urlLogoCompany = BASE_URLS.URL_FRONT.concat("/icon/login/suitextech.png");
  
  ngOnInit(): void {
    this.appModule = localStorage.getItem('appModules');
    this.colorDefaul();
    this.moduleStatic();
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  
  moduleStatic() {
    if (this.appModule) {
      const parsedData = JSON.parse(this.appModule);
      
      if (parsedData && parsedData.modules && Array.isArray(parsedData.modules.static)) {
        parsedData.modules.static.forEach((item: any) => {
          if (item.name) {

            if (item.name.toLowerCase().includes('dominio')) {
              this.domain = true;
              this.domainModule = item; 
            }
           
            if (item.name.toLowerCase().includes('rol')) {
              this.rol = true;
              this.rolModule = item; 
            }

            if (item.name.toLowerCase().includes('usuario')) {
              this.user = true;
              this.usersModule= item; 
            }

            if (item.name.toLowerCase().includes('permiso')) {
              this.permission = true;
              this.permissionModule= item; 
            }

            if (item.name.toLowerCase().includes('mail')) {
              this.mail = true;
              this.mailModule= item; 
            }
          }
        });
      }
    }
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

  isActiveRoute(route: string): boolean {
  return this.router.url.includes(route);
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.sidebarToggle.emit(this.isExpanded);
  }

  toggleChatsSubmenu() {
    this.isChatsSubmenuOpen = !this.isChatsSubmenuOpen;
  }

  onMouseEnter(index: number) {
    this.hoveredItemIndex = index;
  }

  onMouseLeave() {
    this.hoveredItemIndex = null;
  }

  toggleCallsSubmenu() {
    this.isCallsSubmenuOpen = !this.isCallsSubmenuOpen;
  }

  colorDefaul(){
    const storedData = this.authService.getClient();
    
    if (storedData) {
      this.clientData = JSON.parse(storedData);
      this.colorDefaultbar = this.clientData.ColorOne;
      this.colorBase = this.clientData.ColorFour;
      this.colorText= this.clientData.ColorFive;
      this.urlLogoCompany = this.clientData?.urlLogo ?? this.urlLogoCompany;
      this.urlImageBackground = this.clientData?.urlImagen ?? BASE_URLS.URL_FRONT.concat("/icon/login/fondo.png");
    }
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  onItemClick(index: number): void {
    this.selectedIndex = index;
  }

}
