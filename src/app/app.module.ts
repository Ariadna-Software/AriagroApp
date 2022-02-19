import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule} from '@angular/common/http';

import { MyApp } from './app.component';
import { AriagroDataProvider } from '../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../providers/local-data/local-data';

import { OneSignal } from '@ionic-native/onesignal';
import { AppVersion } from '@ionic-native/app-version';
import { AriagroMsgProvider } from '../providers/ariagro-msg/ariagro-msg';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AriagroDataProvider,
    LocalDataProvider,
    OneSignal,
    AppVersion,
    AriagroMsgProvider
  ]
})
export class AppModule {}
