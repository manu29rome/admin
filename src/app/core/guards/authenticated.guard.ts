import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../login.services/auth.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  if(authService.isAutheticated()){
    return router.navigate(['dashboard']);
  } 
  else{
    return true;
  }
};
