import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasTelefoniaDetallePage } from './facturas-telefonia-detalle';

@NgModule({
  declarations: [
    FacturasTelefoniaDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasTelefoniaDetallePage),
  ],
})
export class FacturasTelefoniaDetallePageModule {}
