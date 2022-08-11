import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor( private http: HttpClient, private router: Router) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers(): Object {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role! ;
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
        localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img='', uid} = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid);
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError(error => of(false))
    );
  }


  crearUsuario(formData : RegisterForm) {

    return this.http.post(`${ base_url }/usuarios`, formData)
                    .pipe(
                      tap( (resp: any)=> {
                        this.guardarLocalStorage(resp.token, resp.menu);
                      })
                    );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string | undefined}) {
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${ base_url }/usuarios/${this.uid}`, data, this.headers);

  }

  login(formData : LoginForm) {

    return this.http.post(`${ base_url }/login`, formData)
                    .pipe(
                      tap( (resp: any)=> {
                        this.guardarLocalStorage(resp.token, resp.menu);
                      })
            );
    }

    loginGoogle ( token: string ) {
      return this.http.post(`${base_url}/login/google`, {token})
        .pipe(
          tap( (resp: any)=> {
            console.log(resp)
            this.guardarLocalStorage(resp.token, resp.menu);
          })
        )
    }

    cargarUsuario(desde: number=0) {
      const url = `${base_url}/usuarios?desde=${desde}`;
      return this.http.get<CargarUsuario>(url, this.headers)
              .pipe(
                map(resp => {
                  const usuarios = resp.usuarios.map(
                      user => new Usuario(user.nombre,
                                          user.email,
                                          '',
                                          user.img,
                                          user.google,
                                          user.role,
                                          user.uid
                                          ));
                  return { total: resp.total, usuarios };
                })
              );

    }

    eliminarUsuario(usuario: Usuario) {
      const url = `${base_url}/usuarios/${usuario.uid}`;
      return this.http.delete(url, this.headers);
    }

    guardarUsuario(usuario: Usuario) {

      return this.http.put(`${ base_url }/usuarios/${usuario.uid}`, usuario, this.headers);

    }
}
