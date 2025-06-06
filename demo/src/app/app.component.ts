import { Component } from '@angular/core';
import { DatetimePickerComponent } from "../../../projects/datetime-picker/src/lib/datetime-picker.component";

@Component({
  selector: 'app-root',
  imports: [DatetimePickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
