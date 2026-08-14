import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authService: { register: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('initializes with invalid empty form', () => {
    expect(component.form.valid).toBe(false);
  });

  it('prevents submission when passwords do not match', () => {
    component.form.setValue({
      name: 'Carlos Mendoza',
      email: 'newuser@iris.com.co',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword1!'
    });

    component.submit();

    expect(component.form.valid).toBe(false);
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('submits registration form and navigates to /tasks on success', () => {
    authService.register.mockReturnValue(of({ success: true }));
    component.form.setValue({
      name: 'Carlos Mendoza',
      email: 'newuser@iris.com.co',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    component.submit();

    expect(authService.register).toHaveBeenCalledWith('newuser@iris.com.co', 'Password123!', 'Carlos Mendoza');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/tasks');
  });

  it('displays error message when registration fails', () => {
    authService.register.mockReturnValue(throwError(() => ({ error: { error: { message: 'El correo ya está registrado' } } })));
    component.form.setValue({
      name: 'Carlos Mendoza',
      email: 'existing@iris.com.co',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    component.submit();

    expect(component.error()).toBe('El correo ya está registrado');
  });
});
