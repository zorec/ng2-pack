/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject } from '@angular/core/testing';
import { I18nService, I18nLocale, I18nLocales } from './i18n.service';

describe('Service: I18n', () => {
  let service: I18nService;
  const enTranslations = {
    table: 'table',
    app: {
      dashboard: {
        table: {
          headline: 'headline'
        }
      }
    } as I18nLocale
  };
  const deTranslations = {
    table: 'Tabelle',
    app: {
      dashboard: {
        table: {
          headline: 'Schlagzeile'
        }
      }
    } as I18nLocale
  };

  beforeEach(() => {
    service = new I18nService();
    service.translations = <I18nLocales>{
      en: enTranslations,
      de: deTranslations
    };
  });

  it('gets translationf in default language', () => {
    expect(service.get('table')).toEqual('table');
  });

  it('gets translationf in specified language', () => {
    expect(service.get('table', 'de')).toEqual('Tabelle');
  });

  it('can access deeply nested keys', () => {
    expect(service.get('app.dashboard.table.headline', 'de')).toEqual('Schlagzeile');
  });
  //
  // it('doesn\'t crash', () => {
  //   expect(service.get('whatever.does.not.exist')).not.toThrow(() => {
  //     expect(false).toBe(true);
  //   });
  // });
});
