export class Mail {
    idTemplateMail?: string;
    idCompany?: string;
    name?: string;
    description?: string;
    subject?: string;
    template?: string;
    isDefault?: string;
    isInternal?: boolean;
    cc?: string;
    bcc?: string;
    operation?: string;

    constructor(init?: Partial<Mail>) {
        if (init) {Object.assign(this, init);}
    }
}