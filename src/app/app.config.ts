import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { provideHttpClient, withFetch, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/services/jwt.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore(),
    provideEffects(),
    provideAnimations(),
    importProvidersFrom(OwlDateTimeModule, OwlNativeDateTimeModule),
    
    // HTTP Client Configuration
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    
    // JWT Configuration
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    
    // HTTP Interceptors
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
  ]
};