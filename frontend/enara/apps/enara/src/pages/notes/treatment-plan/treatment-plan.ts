import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { Translation } from '../../../../src/sevices/translation';
import { medicinesInfo } from './IMedicinesInfo';


@Component({
  selector: 'app-treatment-plan',
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatDividerModule,
  ],
  templateUrl: './treatment-plan.html',
  styleUrl: './treatment-plan.css',
})
export default class TreatmentPlan {
  medicines = signal<medicinesInfo[]>([]);
  doz = '';
  drugName = '';
  intakeNotes = '';
  drankMedicinesBefore = '';
  translate = inject(Translation);

  private readonly _formBuilder = inject(FormBuilder);
  readonly toppings = this._formBuilder.group({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  @Output() sendTreatment = new EventEmitter<medicinesInfo[]>();

  private emit() {
    this.sendTreatment.emit(this.medicines());
  }

  onAddition() {
    const drugTimes: string[] = [];
    const values = this.toppings.value;
    if (values.breakfast) {
      drugTimes.push('breakfast');
    }
    if (values.lunch) {
      drugTimes.push('lunch');
    }
    if (values.dinner) {
      drugTimes.push('dinner');
    }
    const data = {
      doz: this.doz,
      drugName: this.drugName,
      intakeNotes: this.intakeNotes,
      drankMedicinesBefore: this.drankMedicinesBefore,
      drugTimes: drugTimes,
    };
    this.medicines.update((prev) => [...prev, data]);
    this.emit();
    this.resetForm();
  }
  private resetForm() {
    this.doz = '';
    this.drugName = '';
    this.intakeNotes = '';
    this.drankMedicinesBefore = '';
    this.toppings.reset({
      breakfast: false,
      lunch: false,
      dinner: false,
    });
  }
  onMedDelete(index: number) {
    this.medicines.update((prev) => prev.filter((_, i) => i !== index));
    this.emit();
  }
}
