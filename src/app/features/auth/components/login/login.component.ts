import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export interface DemoUser {
  email: string;
  name: string;
  role: string;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly demoUsers: DemoUser[] = [
    { email: 'admin@iris.com', name: 'Administrador IRIS', role: 'Administrador General' },
    { email: 'senior.dev@iris.com', name: 'Desarrollador Senior', role: 'Desarrollo Full Stack' },
    { email: 'tech.lead@iris.com', name: 'Líder Técnico', role: 'Arquitectura de Software' },
    { email: 'qa.engineer@iris.com', name: 'Ingeniero QA', role: 'Aseguramiento de Calidad' },
    { email: 'ux.designer@iris.com', name: 'Diseñador UX/UI', role: 'Diseño de Producto' },
    { email: 'product.owner@iris.com', name: 'Product Owner', role: 'Gestión de Dominio' },
    { email: 'scrum.master@iris.com', name: 'Scrum Master', role: 'Metodologías Ágiles' },
    { email: 'devops.engineer@iris.com', name: 'Ingeniero DevOps', role: 'Infraestructura & CI/CD' },
    { email: 'backend.dev@iris.com', name: 'Desarrollador Backend', role: 'API REST & Base de Datos' },
    { email: 'frontend.dev@iris.com', name: 'Desarrollador Frontend', role: 'Angular & UI Components' }
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]]
  });

  selectDemoUser(event: Event) {
    const select = event.target as HTMLSelectElement;
    const email = select.value;
    if (!email) return;
    this.form.patchValue({ email, password: 'Password123!' });
  }

  submit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/tasks'),
        error: err => this.error.set(err?.error?.error?.message ?? 'No fue posible completar el inicio de sesión.')
      });
  }
}
