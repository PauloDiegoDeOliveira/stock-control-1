import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard], //Route guard
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/products/products.module').then(
        (m) => m.ProductsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./modules/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
    canActivate: [AuthGuard],//Para confirmar uma rota privada, liberada apenas para users logados
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules, //Cache dos módulos da aplicação para melhorar a performance
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
