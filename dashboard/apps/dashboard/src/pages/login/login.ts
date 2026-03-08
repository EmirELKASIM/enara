import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  accessCode = '';
  private router = inject(Router);
  checkCode() {
    if (this.accessCode === "123") {
      return true;
    } else {
      return false;
    }
  }
  onSubmit() {
    const isTrue = this.checkCode();
    console.log('pressed');

    if (isTrue) {
      this.router.navigate(['home']);
    }
  }
}
