import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let fixture: ComponentFixture<LandingComponent>;
  let component: LandingComponent;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    router = { navigateByUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders landing page headline', () => {
    expect(fixture.nativeElement.textContent).toContain('Gestión de Tareas Inteligente');
  });

  it('navigates to /login when goToLogin is called', () => {
    component.goToLogin();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
