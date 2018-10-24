import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController, ModalController } from 'ionic-angular';
import * as numeral from 'numeral';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-entradas',
  templateUrl: 'entradas.html',
})
export class EntradasPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  campo: any = {};
  modalCalidadesCampo: any;
  modalCalidadesAlbaran: any;

  constructor(public navCtrl: NavController,  public appVersion: AppVersion, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.cargarEntradas(this.navParams.get('campo'));

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

  cargarEntradas(campo): void {
    var comprobar;// comprueba si al formatear la fecha esta ya ha sido formateada

    campo.entradas.forEach(e => {
      comprobar = moment(e.fecalbar).format('DD/MM/YYYY');
      if(comprobar != 'Invalid date') {
        e.numcajon = numeral(e.numcajon).format('0,0');
        e.kilosnet = numeral(e.kilosnet).format('0,0');
        e.fecalbar = moment(e.fecalbar).format('DD/MM/YYYY');
      }
      
    });
    this.campo = campo;
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

  openModalCalidadesCampo(campo): void  {
    this.modalCalidadesCampo = this.modalCtrl.create('ModalCalidadesCampoPage', {campo: campo});
    this.modalCalidadesCampo.present();
  }

  openModalCalidadesAlbaran(entrada): void  {
    this.modalCalidadesAlbaran = this.modalCtrl.create('ModalCalidadesAlbaranPage', {entrada: entrada});
    this.modalCalidadesAlbaran.present();
  }
}
