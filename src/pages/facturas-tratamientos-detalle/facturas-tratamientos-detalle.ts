import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-facturas-tratamientos-detalle',
  templateUrl: 'facturas-tratamientos-detalle.html',
})
export class FacturasTratamientosDetallePage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  factura: any = {lineas:[], partes:[{lineas:[]}]};
  informe: any;
  usaInformes: any;
  correo: any;
  loading: any;

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
     public viewCtrl: ViewController, public alertCrtl: AlertController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {

  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.correo = this.settings.user.email;
        this.campanya = this.settings.campanya;
        this.usaInformes = this.settings.parametros.usaInformes;
        this.factura = this.navParams.get('factura');
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

  comprobarPlantillas(){
    this.informe = this.settings.parametros.infTienda;
    if(this.informe == "" || this.informe == null){
      this.msg.showErrorPersoinalizado('', 'Plantilla de factura no configurada');
    }else {
      this.comprobarCorreo();
    }
  }

  comprobarCorreo(): void {
    if(this.usaInformes == 0) {
      this.msg.showErrorPersoinalizado('', 'Funcionalidad no habilitada, póngase en contacto con su cooperativa');
    }else {
      var mens = "";
      var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
      if (emailRegex.test(this.correo)) {
        mens = 'Este es el correo al cual se va a enviar la factura. Puede introducir otro.';
      } else {
        mens = 'Correo incorrecto, introduzca un correo.';
      }
      this.mostrarCorreo(mens);
    }
  }

  mostrarCorreo(mens) {
    let alert = this.alertCrtl.create({
      title: mens,
      inputs: [
        {
          name: 'Correo',
          value:  this.correo
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
            if (emailRegex.test(data.Correo)) {
              this.correo = data.Correo;
              this.loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
              this.loading.present();


              console.log('Factura TI', this.factura);
              // La factura en el envío está compuesta
              var compost = this.factura.numfactu.split('-');

              this.ariagroData.solicitarS2FacTratamiento(
                this.settings.parametros.url,
                this.campanya.ariagro,
                'FAD',
                this.factura.codtipom + "_" + compost[1] + "_" + moment(this.factura.fecfactu, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                this.correo
              )
              .subscribe(
                (data) => {
                  this.loading.dismiss();

                  this.msg.showErrorPersoinalizado("", 'Su documento ha sido solicitado. Gracias');
                  if( this.settings.user.email == ""){
                    this.correo = null;
                  }
                },
                (error) => {
                  this.msg.showAlert(error);
                  this.loading.dismiss();
                }
              );
              
              // this.ariagroData.prepararCorreoFactuTienda(this.settings.parametros.url, this.factura.year, this.factura.numfactuSin, this.factura.letraser, this.informe,  this.user.tiendaId)
              // .subscribe(
              //   (data) => {
              //     this.enviarCorreo(data);
              //   },
              //   (error) => {
              //     this.msg.showAlert(error);
              //     this.loading.dismiss();
              //   }
              // );
            }else {
              mens = 'Correo incorrecto, introduzca un correo';
              this.mostrarCorreo(mens);
            }
          }
        }
      ]
    });
    alert.present();
  }
  
}
