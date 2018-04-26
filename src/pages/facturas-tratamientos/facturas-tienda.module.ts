import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasTiendaPage } from './facturas-tienda';

@NgModule({
  declarations: [
    FacturasTiendaPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasTiendaPage),
  ],
})
export class FacturasTiendaPageModule {}
