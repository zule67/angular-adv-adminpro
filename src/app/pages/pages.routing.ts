import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimiento/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimiento/medicos/medicos.component';
import { MedicoComponent } from './mantenimiento/medicos/medico.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: {titulo:'Dashboard'}},
      { path: 'progress', component: ProgressComponent, data: {titulo:'Progress'}},
      { path: 'grafica1', component: Grafica1Component, data: {titulo:'Grafica1'}},
      { path: 'account-settings', component: AccountSettingsComponent, data: {titulo:'Account-settings'}},
      { path: 'promesas', component: PromesasComponent, data: {titulo:'Promesas'}},
      { path: 'rxjs', component: RxjsComponent, data: {titulo:'Rxjs'}},
      { path: 'perfil', component: PerfilComponent , data: {titulo:'Perfil de usuario'}},

      // Mantenimiento
      { path: 'usuarios', component: UsuariosComponent, data: {titulo:'Usuario de aplicación'}},
      { path: 'medicos', component: MedicosComponent, data: {titulo:'Mantenimiento de médicos'}},
      { path: 'medico/:id', component: MedicoComponent, data: {titulo:'Mantenimiento de médicos'}},
      { path: 'hospitales', component: HospitalesComponent, data: {titulo:'Mantenimiento de hospitales'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
