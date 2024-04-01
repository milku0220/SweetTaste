import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomDialogComponent } from 'src/app/models/custom-dialog/custom-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TypeInfo } from 'src/app/models/type-info';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public productsList: Product[] = [];
  public productTypes: TypeInfo[] = [];
  public activeType: number | null = 1; 
  private category: string | null = "";   // queryParams
  private chName: string = "";    // queryParams
  public paginatedProductsList: Product[] = [];  // 當前顯示商品List
  public curPage: number = 1;
  private productsPerPage: number = 6;  // 一頁最多顯示幾個商品
  public totalPages: number = 0;

  constructor(private productService: ProductService, private cartService: CartService, private router: Router, 
    private activatedRoute: ActivatedRoute, public dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    // 取得商品資料
    this.loadProductTypes(); 

    this.activatedRoute.queryParams.subscribe(params => {
      this.category = params['category'] || null;
      this.chName = params['chName'] || "本日精選";

      if(this.category){
        this.activeType = Number(this.category);
        console.log('Current category:', this.activeType);
      }
      this.getProduucts(Number(this.activeType), this.chName);
      // console.log('===>'+this.chName);
    });
  }


  // 取得所有productType
  private loadProductTypes(): void {
    this.productService.getAllProductTypes().subscribe({
      next: (resp) => {
        this.productTypes = resp.data.map((infoData: any[]) => {
          const type = new TypeInfo();
          type.typeId = infoData[resp.fieldIndex.typeId];
          type.chinese = infoData[resp.fieldIndex.chinese];
          type.status = infoData[resp.fieldIndex.status];
          return type;
        });
        //  console.log(this.productTypes);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // 根據productType取得該種類所有product
  public getProduucts(typeId: number, chName: string) {
    this.activeType = typeId;
    this.curPage = 1;
    
    // 取得product
    this.productService.getProductsByTypeId(typeId, chName).subscribe({
      next: (products) => {
        this.productsList = products;
        this.calculateTotalPages();
        this.paginateProducts();
      },
      error: (err) => {
        console.log('Error', err);
        this.productsList = [];
        this.paginatedProductsList = [];
      }
    });
  }

  // 清除active狀態
  public clearActiveType() {
    this.activeType = null;
  }

  // 當加入購物車被點擊時 取得商品Id跟數量
  public getInfoCart(productId: number, orderQuantity: number) { 
    const token = this.authService.getUserToken(); 
    
    if (this.authService.isAuthenticated()) {   // 有登入的情況
      const userCarts = [{ 
        productId: productId, 
        orderQuantity: orderQuantity 
      }];
      const data = {
        token: token,
        userCarts: userCarts,
      };

      // 檢查庫存數量是否足夠
      this.cartService.batchUpdateUserCart(data).subscribe({
        next: (resp) => {
          // console.log(resp);
          if (token)
            this.addToCart(token, productId, orderQuantity);
        },
        error: (err) => {
          console.log('Error', err);
          this.openDialog('庫存不足!');
        }
      });
    } 
    else {  // 沒有登入
      this.openDialog('你尚未登入 !');
      this.router.navigate(['/login']);
      return;
    }
  }
    
// 將商品加入購物車
private addToCart(token: string, productId: number, orderQuantity: number){

  this.cartService.addUserCart(token, productId, orderQuantity).subscribe({
    next: (resp)=> {
      console.log(token, productId, orderQuantity);
      console.log(resp);
      this.openDialog('成功加入購物車');
      this.cartService.updateCartItemCount();   // 更新購物車icon數量
    },
    error: (err)=> {
      console.log('Error', err.error.message);
      this.openDialog('驗證過期 請重新登入');
      this.router.navigate(['/login']);
    }
  })
}
  
  // Dialog
  public openDialog(msg: string): void {
    this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: { message: msg }, 
    });
  }

  // 計算總頁數
  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.productsList.length / this.productsPerPage);
  }

  // 找到頁數對應的開始結束index=>放入List
  private paginateProducts(): void {
    const startIndex = (this.curPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.paginatedProductsList = this.productsList.slice(startIndex, endIndex);
  }

  // 當頁數改變時
  public changePage(pageNumber: number): void {
    if(pageNumber >= 1 && pageNumber <= this.totalPages){
      this.curPage = pageNumber;
      this.paginateProducts();
      window.scrollTo(0, 600);
    }
  }
    
}
