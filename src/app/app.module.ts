import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { AriagroDataProvider } from '../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../providers/local-data/local-data';

import { OneSignal } from '../providers/onesignal';


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
    OneSignal
  ]
})
export class AppModule {}
