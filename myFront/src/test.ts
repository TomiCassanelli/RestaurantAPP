// This file is required by karma.conf.js and loads recursively all the .spec and framework files
// Establecer un valor predeterminado para window['env']['apiUrl'] en las pruebas
(window as any)['env'] = (window as any)['env'] || {};
(window as any)['env']['apiURL'] = (window as any)['env']['apiURL'] || 'http://localhost:5111/api'; // Valor predeterminado para las pruebas


import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);