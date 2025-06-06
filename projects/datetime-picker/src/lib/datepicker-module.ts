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
import {NgxMatDatetimePicker} from './datepicker';
import {
  NgxMatDatepickerContent,
  NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datepicker-base';
import {NgxMatDatepickerInput} from './datepicker-input';
import {NgxMatDatepickerIntl} from './datepicker-intl';
import {NgxMatDatepickerToggle, NgxMatDatepickerToggleIcon} from './datepicker-toggle';
import {NgxMatMonthView} from './month-view';
import {NgxMatMultiYearView} from './multi-year-view';
import {NgxMatYearView} from './year-view';
import {NgxMatDateRangeInput} from './date-range-input';
import {NgxMatStartDate, NgxMatEndDate} from './date-range-input-parts';
import {NgxMatDateRangePicker} from './date-range-picker';
import {NgxMatDatepickerActions, NgxMatDatepickerApply, NgxMatDatepickerCancel} from './datepicker-actions';

@NgModule({
  imports: [
    MatButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    MatCommonModule,
    NgxMatCalendar,
    NgxMatCalendarBody,
    NgxMatDatetimePicker,
    NgxMatDatepickerContent,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatepickerToggleIcon,
    NgxMatMonthView,
    NgxMatYearView,
    NgxMatMultiYearView,
    NgxMatCalendarHeader,
    NgxMatDateRangeInput,
    NgxMatStartDate,
    NgxMatEndDate,
    NgxMatDateRangePicker,
    NgxMatDatepickerActions,
    NgxMatDatepickerCancel,
    NgxMatDatepickerApply,
  ],
  exports: [
    CdkScrollableModule,
    NgxMatCalendar,
    NgxMatCalendarBody,
    NgxMatDatetimePicker,
    NgxMatDatepickerContent,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatepickerToggleIcon,
    NgxMatMonthView,
    NgxMatYearView,
    NgxMatMultiYearView,
    NgxMatCalendarHeader,
    NgxMatDateRangeInput,
    NgxMatStartDate,
    NgxMatEndDate,
    NgxMatDateRangePicker,
    NgxMatDatepickerActions,
    NgxMatDatepickerCancel,
    NgxMatDatepickerApply,
  ],
  providers: [NgxMatDatepickerIntl, NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class NgxMatDatetimePickerModule {}
