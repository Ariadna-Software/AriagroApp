import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajesDetallePage } from './mensajes-detalle';

@NgModule({
  declarations: [
    MensajesDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(MensajesDetallePage),
  ],
})
export class MensajesDetallePageModule {}
