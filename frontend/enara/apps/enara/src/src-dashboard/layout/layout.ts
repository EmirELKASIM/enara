import { Component, inject } from '@angular/core';
import { BackButtonService } from '../../sevices/back-button-service';
import { AsyncPipe, Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import Dashboard from '../dashboard-pages/dashboard';

@Component({
  selector: 'app-layout',
  imports: [Dashboard,AsyncPipe,MatToolbarModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export default class Layout {
  backService = inject(BackButtonService);
  location = inject(Location);
  goBack() {
    this.location.back();
    this.backService.hide();
  }
}
