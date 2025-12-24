import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DEFAULT_COLORS, BASE_URLS, DATA } from '../../config/constants';
import { AuthService } from '../../core/login.services/auth.service';
import { CompanyService } from '../../core/company.services/company.service';
import { MailService } from '../../core/mail.service/mail.service';
import { Mail } from '../../models/mail.model';


@Component({
  selector: 'app-mail',
  imports: [
    FormsModule,
    CommonModule 
  ],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.css'
})
export default class MailComponent {

  public iconEditWhite: string = BASE_URLS.URL_FRONT.concat("/icon/default/editWhite.png");
  public iconMailWhite: string = BASE_URLS.URL_FRONT.concat("/icon/default/mailWhite.png");
  public iconUpdate: string = BASE_URLS.URL_FRONT.concat("/icon/default/update.png");
  public iconVisible: string = BASE_URLS.URL_FRONT.concat("/icon/login/visible-eye.png");
  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconSave: string = BASE_URLS.URL_FRONT.concat("/icon/default/save.png");
  public iconDelete: string = BASE_URLS.URL_FRONT.concat("/icon/default/delete.png");
  public iconSuccessful: string = BASE_URLS.URL_FRONT.concat("/icon/default/checkblack.png");
  public iconError: string = BASE_URLS.URL_FRONT.concat("/icon/default/error.png");

  htmlContent: string = '';
  title: string = ''
  messageButton: string = ''
  errorMessage: string = '';  
  responseMessage: string = '';
  tittle: string = '';
  nameTemplate: string = '';
  idCompany: string = '';
  descriptionTemplate: string = '';
  messageOption: string = '';
  messageTittle: string = '';
  idDelete: string = '';
  selectedCompany: string = '';

  isOpenInternal:boolean = true;
  isOpenExternal:boolean = false;
  isUpdate:boolean = false;
  isLoadingBack:boolean = false;
  submitted :boolean = false;
  responseSuccess: boolean = true;
  showResponseModal: boolean = false;
  isMessageDelete: boolean = false;
  showAddTemplateModal = false;
  optionDelete: boolean = false;
  optionUpdate: boolean = false;
  showHtmlPreview = false;
  isEdit:boolean = false;
  isView:boolean = false;

  expanded = { usuario: false,compania: false,roles: false, customers: false, desings: false };
  mails: Mail[] = [];
  mail: Mail = new Mail();
  templatesInternal: Mail[] | null = null;
  templatesExternal: Mail[] = [];
  clientData: any = {};
  typeCompany: any[] = [];
  company: any[] | null = null;
  user: any[] | null = null;
  customer: any[] | null = null;
  desing: any[] | null = null;
  rol: any[] | null = null;
  ccList: string[] = [];
  bccList: string[] = [];

  @ViewChild('previewIframe', { static: false }) previewIframe!: ElementRef;
  @ViewChild('previewIframe2', { static: false }) previewIframe2!: ElementRef;

  constructor(private authservice: AuthService,
    private companyservice: CompanyService,
    private mailservice: MailService
  ) { }

  ngOnInit(): void {
    this.colorDefaul();
    this.getAllLabels();
    this.companyservice.GetAllTypeStatusDocument().subscribe(response => {
      if (response?.success && response?.data?.length > 0) {
        const rawData = response.data[0];
        try {
          this.typeCompany = rawData?.typeCompany ? JSON.parse(rawData.typeCompany) : null;
          console.log(this.typeCompany);
          if (this.typeCompany?.length > 0) 
            this.getAllTemplates(this.typeCompany[0].idClient);

        } catch (error) {
          console.error("Error al parsear typeCompany:", error);
        }
      }
    });
  }

  openPreviewModal() {
    this.showHtmlPreview = true;

    // Esperar a que el iframe exista en el DOM
    setTimeout(() => {
      const iframe2 = this.previewIframe2.nativeElement as HTMLIFrameElement;
      iframe2.srcdoc = this.htmlContent;  // ✅ Renderiza el HTML directo
    });
  }

closePreviewModal() {
  this.showHtmlPreview = false;
}

  messageAddUpdate(isValid: boolean)
    {
      this.isLoadingBack = false;
      if(isValid){
        this.getAllTemplates(this.mail.idCompany!);  
        this.showResponseModal = false;
      }
      else {
        this.showResponseModal = false
      }
    }

  async OpenModalMessage(option: string, id: string) {

    if (option == 'update') {
      this.messageTittle = 'Actualizar Plantilla'
      this.messageOption = '¿Esta seguro de actualizar los datos de la plantilla?';
      this.optionDelete = false;
      this.optionUpdate = true;
      this.idDelete = '';
    }
    if (option == 'delete') {
      this.messageTittle = 'Eliminar Plantilla'
      this.messageOption = '¿Esta seguro de eliminar La plantilla?';
      this.optionDelete = true;
      this.optionUpdate = false;
      this.idDelete = id;
    }

    this.isMessageDelete = !this.isMessageDelete;
  }

