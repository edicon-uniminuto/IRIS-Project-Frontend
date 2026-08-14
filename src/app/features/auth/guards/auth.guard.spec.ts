import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { restoreSession: ReturnType<typeof vi.fn> };
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { restoreSession: vi.fn() };
    router = { createUrlTree: vi.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('allows activation when session is restored', async () => {
    authService.restoreSession.mockResolvedValue(true);
    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to login when session restoration fails', async () => {
    authService.restoreSession.mockResolvedValue(false);
    await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
