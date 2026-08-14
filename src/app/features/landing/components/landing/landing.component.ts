import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private readonly router = inject(Router);

  goToLogin() {
    void this.router.navigateByUrl('/login');
  }

  goToRegister() {
    void this.router.navigateByUrl('/register');
  }
}
