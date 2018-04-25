import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnticiposDetallePage } from './anticipos-detalle';

@NgModule({
  declarations: [
    AnticiposDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(AnticiposDetallePage),
  ],
})
export class EntradasPageModule {}
