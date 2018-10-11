import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as numeral from 'numeral';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html',
})
export class FacturasPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  years: any = [];
  selectedYear: any;

  facturasTienda: any = [];
  numFacturasTienda: number = 0;
  facturasTelefonia: any = [];
  numFacturasTelefonia: number = 0;
  facturasGasolinera: any = [];
  numFacturasGasolinera: number = 0;
  facturasTratamientos: any = [];
  numFacturasTratamientos: number = 0;
  facturasVarias: any = [];
  numFacturasVarias: number = 0;




  constructor(public navCtrl: NavController,  public appVersion: AppVersion, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.generateYears();
        this.onYearChange(this.selectedYear);
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
    try {
      this.appVersion.getVersionNumber().then(vrs => {
        this.version = "ARIAGRO APP V" + vrs;
      },
        error => {
          // NO hacemos nada, en realidad protegemos al estar en debug
          // con el navegador
        });
    } catch (error) {

    }
  }



  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  generateYears(): void {
    this.years = [];
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    this.selectedYear = currentYear;
    this.years.push(currentYear);
    for (let i = 1; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  onYearChange(year): void {
    this.getFacturasTienda();
    this.getFacturasTelefonia();
    this.getFacturasGasolinera();
    this.getFacturasTratamientos();
    this.getFacturasVarias()
  }

  getFacturasTienda(): void {
    this.ariagroData.getFacturasTienda(this.settings.parametros.url, this.user.tiendaId, this.selectedYear)
      .subscribe(
        (data) => {
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            
            f.lineas.forEach(l => {
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.importel = numeral(l.importel).format('0,0.00');
              l.precioar = numeral(l.precioar).format('0,0.00');
             
            });
          });
          this.facturasTienda = data;
          this.numFacturasTienda = data.length;
        },
        (error) => {
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasTelefonia(): void {
    this.ariagroData.getFacturasTelefonia(this.settings.parametros.url, this.user.telefoniaId, this.selectedYear)
      .subscribe(
        (data) => {
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.lineas.forEach(l => {
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.importel = numeral(l.importel).format('0,0.00');
              l.precioar = numeral(l.precioar).format('0,0.00');
            });
          });
          this.facturasTelefonia = data;
          this.numFacturasTelefonia = data.length;
        },
        (error) => {
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasGasolinera(): void {
    this.ariagroData.getFacturasGasolinera(this.settings.parametros.url, this.user.gasolineraId, this.selectedYear)
      .subscribe(
        (data) => {
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.year = this.selectedYear;
            f.lineas.forEach(l => {
              l.fecalbar = moment(l.fecalbar).format('DD/MM/YYYY');
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.implinea = numeral(l.implinea).format('0,0.00');
              l.preciove = numeral(l.preciove).format('0,0.000');
            });
          });
          this.facturasGasolinera = data;
          this.numFacturasGasolinera = data.length;
        },
        (error) => {
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasTratamientos(): void {
    this.ariagroData.getFacturasTratamientos(this.settings.parametros.url, this.user.tratamientosId, this.selectedYear, this.user.ariagroId, this.campanya.ariagro)
      .subscribe(
        (data) => {
          if(data[0].partes){
            data.forEach(f => {
              f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
              f.bases = numeral(f.bases).format('0,0.00');
              f.cuotas = numeral(f.cuotas).format('0,0.00');
              f.totalfac = numeral(f.totalfac).format('0,0.00');
              f.partes.forEach(l => {
                l.fechapar = moment(f.fechapar).format('DD/MM/YYYY');
                l.lineas.forEach(s =>{
                  s.cantidad = numeral(s.cantidad).format('0,0.00');
                  s.importel = numeral(s.importel).format('0,0.00');
                  s.precioar = numeral(s.precioar).format('0,0.00');
                });
              });
            });
          } else {
            data.forEach(f => {
              f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
              f.bases = numeral(f.bases).format('0,0.00');
              f.cuotas = numeral(f.cuotas).format('0,0.00');
              f.totalfac = numeral(f.totalfac).format('0,0.00');
              f.lineas.forEach(l => {
                l.cantidad = numeral(l.cantidad).format('0,0.00');
                l.importel = numeral(l.importel).format('0,0.00');
                l.precioar = numeral(l.precioar).format('0,0.00');
              });
            });
          }
         
          this.facturasTratamientos = data;
          this.numFacturasTratamientos = data.length;
        },
        (error) => {
          
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasVarias(): void {
    this.ariagroData.getFacturasVarias(this.settings.parametros.url, this.campanya.ariagro)
      .subscribe(
        (data) => {
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.lineas.forEach(l => {
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.importel = numeral(l.importel).format('0,0.00');
              l.precioar = numeral(l.precioar).format('0,0.00');
            });
          });
          this.facturasVarias = data;
          this.numFacturasVarias = data.length;
        },
        (error) => {
          
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }


  goFacturasTienda(): void {
    this.navCtrl.push('FacturasTiendaPage', {
      facturas: this.facturasTienda
    });
  }

  goFacturasTelefonia(): void {
    this.navCtrl.push('FacturasTelefoniaPage', {
      facturas: this.facturasTelefonia
    });
  }
  
  goFacturasGasolinera(): void {
    this.navCtrl.push('FacturasGasolineraPage', {
      facturas: this.facturasGasolinera
    });
  }

  goFacturasTratamientos(): void {
    this.navCtrl.push('FacturasTratamientosPage', {
      facturas: this.facturasTratamientos
    });
  }

  goFacturasVarias(): void {
    this.navCtrl.push('FacturasVariasPage', {
      facturas: this.facturasVarias
    });
  }
}
