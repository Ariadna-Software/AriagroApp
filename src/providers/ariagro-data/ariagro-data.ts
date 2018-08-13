import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class AriagroDataProvider {

  constructor(public http: HttpClient) {
  }

  getParametrosCentral(numCooperativa): any {
    let url = 'http://ariagro.myariadna.com:9901/api/parametros/' + numCooperativa;
    return this.http.get(url);
  }

  getParametros(url): any {
    return this.http.get(url + '/api/parametros/0');
  }

  login(url, login, password): any {
    return this.http.get(url + '/api/usupush/login', {
      params: {
        login: login,
        password: password
      }
    });
  }

  
  getCampanyas(url): any {
    return this.http.get(url + '/api/campanyas');
  }


  getCampanyaActual(url): any {
    return this.http.get(url + '/api/campanyas/actual');
  }

  getCampos(url, socio, campanya): any {
    return this.http.get(url + '/api/campos/socio', {
      params: {
        codsocio: socio,
        campanya: campanya
      }
    });
  }

  getAnticipos(url, socio, campanya): any {
    return this.http.get(url + '/api/anticipos-liquidaciones/socio', {
      params: {
        codsocio: socio,
        campanya: campanya
      }
    });
  }

  getFacturasTienda(url, codclien, year): any {
    return this.http.get(url + '/api/facturas/tienda/' + codclien + '/' + year);
  }

  getFacturasTelefonia(url, codclien, year): any {
    return this.http.get(url + '/api/facturas/telefonia/' + codclien + '/' + year);
  }

  getFacturasGasolinera(url, codclien, year): any {
    return this.http.get(url + '/api/facturas/gasolinera/' + codclien + '/' + year);
  }

  getFacturasTratamientos(url, codclien, year, codsocio, campanya): any {
    return this.http.get(url + '/api/facturas/tratamientos/' + codclien + '/' + year + '/' + codsocio + '/' + campanya);
  }

  getFacturasVarias(url, campanya): any {
    return this.http.get(url + '/api/facturas/varias/'  + campanya);
  }

  getMensajesUsuario(url, usuPush): any {
    return this.http.get(url + '/api/mensajes/usuario/' + usuPush);
  }

  getMensajeHttp(url, mensajeId): any {
    return this.http.get(url + '/api/mensajes/' + mensajeId);
  }


  getCampoClasificacion(url, codcampo, campanya): any {
    return this.http.get(url + '/api/campos/buscar/clasificacion/' + codcampo + '/' +campanya);
  }

  getAlbaranClasificacion(url, numalbar, campanya): any {
    return this.http.get(url + '/api/campos/buscar/clasificacion/albaran/' + numalbar + '/' +campanya);
  }

  putMensajeUsuario(url, usuarioPushId, mensajeId, fecha): any {
    var data = {
      usuarioPushId: usuarioPushId,
      mensajeId: mensajeId,
      fecha: fecha
  };
    return this.http.put(url + '/api/mensajes/usuario/'+ usuarioPushId, data );
  }


  putUsuario(url, id, usuario): any {
    var data = {
      usuarioPush: usuario
     
  };
    return this.http.put(url + '/api/usupush/'+ id, data );
  }
 
  postCorreo(url, correo){
    var data = {
        correo: correo
    };
    return this.http.post(url + '/api/mensajes/correo', data);
}

prepararCorreoClasif(url, numalbar,campanya, informe): any {
  var data = {
    numalbar: numalbar,
    campanya: campanya,
    informe: informe
};
return this.http.post(url + '/api/mensajes/preparar-correo/clasif', data);
}

enviarCorreoClasif(url, numalbar, email, ruta, coop): any {
  var data = {
    numalbar: numalbar,
    email: email,
    ruta: ruta,
    coop: coop
  };
  return this.http.post(url + '/api/mensajes/enviar/correo/clasif', data);
}
}
