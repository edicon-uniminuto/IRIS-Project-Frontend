import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('initializes with empty form and 10 demo users', () => {
    expect(component.form.valid).toBe(false);
    expect(component.demoUsers.length).toBe(10);
  });

  it('selects a demo user and precargas form inputs without auto submitting', () => {
    const selectEvent = { target: { value: 'admin@iris.com' } } as unknown as Event;

    component.selectDemoUser(selectEvent);

    expect(component.form.value.email).toBe('admin@iris.com');
    expect(component.form.value.password).toBe('Password123!');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('marks fields touched and prevents submission when invalid', () => {
    component.submit();
    expect(component.form.touched).toBe(true);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('submits login form and navigates to /tasks on success', () => {
    authService.login.mockReturnValue(of({ success: true }));
    component.form.setValue({ email: 'test@example.com', password: 'Password123!' });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'Password123!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/tasks');
  });

  it('displays error message when login fails', () => {
    authService.login.mockReturnValue(throwError(() => ({ error: { error: { message: 'Credenciales inválidas' } } })));
    component.form.setValue({ email: 'test@example.com', password: 'Password123!' });

    component.submit();

    expect(component.error()).toBe('Credenciales inválidas');
  });
});
