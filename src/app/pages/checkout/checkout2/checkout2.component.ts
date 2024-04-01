import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout2',
  templateUrl: './checkout2.component.html',
  styleUrls: ['../../../../assets/css/checkout.css']
})
export class Checkout2Component implements OnInit{

  public cartList: CartItem[] = [];
  public checkoutForm: FormGroup;
  private currentYearShort: number = new Date().getFullYear() % 100;
  public years: number[] = Array.from({length: 11}, (_, i) => this.currentYearShort + i);

  constructor(private cartService: CartService, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.checkoutForm = this.formBuilder.group({
      CardNum: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],
      CardUser: ['', Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required],
      securityCode: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){    // 檢查是否為登入狀態
      this.cartService.getUserCart().subscribe(   // 取得購物車內容
        cartList => {
          this.cartList = cartList;
        }
      )
      // this.cartService.getUserCart().subscribe({    // 取得購物車內容
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

  // 驗證
  public onSubmit() {
    if (this.checkoutForm.valid) {
      this.router.navigate(['/checkout/step3']);
    } 
    else {
      Object.keys(this.checkoutForm.controls).forEach(field => {
        const control = this.checkoutForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  //計算總金額
  public getTotalAmount(): number {
    return this.cartList.reduce((acc, product) => acc + (product.orderQuantity * product.price), 0);
  }  
}
