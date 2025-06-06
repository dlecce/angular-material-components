/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {A11yModule} from '@angular/cdk/a11y';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import {MatCommonModule} from '@angular/material/core';
import {NgxMatCalendar, NgxMatCalendarHeader} from './calendar';
import {NgxMatCalendarBody} from './calendar-body';
import {MatDatepicker} from './datepicker';
import {
  NgxMatDatepickerContent,
  MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datepicker-base';
import {MatDatepickerInput} from './datepicker-input';
import {MatDatepickerIntl} from './datepicker-intl';
import {MatDatepickerToggle, MatDatepickerToggleIcon} from './datepicker-toggle';
import {MatMonthView} from './month-view';
import {MatMultiYearView} from './multi-year-view';
import {MatYearView} from './year-view';
import {NgxMatDateRangeInput} from './date-range-input';
import {MatStartDate, MatEndDate} from './date-range-input-parts';
import {NgxMatDateRangePicker} from './date-range-picker';
import {NgxMatDatepickerActions, MatDatepickerApply, MatDatepickerCancel} from './datepicker-actions';

@NgModule({
  imports: [
    MatButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    MatCommonModule,
    NgxMatCalendar,
    NgxMatCalendarBody,
    MatDatepicker,
    NgxMatDatepickerContent,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatMonthView,
    MatYearView,
    MatMultiYearView,
    NgxMatCalendarHeader,
    NgxMatDateRangeInput,
    MatStartDate,
    MatEndDate,
    NgxMatDateRangePicker,
    NgxMatDatepickerActions,
    MatDatepickerCancel,
    MatDatepickerApply,
  ],
  exports: [
    CdkScrollableModule,
    NgxMatCalendar,
    NgxMatCalendarBody,
    MatDatepicker,
    NgxMatDatepickerContent,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatMonthView,
    MatYearView,
    MatMultiYearView,
    NgxMatCalendarHeader,
    NgxMatDateRangeInput,
    MatStartDate,
    MatEndDate,
    NgxMatDateRangePicker,
    NgxMatDatepickerActions,
    MatDatepickerCancel,
    MatDatepickerApply,
  ],
  providers: [MatDatepickerIntl, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class MatDatepickerModule {}
