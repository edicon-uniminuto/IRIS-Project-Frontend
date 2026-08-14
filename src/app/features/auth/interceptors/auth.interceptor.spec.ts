import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: { accessToken: string | null; refreshAccessToken: ReturnType<typeof vi.fn> };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { accessToken: 'valid-token', refreshAccessToken: vi.fn() };
    router = { navigateByUrl: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('attaches Bearer token to request headers', () => {
    http.get('/api/v1/test').subscribe();
    const req = httpMock.expectOne('/api/v1/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token');
    req.flush({});
  });

  it('attempts token refresh on 401 response and retries request', async () => {
    authService.refreshAccessToken.mockResolvedValue('new-token');

    let response: any;
    http.get('/api/v1/protected').subscribe(res => response = res);

    const initialReq = httpMock.expectOne('/api/v1/protected');
    initialReq.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    await new Promise(r => setTimeout(r, 10));

    const retryReq = httpMock.expectOne('/api/v1/protected');
    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token');
    retryReq.flush({ data: 'success' });

    expect(response).toEqual({ data: 'success' });
  });

  it('redirects to login when token refresh fails on 401', async () => {
    authService.refreshAccessToken.mockResolvedValue(null);

    let error: any;
    http.get('/api/v1/protected').subscribe({ error: e => error = e });

    const req = httpMock.expectOne('/api/v1/protected');
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    await new Promise(r => setTimeout(r, 10));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    expect(error.status).toBe(401);
  });
});
