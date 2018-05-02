import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasTelefoniaPage } from './facturas-telefonia';

@NgModule({
  declarations: [
    FacturasTelefoniaPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasTelefoniaPage),
  ],
})
export class FacturasTelefoniaPageModule {}
