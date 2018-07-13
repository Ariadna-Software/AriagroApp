import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController  } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import * as numeral from 'numeral';




@IonicPage()
@Component({
  selector: 'page-modal-calidades-albaran',
  templateUrl: 'modal-calidades-albaran.html',
})
export class ModalCalidadesAlbaranPage {

  settings: any = {};
 segundoPlano:boolean = false;
  campanya: any = {};
  user: any = {};
  entrada: any = {};
  calidades: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public localData: LocalDataProvider, public alertCrtl: AlertController, public loadingCtrl: LoadingController, 
     public ariagroData: AriagroDataProvider) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.entrada = this.navParams.get('entrada');
        this.loadCalidades();

      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  loadCalidades(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando clasificacion...' });
    loading.present();
    this.ariagroData.getAlbaranClasificacion(this.settings.parametros.url, this.entrada.numalbar, this.campanya.ariagro)
    .subscribe(
      (data) => {
        loading.dismiss();
        this.calidades = this.prepareData(data);
      },
      (error) => {
        loading.dismiss();
        this.showAlert("ERROR", JSON.stringify(error, null, 4));
      }
    );
  }

  prepareData(calidades): any {
    var contador = 1;
    calidades.forEach(a => {
      if(a.kilos != null) {
        a.contador = contador++;
        a.kilos = numeral(a.kilos).format('0,0');
      }
    });
    return calidades;
  }

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

}
