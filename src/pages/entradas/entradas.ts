import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController, ModalController } from 'ionic-angular';
import { ModalCalidadesCampoPage } from '../modal-calidades-campo/modal-calidades-campo'
import * as numeral from 'numeral';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-entradas',
  templateUrl: 'entradas.html',
})
export class EntradasPage {
  settings: any = {};
  campanya: any = {};
  user: any = {};
  campo: any = {};
  modalCalidadesCampo: any;
  modalCalidadesAlbaran: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
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
  }

  cargarEntradas(campo): void {
    campo.entradas.forEach(e => {
      e.numcajon = numeral(e.numcajon).format('0,0');
      e.kilosnet = numeral(e.kilosnet).format('0,0');
      e.fecalbar = moment(e.fecalbar).format('DD/MM/YYYY');
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
