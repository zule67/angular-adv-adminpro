import { ModalImagenService } from './../../../services/modal-imagen.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;


  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService
              ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay (100))
    .subscribe(() => { this.cargarUsuarios() });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuario(this.desde)
    .subscribe(({total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios= usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if(this.desde < 0){
      this.desde=0
      } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
      }
      this.cargarUsuarios();
  }

  buscar(termino: string) {

    if(termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios', termino)
                        .subscribe(resultados => {
                          this.usuarios = resultados as Usuario[];
                        })
  }

  eliminarUsuario(usuario: Usuario) {

    if(usuario.uid === this.usuarioService.usuario.uid) {
      return Swal.fire('Error al intentar borrar al usuario logueado', 'error');
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario)
                            .subscribe(resp => {
                              this.cargarUsuarios();
                              Swal.fire('Usuario borrado', `${usuario.nombre} fue eliminado correctamente`, 'success');
                            })

      }
    })
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe( resp => {
      console.log(resp)
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
