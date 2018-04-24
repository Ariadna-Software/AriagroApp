import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParametrosPage } from './parametros';

@NgModule({
  declarations: [
    ParametrosPage,
  ],
  imports: [
    IonicPageModule.forChild(ParametrosPage),
  ],
})
export class ParametrosPageModule {}
