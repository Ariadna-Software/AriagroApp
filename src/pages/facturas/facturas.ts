import { Component } from '@angular/core';
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




  constructor(public navCtrl: NavController, public navParams: NavParams,
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
  }

  getFacturasTienda(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando tienda...' });
    loading.present();
    this.ariagroData.getFacturasTienda(this.settings.parametros.url, this.user.tiendaId, this.selectedYear)
      .subscribe(
        (data) => {
          loading.dismiss();
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.lineas.forEach(l => {
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.importel = numeral(l.importel).format('0,0.00');
            });
          });
          this.facturasTienda = data;
          this.numFacturasTienda = data.length;
        },
        (error) => {
          loading.dismiss();
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasTelefonia(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando telefonia...' });
    loading.present();
    this.ariagroData.getFacturasTelefonia(this.settings.parametros.url, this.user.tiendaId, this.selectedYear)
      .subscribe(
        (data) => {
          loading.dismiss();
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.lineas.forEach(l => {
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.importel = numeral(l.importel).format('0,0.00');
            });
          });
          this.facturasTelefonia = data;
          this.numFacturasTelefonia = data.length;
        },
        (error) => {
          loading.dismiss();
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasGasolinera(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando gasolinera...' });
    loading.present();
    this.ariagroData.getFacturasGasolinera(this.settings.parametros.url, this.user.tiendaId, this.selectedYear)
      .subscribe(
        (data) => {
          loading.dismiss();
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.lineas.forEach(l => {
              l.fecalbar = moment(l.fecalbar).format('DD/MM/YYYY');
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.implinea = numeral(l.implinea).format('0,0.00');
            });
          });
          this.facturasGasolinera = data;
          this.numFacturasGasolinera = data.length;
        },
        (error) => {
          loading.dismiss();
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  getFacturasTratamientos(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando tratamientos...' });
    loading.present();
    this.ariagroData.getFacturasTratamientos(this.settings.parametros.url, this.user.tiendaId, this.selectedYear, this.user.ariagroId, this.campanya.ariagro)
      .subscribe(
        (data) => {
          loading.dismiss();
          data.forEach(f => {
            f.fecfactu = moment(f.fecfactu).format('DD/MM/YYYY');
            f.bases = numeral(f.bases).format('0,0.00');
            f.cuotas = numeral(f.cuotas).format('0,0.00');
            f.totalfac = numeral(f.totalfac).format('0,0.00');
            f.lineas.forEach(l => {
              l.cantidad = numeral(l.cantidad).format('0,0.00');
              l.importel = numeral(l.importel).format('0,0.00');
            });
          });
          this.facturasTratamientos = data;
          this.numFacturasTratamientos = data.length;
        },
        (error) => {
          loading.dismiss();
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  goFacturasTienda(): void {
    this.navCtrl.push('FacturasTiendaPage', {
      facturas: this.facturasTienda
    });
  }

  goFacturasTratamientos(): void {
    this.navCtrl.push('FacturasTratamientosPage', {
      facturas: this.facturasTratamientos
    });
  }

}
