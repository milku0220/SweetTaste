import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout3',
  templateUrl: './checkout3.component.html',
  styleUrls: ['../../../../assets/css/checkout.css']
})
export class Checkout3Component {

  public cartList: CartItem[] = [];
  public InvoiceType: 'electronic' | 'mail' = 'electronic';
  public checkoutForm: FormGroup;

  constructor(private cartService: CartService, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.checkoutForm = this.formBuilder.group({
      // FirstName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){    //檢查是否為登入狀態
      this.cartService.getUserCart().subscribe(   // 取得購物車內容
        cartList => {
          this.cartList = cartList;
        }
      )
      // this.cartService.getUserCart().subscribe({    //取得購物車內容
      //   next: (resp) =>{
      //     this.cartList = resp.data.map((productData: any[]) => {
      //       const product = new Product();
      //       product.productId = productData[resp.fieldIndex.productId];
      //       product.orderQuantity = productData[resp.fieldIndex.orderQuantity];
      //       product.name = productData[resp.fieldIndex.name];
      //       product.price = productData[resp.fieldIndex.price];
      //       product.inventories = productData[resp.fieldIndex.inventories];
      //       product.img = productData[resp.fieldIndex.img];
      //       return product;
      //     });
      //     console.log(this.cartList);
      //   },
      //   error: (err)=> console.log('Error:', err)
      // });
    }
  }

  //計算總金額
  public getTotalAmount(): number {
    return this.cartList.reduce((acc, product) => acc + (product.orderQuantity * product.price), 0);
  }

  //更換發票方式
  public selectInvoiceType(type: 'electronic' | 'mail') {
    this.InvoiceType = type;
  }

  //完成結帳動作
  checkout() {
    this.cartService.checkoutUserCart().subscribe({
      next: (resp)=>{
        console.log(resp.message);
        this.cartService.updateCartItemCount();
      },
      error: (err)=>{
        console.log('Error', err);
      }
    })  
  }
    
  
}
