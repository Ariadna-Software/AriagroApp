import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Locales } from '../locales/locales';
import { OneSignal, OSNotificationPayload } from '../providers/onesignal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'HomePage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, oneSignal: OneSignal ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // OneSignal Code start:
      // Enable to debug issues:
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

     
     
    
      
      oneSignal.startInit("33728f44-2576-4f76-9b7c-b6a65d345c28", "595606821946");
      oneSignal.handleNotificationOpened();

      

      
      oneSignal.endInit();

      // Setting locales for the entire app
      let loc = new Locales();
      loc.NumeralLocales();
    });
  }

  private onPushReceived(payload: OSNotificationPayload) {
    alert( payload.body);
  }
  
  private onPushOpened(payload: OSNotificationPayload) {
    alert(payload.body);
  }
}

