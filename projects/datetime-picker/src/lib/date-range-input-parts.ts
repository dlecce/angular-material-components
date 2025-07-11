/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Directionality} from '@angular/cdk/bidi';
import {BACKSPACE, LEFT_ARROW, RIGHT_ARROW} from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  Directive,
  DoCheck,
  ElementRef,
  Injector,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {ErrorStateMatcher, _ErrorStateTracker} from '@angular/material/core';
import {_computeAriaAccessibleName} from './aria-accessible-name';
import {NgxDateRange, NgxDateSelectionModelChange} from './date-selection-model';
import {NgxMatDatepickerInputBase} from './datepicker-input-base';
import {NgxMatDateRangeInput} from './date-range-input';

/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 */
@Directive()
abstract class MatDateRangeInputPartBase<D>
  extends NgxMatDatepickerInputBase<NgxDateRange<D>>
  implements OnInit, AfterContentInit, DoCheck
{
  _rangeInput = inject<NgxMatDateRangeInput<D>>(NgxMatDateRangeInput);
  override _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  _defaultErrorStateMatcher = inject(ErrorStateMatcher);
  private _injector = inject(Injector);
  _parentForm = inject(NgForm, {optional: true});
  _parentFormGroup = inject(FormGroupDirective, {optional: true});

  /**
   * Form control bound to this input part.
   * @docs-private
   */
  ngControl: NgControl;

  protected abstract override _validator: ValidatorFn | null;
  protected abstract override _assignValueToModel(value: D | null): void;
  protected abstract override _getValueFromModel(modelValue: NgxDateRange<D>): D | null;
  protected abstract _register(): void;
  protected readonly _dir = inject(Directionality, {optional: true});
  private _errorStateTracker: _ErrorStateTracker;

  /** Object used to control when error messages are shown. */
  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: ErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /** Whether the input is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  constructor(...args: unknown[]);

  constructor() {
    super();

    this._errorStateTracker = new _ErrorStateTracker(
      this._defaultErrorStateMatcher,
      null,
      this._parentFormGroup,
      this._parentForm,
      this.stateChanges,
    );
  }

  ngOnInit() {
    // We need the date input to provide itself as a `ControlValueAccessor` and a `Validator`, while
    // injecting its `NgControl` so that the error state is handled correctly. This introduces a
    // circular dependency, because both `ControlValueAccessor` and `Validator` depend on the input
    // itself. Usually we can work around it for the CVA, but there's no API to do it for the
    // validator. We work around it here by injecting the `NgControl` in `ngOnInit`, after
    // everything has been resolved.
    const ngControl = this._injector.get(NgControl, null, {optional: true, self: true});

    if (ngControl) {
      this.ngControl = ngControl;
      this._errorStateTracker.ngControl = ngControl;
    }
  }

  ngAfterContentInit(): void {
    this._register();
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  /** Gets whether the input is empty. */
  isEmpty(): boolean {
    return this._elementRef.nativeElement.value.length === 0;
  }

  /** Gets the placeholder of the input. */
  _getPlaceholder() {
    return this._elementRef.nativeElement.placeholder;
  }

  /** Focuses the input. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** Gets the value that should be used when mirroring the input's size. */
  getMirrorValue(): string {
    const element = this._elementRef.nativeElement;
    const value = element.value;
    return value.length > 0 ? value : element.placeholder;
  }

  /** Refreshes the error state of the input. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** Handles `input` events on the input element. */
  override _onInput(value: string) {
    super._onInput(value);
    this._rangeInput._handleChildValueChange();
  }

  /** Opens the datepicker associated with the input. */
  protected _openPopup(): void {
    this._rangeInput._openDatepicker();
  }

  /** Gets the minimum date from the range input. */
  _getMinDate() {
    return this._rangeInput.min;
  }

  /** Gets the maximum date from the range input. */
  _getMaxDate() {
    return this._rangeInput.max;
  }

  /** Gets the date filter function from the range input. */
  protected _getDateFilter() {
    return this._rangeInput.dateFilter;
  }

  protected override _parentDisabled() {
    return this._rangeInput._groupDisabled;
  }

  protected _shouldHandleChangeEvent({source}: NgxDateSelectionModelChange<NgxDateRange<D>>): boolean {
    return source !== this._rangeInput._startInput && source !== this._rangeInput._endInput;
  }

  protected override _assignValueProgrammatically(value: D | null) {
    super._assignValueProgrammatically(value);
    const opposite = (
      this === (this._rangeInput._startInput as MatDateRangeInputPartBase<D>)
        ? this._rangeInput._endInput
        : this._rangeInput._startInput
    ) as MatDateRangeInputPartBase<D> | undefined;
    opposite?._validatorOnChange();
  }

  protected override _formatValue(value: D | null) {
    super._formatValue(value);
    // Any time the input value is reformatted we need to tell the parent.
    this._rangeInput._handleChildValueChange();
  }

  /** return the ARIA accessible name of the input element */
  _getAccessibleName(): string {
    return _computeAriaAccessibleName(this._elementRef.nativeElement);
  }
}

