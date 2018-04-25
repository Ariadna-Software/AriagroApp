import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnticiposPage } from './anticipos';

@NgModule({
  declarations: [
    AnticiposPage,
  ],
  imports: [
    IonicPageModule.forChild(AnticiposPage),
  ],
})
export class CamposPageModule {}
