import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss'],
})
export class ToolbarNavigationComponent {
  constructor(
    private cookie: CookieService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  //Fazer logout do sistema
  handleLogout(): void {
    this.cookie.delete('USER_INFO'); //Deleta o token JWT dos cookies
    void this.router.navigate(['/home']); //Redireciona para a tela de login, a rota '/home'
  }

  handleSaleProduct(): void {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
    this.dialogService.open(ProductFormComponent, {
      header: saleProductAction,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: saleProductAction },
      }
    });
  }
}