/** Input for entering the start date in a `mat-date-range-input`. */
@Directive({
  selector: 'input[ngxMatStartDate]',
  host: {
    'class': 'mat-start-date mat-date-range-input-inner',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(keydown)': '_onKeydown($event)',
    '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
    '[attr.aria-owns]': `_rangeInput._ariaOwns
        ? _rangeInput._ariaOwns()
        : (_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null`,
    '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
    '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
    '(blur)': '_onBlur()',
    'type': 'text',
  },
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: NgxMatStartDate, multi: true},
    {provide: NG_VALIDATORS, useExisting: NgxMatStartDate, multi: true},
  ],
  // These need to be specified explicitly, because some tooling doesn't
  // seem to pick them up from the base class. See #20932.
  outputs: ['dateChange', 'dateInput'],
})
export class NgxMatStartDate<D> extends MatDateRangeInputPartBase<D> {
  /** Validator that checks that the start date isn't after the end date. */
  private _startValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    const end = this._model ? this._model.selection.end : null;
    return !start || !end || this._dateAdapter.compareDate(start, end) <= 0
      ? null
      : {'matStartDateInvalid': {'end': end, 'actual': start}};
  };

  protected _validator = Validators.compose([...super._getValidators(), this._startValidator]);

  protected override _register(): void {
    this._rangeInput._startInput = this;
  }

  protected _getValueFromModel(modelValue: NgxDateRange<D>) {
    return modelValue.start;
  }

  protected override _shouldHandleChangeEvent(
    change: NgxDateSelectionModelChange<NgxDateRange<D>>,
  ): boolean {
    if (!super._shouldHandleChangeEvent(change)) {
      return false;
    } else {
      return !change.oldValue?.start
        ? !!change.selection.start
        : !change.selection.start ||
            !!this._dateAdapter.compareDate(change.oldValue.start, change.selection.start);
    }
  }

  protected _assignValueToModel(value: D | null) {
    if (this._model) {
      const range = new NgxDateRange(value, this._model.selection.end);
      this._model.updateSelection(range, this);
      this._rangeInput._handleChildValueChange();
    }
  }

  override _onKeydown(event: KeyboardEvent) {
    const endInput = this._rangeInput._endInput;
    const element = this._elementRef.nativeElement;
    const isLtr = this._dir?.value !== 'rtl';

    // If the user hits RIGHT (LTR) when at the end of the input (and no
    // selection), move the cursor to the start of the end input.
    if (
      ((event.keyCode === RIGHT_ARROW && isLtr) || (event.keyCode === LEFT_ARROW && !isLtr)) &&
      element.selectionStart === element.value.length &&
      element.selectionEnd === element.value.length
    ) {
      event.preventDefault();
      endInput._elementRef.nativeElement.setSelectionRange(0, 0);
      endInput.focus();
    } else {
      super._onKeydown(event);
    }
  }
}

/** Input for entering the end date in a `mat-date-range-input`. */
@Directive({
  selector: 'input[ngxMatEndDate]',
  host: {
    'class': 'mat-end-date mat-date-range-input-inner',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(keydown)': '_onKeydown($event)',
    '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
    '[attr.aria-owns]': `_rangeInput._ariaOwns
        ? _rangeInput._ariaOwns()
        : (_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null`,
    '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
    '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
    '(blur)': '_onBlur()',
    'type': 'text',
  },
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: NgxMatEndDate, multi: true},
    {provide: NG_VALIDATORS, useExisting: NgxMatEndDate, multi: true},
  ],
  // These need to be specified explicitly, because some tooling doesn't
  // seem to pick them up from the base class. See #20932.
  outputs: ['dateChange', 'dateInput'],
})
export class NgxMatEndDate<D> extends MatDateRangeInputPartBase<D> {
  /** Validator that checks that the end date isn't before the start date. */
  private _endValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const end = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const start = this._model ? this._model.selection.start : null;
    return !end || !start || this._dateAdapter.compareDate(end, start) >= 0
      ? null
      : {'matEndDateInvalid': {'start': start, 'actual': end}};
  };

  protected override _register(): void {
    this._rangeInput._endInput = this;
  }

  protected _validator = Validators.compose([...super._getValidators(), this._endValidator]);

  protected _getValueFromModel(modelValue: NgxDateRange<D>) {
    return modelValue.end;
  }

  protected override _shouldHandleChangeEvent(
    change: NgxDateSelectionModelChange<NgxDateRange<D>>,
  ): boolean {
    if (!super._shouldHandleChangeEvent(change)) {
      return false;
    } else {
      return !change.oldValue?.end
        ? !!change.selection.end
        : !change.selection.end ||
            !!this._dateAdapter.compareDate(change.oldValue.end, change.selection.end);
    }
  }

  protected _assignValueToModel(value: D | null) {
    if (this._model) {
      const range = new NgxDateRange(this._model.selection.start, value);
      this._model.updateSelection(range, this);
    }
  }

  private _moveCaretToEndOfStartInput() {
    const startInput = this._rangeInput._startInput._elementRef.nativeElement;
    const value = startInput.value;

    if (value.length > 0) {
      startInput.setSelectionRange(value.length, value.length);
    }

    startInput.focus();
  }

  override _onKeydown(event: KeyboardEvent) {
    const element = this._elementRef.nativeElement;
    const isLtr = this._dir?.value !== 'rtl';

    // If the user is pressing backspace on an empty end input, move focus back to the start.
    if (event.keyCode === BACKSPACE && !element.value) {
      this._moveCaretToEndOfStartInput();
    }
    // If the user hits LEFT (LTR) when at the start of the input (and no
    // selection), move the cursor to the end of the start input.
    else if (
      ((event.keyCode === LEFT_ARROW && isLtr) || (event.keyCode === RIGHT_ARROW && !isLtr)) &&
      element.selectionStart === 0 &&
      element.selectionEnd === 0
    ) {
      event.preventDefault();
      this._moveCaretToEndOfStartInput();
    } else {
      super._onKeydown(event);
    }
  }
}
