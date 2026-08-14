import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const skipRefresh = req.headers.has('X-Skip-Auth-Refresh');
  let request = req.clone({ headers: req.headers.delete('X-Skip-Auth-Refresh') });

  if (auth.accessToken && !skipRefresh) {
    request = request.clone({ setHeaders: { Authorization: `Bearer ${auth.accessToken}` } });
  }

  return next(request).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status !== 401 || skipRefresh) return throwError(() => error);
    return from(auth.refreshAccessToken()).pipe(switchMap(token => {
      if (!token) {
        void router.navigateByUrl('/login');
        return throwError(() => error);
      }
      return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    }));
  }));
};
