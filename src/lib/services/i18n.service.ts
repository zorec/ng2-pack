import { Injectable } from '@angular/core';

export interface I18nLocales {
  [language: string]: I18nLocale;
}

export interface I18nLocale {
  [key: string]: I18nLocale | string;
}

@Injectable()
export class I18nService {
  language: string = 'en';
  translations: I18nLocales;

  constructor() { }

  get(nestedKey: string, language: string = this.language): string {
    if (!this.translations) {
      console.error('I18nService is used without initialization with translations');
      return;
    }
    let keys: string[] = nestedKey.split('.');
    let translation: string;
    try {
      translation = <string>keys
        .reduce((translationTree: I18nLocale, key: string) => {
          return translationTree[key];
        }, this.translations[language]);
    } catch (err) {
      console.error(`Unknown key "${nestedKey}" was used!`);
    }
    return translation;
  }
}
