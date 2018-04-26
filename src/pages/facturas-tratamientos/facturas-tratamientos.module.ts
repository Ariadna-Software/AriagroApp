import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasTratamientosPage } from './facturas-tratamientos';

@NgModule({
  declarations: [
    FacturasTratamientosPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasTratamientosPage),
  ],
})
export class FacturasTratamientosPageModule {}
