import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { CadastroUsuarioComponent } from './components/admin/cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'menu', component: MenuComponent},
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'admin/usuarios/novo', component: CadastroUsuarioComponent },
  { path: 'admin/usuarios/editar/:id', component: CadastroUsuarioComponent }
];
