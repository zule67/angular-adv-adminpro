import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  public menuItems!: any[];
  public usuario!: Usuario;

  constructor(private sideBarService : SidebarService, private usuarioService: UsuarioService) {
    this.menuItems = sideBarService.menu;
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }

}
