import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding, withHashLocation,
  withPreloading
} from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {IonicRouteStrategy, provideIonicAngular} from "@ionic/angular/standalone";
import {IonicModule} from "@ionic/angular";
import {MatFormFieldModule} from "@angular/material/form-field";

export const appConfig: ApplicationConfig = {
  providers: [
      provideIonicAngular(),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withComponentInputBinding()),
      importProvidersFrom(IonicModule.forRoot()),
      provideClientHydration(),
      provideAnimationsAsync(),
      provideHttpClient(withFetch()),
  ]
};
