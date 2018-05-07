import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajesEnviarPage } from './mensajes-enviar';

@NgModule({
  declarations: [
    MensajesEnviarPage,
  ],
  imports: [
    IonicPageModule.forChild(MensajesEnviarPage),
  ],
})
export class MensajesEnviarPageModule {}
