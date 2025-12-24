import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailRecoveryComponent } from './email-recovery.component';

describe('EmailRecoveryComponent', () => {
  let component: EmailRecoveryComponent;
  let fixture: ComponentFixture<EmailRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailRecoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
