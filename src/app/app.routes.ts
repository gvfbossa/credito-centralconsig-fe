import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClientesFormComponent } from './components/clientes/clientes-form/clientes-form.component';
import { ContasBancariasComponent } from './components/contas-bancarias/contas-bancarias.component';
import { ContasBancariasFormComponent } from './components/contas-bancarias/contas-bancarias-form/contas-bancarias-form.component';
import { ConveniosComponent } from './components/convenios/convenios.component';
import { ConveniosFormComponent } from './components/convenios/convenios-form/convenios-form.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'clientes/cadastro/novo', component: ClientesFormComponent },
    { path: 'clientes/cadastro/:cpf', component: ClientesFormComponent },
    { path: 'contas-bancarias', component: ContasBancariasComponent },
    { path: 'contas-bancarias/cadastro/:cpf', component: ContasBancariasFormComponent },
    { path: 'convenios', component: ConveniosComponent },
    { path: 'convenios/cadastro/novo', component: ConveniosFormComponent },
    { path: 'convenios/cadastro/:codigo', component: ConveniosFormComponent },
    { path: '**', redirectTo: '' }

];
