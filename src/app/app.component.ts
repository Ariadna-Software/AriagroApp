import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Locales } from '../locales/locales';
import { AriagroDataProvider } from '../providers/ariagro-data/ariagro-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'HomePage';

  settings: any = {};
  password: string = "";
 

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, ariagroData: AriagroDataProvider ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      
      // Setting locales for the entire app
      let loc = new Locales();
      loc.NumeralLocales();
    });
  }
}

