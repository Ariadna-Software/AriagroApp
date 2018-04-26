import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasTratamientosDetallePage } from './facturas-tratamientos-detalle';

@NgModule({
  declarations: [
    FacturasTratamientosDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasTratamientosDetallePage),
  ],
})
export class FacturasTratamientosDetallePageModule {}
