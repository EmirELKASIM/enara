import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { apiUrl } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-payment-iyzico',
  imports: [FormsModule],
  templateUrl: './payment-iyzico.html',
  styleUrl: './payment-iyzico.css',
})
export default class PaymentIyzico {
  name = '';
  surname = '';
  email = '';
  gsmNumber = '';
  address = '';
  city = '';
  country = '';
  cardNumber = '';
  expireMonth = '';
  expireYear = '';
  cvc = '';
  loading = false;
  showPaymentForm = false;
  checkoutFormContent!: SafeHtml;
  private paymentLink = `${apiUrl}/payment/create-payment`;
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  checkData() {
    if (
      !this.name ||
      !this.surname ||
      !this.email ||
      !this.gsmNumber ||
      !this.address ||
      !this.city ||
      !this.country
    ) {
      return false;
    } else {
      return true;
    }
  }

 

  submit() {
    const data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      gsmNumber: this.gsmNumber,
      address: this.address,
      city: this.city,
      country: this.country,
    };
  
    this.loading = true;
    this.http.post<any>(this.paymentLink, data).subscribe({
      next: (res) => {
        this.checkoutFormContent = this.sanitizer.bypassSecurityTrustHtml(
          res.checkoutFormContent,
        );
        this.loading = false;
        setTimeout(() => {
          this.executeIyziScript(res.checkoutFormContent);
        }, 100);
        this.showPaymentForm = true;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
  private executeIyziScript(htmlString: string) {
    
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    const match = scriptRegex.exec(htmlString);

    if (match && match[1]) {
      const scriptCode = match[1];
      try {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.text = scriptCode;
        
        document.body.appendChild(scriptElement);
      } catch (e) {
        console.error('Error executing iyzico script:', e);
      }
    }
  }
}
