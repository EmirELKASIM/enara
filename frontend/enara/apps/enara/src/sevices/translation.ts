import { Injectable, signal, effect } from '@angular/core';
import { I18n } from 'i18n-js';
import en from '../assets/i18n/en.json';
import ar from '../assets/i18n/ar.json';
import tr from '../assets/i18n/tr.json';
@Injectable({
  providedIn: 'root',
})
export class Translation {
  private i18n = new I18n(en);

  currentLang = signal('en');

  constructor() {
    this.i18n.defaultLocale = 'en';
    this.i18n.locale = this.currentLang();

    effect(() => {
      const lang = this.currentLang();
      this.loadLanguage(lang);
      this.setDirection(lang); // تغيير اتجاه الصفحة
      localStorage.setItem('lang', lang);
    });

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.currentLang.set(savedLang);
    }
  }

  changeLang(lang: string) {
    this.currentLang.set(lang);
  }

  t(key: string) {
    return this.i18n.t(key);
  }

  private loadLanguage(lang: string) {
    switch (lang) {
      case 'ar':
        this.i18n.translations = ar;
        break;
      case 'tr':
        this.i18n.translations = tr;
        break;
      default:
        this.i18n.translations = en;
        break;
    }
    this.i18n.locale = lang;
  }
  private setDirection(lang: string) {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
  }
}
