import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasTiendaPage } from './facturas-aceite';

@NgModule({
  declarations: [
    FacturasTiendaPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasTiendaPage),
  ],
})
export class FacturasTiendaPageModule {}
