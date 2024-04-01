import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartItem } from 'src/app/models/cart-item';

interface CityDistricts {
  [key: string]: string[];
}

@Component({
  selector: 'app-checkout1',
  templateUrl: './checkout1.component.html',
  styleUrls: ['../../../../assets/css/checkout.css']
})

export class Checkout1Component {

  public cartList: CartItem[] = [];
  public checkoutForm: FormGroup;
  public cityDistricts: CityDistricts = {
    '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
    '新北市': ['板橋區', '新莊區', '中和區', '永和區', '土城區', '樹林區', '三峽區', '鶯歌區', '三重區', '蘆洲區', '五股區'],
    '桃園市': ['桃園區', '中壢區', '大溪區', '楊梅區', '蘆竹區', '大園區', '龜山區', '八德區', '龍潭區', '平鎮區', '新屋區', '觀音區'],
    '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區'],
    '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區'],
    '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區'],
  };
  private selectedCity: string = ''; // 選擇的城市
  public districts: string[] = []; // 根據選擇的城市動態更改的地區清單
  

  constructor(private cartService: CartService, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.checkoutForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
      city: new FormControl('台北市'),
      district: new FormControl('中正區'),
      address: ['', Validators.required]
    });

    this.districts = this.cityDistricts['台北市'];
    // console.log('==>'+this.checkoutForm.value)
  }

  ngOnInit(): void {
    // 檢查是否為登入狀態
    if(this.authService.isAuthenticated()){    
      this.restoreFormData();   // 取得使用者先前輸入資料
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
      //     // console.log(this.cartList);
      //   },
      //   error: (err)=> console.log('Error:', err)
      // });
    }
  }

  ngOnDestroy(): void {
    // 如果使用者要離開此頁 儲存已輸入資料
    this.saveFormData();
  }

  // 儲存使用者資料
  private saveFormData(): void {
    sessionStorage.setItem('checkoutForm', JSON.stringify(this.checkoutForm.value));
  }

  // 取得使用者先前輸入資料
  private restoreFormData(): void {
    const savedFormData = sessionStorage.getItem('checkoutForm');
    if (savedFormData) {
      this.checkoutForm.setValue(JSON.parse(savedFormData));
      const formvalue = this.checkoutForm.value;
      this.districts = this.cityDistricts[formvalue.city];
      // console.log(this.checkoutForm.value);
    }
  }

  public onSubmit() {
    if (this.checkoutForm.valid) {    // 確認都有值後存到CartService
      const formValues = this.checkoutForm.value;
      const Name = `${formValues.FirstName}${formValues.LastName}`;
      const Phone = formValues.tel;
      const receiverAddress = `${formValues.city}${formValues.district}${formValues.address}`;
      this.cartService.setUserInfo(Name, Phone, receiverAddress);
      this.router.navigate(['/checkout/step2']);
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

  // 選擇縣市去改變區域
  public onCityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const city = selectElement.value;
    this.districts = this.cityDistricts[city] || this.cityDistricts[city];
    this.selectedCity = city;
  }  

  // 計算總金額
  public getTotalAmount(): number {
    return this.cartList.reduce((acc, product) => acc + (product.orderQuantity * product.price), 0);
  }  
}