  openAddTemplateModal() {
    this.nameTemplate = '';
    this.idCompany = '';
    this.descriptionTemplate = '';
    this.showAddTemplateModal = true;
  }

  closeAddTemplateModal() {
    this.showAddTemplateModal = false;
  }

  addEmail(list: 'ccList' | 'bccList', event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if ((event.key === 'Enter' || event.key === ',') && value) {
      if (this.isValidEmail(value)) {
        this[list].push(value.replace(/,$/, '')); // quita coma final
        input.value = '';
      }
      event.preventDefault();
    }
  }

  removeEmail(list: 'ccList' | 'bccList', index: number) {
    this[list].splice(index, 1);
  }

  // convertir antes de enviar al backend
  prepareForSend() {
    this.mail.cc = this.ccList.join(',');
    this.mail.bcc = this.bccList.join(',');
  }

  populateListsFromMail() {
    this.ccList  = (this.mail.cc  || '').split(',')
                   .map(e => e.trim())
                   .filter(e => e); // quita vacíos

    this.bccList = (this.mail.bcc || '').split(',')
                   .map(e => e.trim())
                   .filter(e => e);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async selectTemplate(template: Mail, option: number) {
    this.mail = template;
    this.populateListsFromMail();

    if(option == 1){
      this.isView = true;
      this.isEdit = false;
    }
    else{
      this.isEdit = true;
      this.isView = false;
    }

    this.htmlContent = this.mail.template ?? '';
    this.updatePreview();
    console.log("Seleccionado:", this.mail);
  }

  getAllLabels() {
    this.mailservice.getAllLabels().subscribe(response => {
      if (response?.success && response?.data?.length > 0) {
        const rawData = response.data[0];
        try {
          this.company = rawData?.company ? JSON.parse(rawData.company) : null;
          this.user = rawData?.user ? JSON.parse(rawData.user) : null;
          this.rol = rawData?.rol ? JSON.parse(rawData.rol) : null;
          this.desing = rawData?.desing ? JSON.parse(rawData.desing) : null;
          this.customer = rawData?.customer ? JSON.parse(rawData.customer) : null;
        } catch (error) {
          console.error("Error al parsear typeCompany:", error);
        }
      }
    });
  }

  getAllTemplates(id: string) {
      this.mailservice.GetTemplateIdCompany(id).subscribe(result => {
      const mails = result.data as Mail[];

      this.templatesInternal = mails.filter(m => m.isInternal === true);
      this.templatesExternal = mails.filter(m => m.isInternal === false);

      console.log("Internos:", this.templatesInternal);
      console.log("Externos:", this.templatesExternal);
    });
  }

   colorDefaul() {
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
    }
  }

updatePreview() {


    setTimeout(() => {
      const iframe = this.previewIframe.nativeElement as HTMLIFrameElement;
      iframe.srcdoc = this.htmlContent;
    }, 0); 
  
}

toggle(section: 'usuario' | 'compania' | 'roles' | 'desings' | 'customers') {
    this.expanded[section] = !this.expanded[section];
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`Etiqueta "${text}" copiada ✅`);
    });
  }

addUpdateTemplate(operation: string){

  this.isLoadingBack = true;

  if(operation == 'add')
    {
      this.mail = new Mail();
      this.mail.name = this.nameTemplate;
      this.mail.idCompany = this.idCompany;
      this.mail.description = this.descriptionTemplate;
    }

        const result = this.ValidateDataRol();
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
    this.mail.operation = operation;
    this.mail.template = this.htmlContent;
    this.prepareForSend();
    
    this.mailservice.AddUpdateTemplate(this.mail).subscribe({
        next: (res) => {
          if (res.success) {
            this.closeModalMessage();
            //this.ClosedModalAddUpadte();
            this.getAllTemplates(this.mail.idCompany!);
            this.tittle = 'Éxito';
            this.responseMessage = res.data?.message || 'Operación exitosa';
            this.mail.idTemplateMail = res.data?.idTemplateMail;
            this.responseSuccess = true;
            this.isLoadingBack = false;
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
            this.responseMessage = err.error?.error?.message || 'Error del servidor al guardar el Template';
            this.responseSuccess = false;
            this.showResponseModal = true;
            this.isLoadingBack = false;
          }
        });
  }

  ValidateDataRol(): string | null {

    this.submitted = true;

    if((!this.mail?.name || this.mail?.name.trim() === '') ||
      (!this.mail?.description || this.mail?.description.trim() === '') ||
      (!this.mail?.idCompany || this.mail?.idCompany.trim() === ''))
        return 'Por favor, ingresa los datos obligatorios';

    return null;
  }

  closeModalMessage(){
      this.isMessageDelete = false;
    }

}
