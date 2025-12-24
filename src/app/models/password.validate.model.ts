export interface WordPassword {
  word: string;
}

export class ValidatePasswordRule {
  idConfigureValidationPassword: string = '';
  description: string = '';
  isActive: boolean = false;
  value?: number | null = null;
  wordPassword?: string | null = null;
  word?: { word: string }[] | null = null;

  constructor(init?: Partial<ValidatePasswordRule>) {
    Object.assign(this, init);
  }
}