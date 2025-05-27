import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient,HttpClientModule } from '@angular/common/http'; // Import HttpClient provider
//import { provideForms } from '@angular/forms';      // Import Forms provider

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // Add provideHttpClient() and provideForms()
  providers: [provideRouter(routes), provideHttpClient(),HttpClientModule]
};
