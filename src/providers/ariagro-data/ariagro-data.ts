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

  getCamposNuevo(url, socio, campanya): any {
    return this.http.get(url + '/api/campos/socio/nuevo', {
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

  getFacturasAceite(url, codsocio, year): any {
    return this.http.get(url + '/api/facturas/aceite/' + codsocio + '/' + year);
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

  getFacturasVariasBis(url, codsocio, campanya): any {
    return this.http.get(url + '/api/facturas/varias/bis/' + codsocio + '/' + campanya);
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

  comprobarHost(url): any {
    return this.http.get(url + '/api/mensajes/buscar/host');
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
return this.http.post(url + '/api/campos/preparar-correo/clasif', data);
}

enviarCorreoClasif(url, numalbar, email, ruta, coop): any {
  var data = {
    numalbar: numalbar,
    email: email,
    ruta: ruta,
    coop: coop
  };
  return this.http.post(url + '/api/campos/enviar/correo/clasif', data);
}

prepararCorreoFactu(url, campanya, numfactu, informe, codtipom, servidor, fecfactu, paramCentral): any {
  var data = {
    campanya: campanya,
    numfactu: numfactu,
    informe: informe,
    codtipom: codtipom,
    servidor: servidor,
    fecfactu: fecfactu,
    paramCentral: paramCentral
  };
  console.log('DATACORREO:', data);
  return this.http.post(url + '/api/anticipos-liquidaciones/preparar-correo/nuevo', data);
}

enviarCorreoFactu(url, numfactu, email, ruta, coop, codtipom): any {
  var data = {
    numfactu: numfactu,
    email: email,
    ruta: ruta,
    coop: coop,
    codtipom: codtipom,
  };
  return this.http.post(url + '/api/anticipos-liquidaciones/enviar/correo/ant-liq', data);
}
prepararCorreoFactuGasol(url, fecfactu, numfactu, letraser, informe, codclien): any {
  var data = {
    fecfactu: fecfactu,
    numfactu: numfactu,
    letraser: letraser,
    informe: informe,
    codclien: codclien
};
return this.http.post(url + '/api/facturas/gasolinera/correo', data);
}

prepararCorreoFactuTienda(url, fecfactu, numfactu, letraser, informe, codclien): any {
  var data = {
    fecfactu: fecfactu,
    numfactu: numfactu,
    letraser: letraser,
    informe: informe,
    codclien: codclien
  };
  return this.http.post(url + '/api/facturas/tienda/correo/esto', data);
}

enviarCorreoFactuComun(url, numfactu, email, ruta, coop, codtipom): any {
  var data = {
    numfactu: numfactu,
    email: email,
    ruta: ruta,
    coop: coop,
    codtipom: codtipom
  };
  return this.http.post(url + '/api/facturas/enviar/correo/comun', data);
}

getEnlaces(url): any {
  return this.http.get(url + '/api/enlaces');
}

solicitarS2(url, sistema, tipo, clave, email): any {
  var data = {
    sistema,
    tipo,
    clave,
    email
  };
  return this.http.post(url + '/api/s2', data);
}

solicitarS2FacTienda(url, tipo, clave, email): any {
  var data = {
    sistema: "",
    tipo,
    clave,
    email
  };
  return this.http.post(url + '/api/s2/factura-tienda', data);
}

solicitarS2FacTelefonia(url, tipo, clave, email): any {
  var data = {
    sistema: "",
    tipo,
    clave,
    email
  };
  return this.http.post(url + '/api/s2/factura-telefonia', data);
}

solicitarS2FacAceite(url, tipo, clave, email): any {
  var data = {
    sistema: "ariagro",
    tipo,
    clave,
    email
  };
  console.log("POST INTERCAMBIO", data)
  return this.http.post(url + '/api/s2', data);
}

solicitarS2FacGasolinera(url, tipo, clave, email): any {
  var data = {
    sistema: "",
    tipo,
    clave,
    email
  };
  return this.http.post(url + '/api/s2/factura-gasolinera', data);
}

solicitarS2FacTratamiento(url, sistema, tipo, clave, email): any {
  var data = {
    sistema,
    tipo,
    clave,
    email
  };
  return this.http.post(url + '/api/s2/factura-tratamientos', data);
}

solicitarS2FacVarias(url, sistema, tipo, clave, email): any {
  var data = {
    sistema,
    tipo,
    clave,
    email
  };
  return this.http.post(url + '/api/s2/factura-varias', data);
}

}
