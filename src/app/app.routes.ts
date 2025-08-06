@@ .. @@
 import { MenuComponent } from './menu/menu.component';
 import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
 import { CadastroUsuarioComponent } from './components/admin/cadastro-usuario/cadastro-usuario.component';
+import { CadastroUnidadeComponent } from './components/admin/cadastro-unidade/cadastro-unidade.component';
+import { ListaUnidadesComponent } from './components/shared/lista-unidades/lista-unidades.component';
+import { CadastroExtintorComponent } from './components/shared/cadastro-extintor/cadastro-extintor.component';
+import { DashboardTecnicoComponent } from './components/tecnico/dashboard-tecnico/dashboard-tecnico.component';
 
 export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent, pathMatch: 'full' },
   { path: 'menu', component: MenuComponent},
+  { path: 'tecnico/dashboard', component: DashboardTecnicoComponent },
   { path: 'admin/dashboard', component: DashboardAdminComponent },
   { path: 'admin/usuarios/novo', component: CadastroUsuarioComponent },
-  { path: 'admin/usuarios/editar/:id', component: CadastroUsuarioComponent }
+  { path: 'admin/usuarios/editar/:id', component: CadastroUsuarioComponent },
+  { path: 'admin/unidades', component: ListaUnidadesComponent },
+  { path: 'admin/unidades/nova', component: CadastroUnidadeComponent },
+  { path: 'admin/unidades/editar/:id', component: CadastroUnidadeComponent },
+  { path: 'extintores', component: ListaUnidadesComponent }, // Temporário - será substituído por lista de extintores
+  { path: 'extintores/novo', component: CadastroExtintorComponent },
+  { path: 'extintores/editar/:id', component: CadastroExtintorComponent }
 ];