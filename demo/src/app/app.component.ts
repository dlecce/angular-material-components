import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatepickerInput, NgxMatDatepickerToggle, NgxMatDatetimePicker, NgxMatDatepickerActions, NgxMatDatepickerApply } from 'datetime-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMatDatetimePicker,
    NgxMatDatepickerToggle,
    NgxMatDatepickerInput,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
  dateControl = new FormControl<Date | null>(null);
}
