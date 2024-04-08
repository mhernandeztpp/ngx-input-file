import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { defaultSettings } from '../../settings/default.settings';
import { InputFileRejectedReason } from '../../enums/input-file-rejected-reason';
import { urlValidator } from '../../validators/url.validator';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../services/input-file.service";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/common";
import * as i7 from "../../directives/drop-zone/drop-zone.directive";
import * as i8 from "@angular/material/input";
export class InputFileComponent {
    constructor(formBuilder, inputFileService) {
        this.formBuilder = formBuilder;
        this.inputFileService = inputFileService;
        this.acceptedFile = new EventEmitter();
        this.deletedFile = new EventEmitter();
        this.rejectedFile = new EventEmitter();
        this.files = new Array();
        this.id = `ngx-input-file-${InputFileComponent.nextId++}`;
        this.onChange = (files) => { };
        this.onTouched = () => { };
    }
    set classAnimation(classAnimation) {
        this._classAnimation = classAnimation;
    }
    get classAnimation() {
        return this._classAnimation || this.inputFileService.config.classAnimation || defaultSettings.classAnimation;
    }
    set fileAccept(fileAccept) {
        this._fileAccept = fileAccept;
    }
    get fileAccept() {
        return this._fileAccept || this.inputFileService.config.fileAccept || defaultSettings.fileAccept;
    }
    set fileLimit(fileLimit) {
        this._fileLimit = fileLimit;
    }
    get fileLimit() {
        return this._fileLimit || this.inputFileService.config.fileLimit || defaultSettings.fileLimit;
    }
    set iconAdd(iconAdd) {
        this._iconAdd = iconAdd;
    }
    get iconAdd() {
        return this._iconAdd || this.inputFileService.config.iconAdd || defaultSettings.iconAdd;
    }
    set iconDelete(iconDelete) {
        this._iconDelete = iconDelete;
    }
    get iconDelete() {
        return this._iconDelete || this.inputFileService.config.iconDelete || defaultSettings.iconDelete;
    }
    set iconFile(iconFile) {
        this._iconFile = iconFile;
    }
    get iconFile() {
        return this._iconFile || this.inputFileService.config.iconFile || defaultSettings.iconFile;
    }
    set iconLink(iconLink) {
        this._iconLink = iconLink;
    }
    get iconLink() {
        return this._iconLink || this.inputFileService.config.iconLink || defaultSettings.iconLink;
    }
    set linkEnabled(linkEnabled) {
        this._linkEnabled = linkEnabled;
    }
    get linkEnabled() {
        return this._linkEnabled || this.inputFileService.config.linkEnabled || defaultSettings.linkEnabled;
    }
    set placeholderLink(placeholderLink) {
        this._placeholderLink = placeholderLink;
    }
    get placeholderLink() {
        return this._placeholderLink || this.inputFileService.config.placeholderLink || defaultSettings.placeholderLink;
    }
    set sizeLimit(sizeLimit) {
        this._sizeLimit = sizeLimit;
    }
    get sizeLimit() {
        return this._sizeLimit || this.inputFileService.config.sizeLimit || defaultSettings.sizeLimit;
    }
    get canAddFile() {
        return this.files && this.files.length < this.fileLimit;
    }
    /**
     * Angular lifecyle OnInit implementation.
     */
    ngOnInit() {
        this.setForm();
    }
    /**
     * On delete a file event handler.
     * @param index
     */
    onDeleteFile(index) {
        if (!this.disabled) {
            const files = this.files.slice();
            this.deletedFile.emit(files[index]);
            files.splice(index, 1);
            this.writeValue(files);
        }
    }
    /**
     * On drag over event handler.
     * Adds a ripple effect on the button.
     */
    onDragOver(button) {
        button.ripple.launch({ centered: true, persistent: true });
    }
    /**
     * On drag leave event handler.
     * Fades the ripple effect of the button.
     */
    onDragLeave(button) {
        button.ripple.fadeOutAll();
    }
    /**
     * On adds a link.
     */
    onLink() {
        this.addLink = !this.addLink;
    }
    /**
     * On replace one file event handler.
     * Writes the value.
     * @param fileList
     * @param index
     * @param fileInput
     */
    onReplaceFile(e, index, button, fileInput) {
        const fileList = e.currentTarget.files;
        if (!this.disabled) {
            // Copies the array without reference.
            const files = this.files.slice();
            // Assumes that a single file can be replaced by a single file.
            const inputFile = { file: fileList.item(0) };
            button.ripple.fadeOutAll();
            if (this.fileGuard(files, inputFile, true)) {
                files[index] = inputFile;
                this.acceptedFile.emit(inputFile);
            }
            this.writeValue(files);
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }
    /**
     * On select one or more files event handler.
     * Writes the value.
     * @param fileList
     */
    onSelectFile(e, button) {
        const fileList = e.currentTarget.files;
        if (!this.disabled) {
            button.ripple.fadeOutAll();
            // Copies the array without reference.
            const files = this.files.slice();
            Array.from(fileList).forEach(file => {
                const inputFile = { file };
                if (this.fileGuard(files, inputFile)) {
                    files.push(inputFile);
                    this.acceptedFile.emit(inputFile);
                }
            });
            this.writeValue(files);
            this.fileInput.nativeElement.value = '';
        }
    }
    /**
     * On submit the link form event handler.
     */
    onSubmitLink() {
        if (!this.disabled && this.form.valid) {
            const files = this.files.slice();
            const inputFile = { link: this.form.value.link, preview: this.form.value.link };
            files.push(inputFile);
            this.acceptedFile.emit(inputFile);
            this.onLink();
            this.form.reset();
            this.writeValue(files);
        }
    }
    /**
     * Implementation of ControlValueAccessor.
     * @param fn
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Implementation of ControlValueAccessor.
     * @param fn
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Implementation of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Implementation of ControlValueAccessor.
     * @param files
     */
    writeValue(files) {
        if (!files) {
            files = new Array();
        }
        this.files = files;
        this.setFilePreview();
        this.onChange(this.files);
    }
    /**
     * Whether the file can be added to the model.
     * @param files
     * @param file,
     * @param bypassLimit
     */
    fileGuard(files, file, bypassLimit) {
        if (!bypassLimit && !this.inputFileService.limitGuard(files, this.fileLimit)) {
            this.rejectedFile.emit({ reason: InputFileRejectedReason.limitReached, file });
            return false;
        }
        if (!this.inputFileService.sizeGuard(file.file, this.sizeLimit)) {
            this.rejectedFile.emit({ reason: InputFileRejectedReason.sizeReached, file });
            return false;
        }
        if (!this.inputFileService.typeGuard(file.file, this.fileAccept)) {
            this.rejectedFile.emit({ reason: InputFileRejectedReason.badFile, file });
            return false;
        }
        return true;
    }
    /**
     * Sets the file preview with FileReader.
     */
    setFilePreview() {
        for (const index in this.files) {
            if (this.files[index].file != null && this.inputFileService.typeGuard(this.files[index].file, 'image/*')) {
                const fr = new FileReader();
                fr.onload = () => {
                    this.files[index].preview = fr.result;
                };
                fr.readAsDataURL(this.files[index].file);
            }
        }
    }
    /**
     * Sets the reactive form to insert a link.
     */
    setForm() {
        this.form = this.formBuilder.group({
            link: ['', [Validators.required, urlValidator]]
        });
    }
}
InputFileComponent.nextId = 0;
InputFileComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileComponent, deps: [{ token: i1.FormBuilder }, { token: i2.InputFileService }], target: i0.ɵɵFactoryTarget.Component });
InputFileComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: InputFileComponent, selector: "input-file", inputs: { disabled: "disabled", placeholder: "placeholder", classAnimation: "classAnimation", fileAccept: "fileAccept", fileLimit: "fileLimit", iconAdd: "iconAdd", iconDelete: "iconDelete", iconFile: "iconFile", iconLink: "iconLink", linkEnabled: "linkEnabled", placeholderLink: "placeholderLink", sizeLimit: "sizeLimit" }, outputs: { acceptedFile: "acceptedFile", deletedFile: "deletedFile", rejectedFile: "rejectedFile" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFileComponent),
            multi: true
        }
    ], viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true }], ngImport: i0, template: "<div class=\"input-file-container\">\n    <label class=\"mat-orphan-label\" [for]=\"id\" [class.active]=\"files?.length\" [innerHtml]=\"placeholder\" *ngIf=\"placeholder\"></label>\n    <div class=\"files-container\">\n\n        <ng-container *ngFor=\"let file of files; let i = index\">\n            <div class=\"file-container\" [ngClass]=\"classAnimation\">\n                <ng-container *ngTemplateOutlet=\"fileTemplate; context: { $implicit: file, index: i }\"></ng-container>\n            </div>\n        </ng-container>\n\n        <ng-container *ngIf=\"canAddFile\">\n            <div class=\"file-container\">\n                <ng-container *ngIf=\"!addLink; else linkTemplate\">\n                    <ng-container *ngTemplateOutlet=\"addTemplate\"></ng-container>\n                </ng-container>\n            </div>\n        </ng-container>\n    </div>\n\n</div>\n\n<ng-template #addTemplate>\n    <button mat-button inputFileDropZone class=\"file-button\" type=\"button\" (click)=\"fileInput.click()\" (itemDrop)=\"onSelectFile($event, selectButton)\"\n        (itemDragOver)=\"onDragOver(selectButton)\" (itemDragLeave)=\"onDragLeave(selectButton)\" [disabled]=\"disabled\" #selectButton>\n        <mat-icon class=\"input-icon\">{{ iconAdd }}</mat-icon>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" [disabled]=\"disabled\" (click)=\"onLink()\" *ngIf=\"linkEnabled\">\n        <mat-icon>{{ iconLink }}</mat-icon>\n    </button>\n    <input [id]=\"id\" [accept]=\"fileAccept\" hidden type=\"file\" [attr.multiple]=\"fileLimit > 1 ? true : null\" #fileInput (change)=\"onSelectFile($event, selectButton)\">\n</ng-template>\n\n<ng-template #fileTemplate let-file let-index=\"index\">\n    <img class=\"image-preview\" [src]=\"file.preview\" *ngIf=\"file.preview\">\n    <button mat-button inputFileDropZone class=\"replace-button\" type=\"button\" (click)=\"fileReplace.click()\" (itemDrop)=\"onReplaceFile($event, index, replaceButton)\"\n        [disabled]=\"disabled\" (itemDragOver)=\"onDragOver(replaceButton)\" (itemDragLeave)=\"onDragLeave(replaceButton)\" #replaceButton>\n        <ng-container *ngIf=\"!file.preview\">\n            <mat-icon class=\"input-icon\">{{ iconFile }}</mat-icon>\n            <div class=\"file-name text-truncate\" [innerHtml]=\"file.file.name\" *ngIf=\"file.file\"></div>\n        </ng-container>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" (click)=\"onDeleteFile(index)\" [disabled]=\"disabled\">\n        <mat-icon>{{ iconDelete }}</mat-icon>\n    </button>\n    <input [accept]=\"fileAccept\" hidden type=\"file\" #fileReplace (change)=\"onReplaceFile($event, index, replaceButton, fileReplace)\">\n</ng-template>\n\n<ng-template #linkTemplate>\n    <form class=\"form-link slide-in-up\" [formGroup]=\"form\" (ngSubmit)=\"onSubmitLink()\" novalidate>\n        <mat-form-field class=\"input-link\">\n            <input matInput formControlName=\"link\" [placeholder]=\"placeholderLink\">\n        </mat-form-field>\n        <div class=\"form-link-button\">\n            <button mat-button type=\"button\" (click)=\"onLink()\" [disabled]=\"disabled\">\n                <mat-icon>arrow_back</mat-icon>\n            </button>\n            <button mat-button type=\"submit\" [disabled]=\"disabled\">\n                <mat-icon>check</mat-icon>\n            </button>\n        </div>\n    </form>\n</ng-template>\n", styles: [".input-file-container{position:relative}.input-file-container .files-container{display:flex;flex-direction:row;flex-wrap:wrap;padding-top:1.25rem}.input-file-container .file-container,.input-file-container .file-button{align-items:center;display:flex;height:10rem;justify-content:center;width:10rem}.input-file-container .secondary-button{width:10rem}.input-file-container .file-button{flex:1}.input-file-container .file-container{flex-direction:column;margin-right:1rem;overflow:hidden}.input-file-container .replace-button{flex:1;width:10rem}.input-file-container .mat-button:focus{outline:0}.input-file-container .file-name{width:7.5rem}.input-file-container .image-preview{position:absolute;height:10rem;-o-object-fit:contain;object-fit:contain;width:10rem}.input-file-container .input-icon{font-size:2.5rem;height:2.5rem;width:2.5rem}.input-file-container .form-link{display:flex;flex-direction:column;width:10rem}.input-file-container .input-link{width:10rem}.input-file-container .form-link-button{display:flex;flex-direction:row}.input-file-container .form-link-button .mat-button{min-width:5rem;width:5rem}.input-file-container .mat-orphan-label{color:#0000008a;display:block;font-size:1rem;left:0;margin:0;position:absolute;top:0;transform-origin:0;transition:.4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.input-file-container .mat-orphan-label.active{transform:scale(.75)}@keyframes bounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scale(1)}}.bounce-in{animation-duration:.75s;animation-name:bounceIn}@keyframes slideInUp{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translate(0)}}.slide-in-up{animation-duration:.25s;animation-name:slideInUp}\n"], components: [{ type: i3.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i4.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { type: i5.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }], directives: [{ type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i7.DropZoneDirective, selector: "[inputFileDropZone]", inputs: ["disabled"], outputs: ["itemDragOver", "itemDragLeave", "itemDrop"] }, { type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i8.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileComponent, decorators: [{
            type: Component,
            args: [{ selector: 'input-file', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => InputFileComponent),
                            multi: true
                        }
                    ], template: "<div class=\"input-file-container\">\n    <label class=\"mat-orphan-label\" [for]=\"id\" [class.active]=\"files?.length\" [innerHtml]=\"placeholder\" *ngIf=\"placeholder\"></label>\n    <div class=\"files-container\">\n\n        <ng-container *ngFor=\"let file of files; let i = index\">\n            <div class=\"file-container\" [ngClass]=\"classAnimation\">\n                <ng-container *ngTemplateOutlet=\"fileTemplate; context: { $implicit: file, index: i }\"></ng-container>\n            </div>\n        </ng-container>\n\n        <ng-container *ngIf=\"canAddFile\">\n            <div class=\"file-container\">\n                <ng-container *ngIf=\"!addLink; else linkTemplate\">\n                    <ng-container *ngTemplateOutlet=\"addTemplate\"></ng-container>\n                </ng-container>\n            </div>\n        </ng-container>\n    </div>\n\n</div>\n\n<ng-template #addTemplate>\n    <button mat-button inputFileDropZone class=\"file-button\" type=\"button\" (click)=\"fileInput.click()\" (itemDrop)=\"onSelectFile($event, selectButton)\"\n        (itemDragOver)=\"onDragOver(selectButton)\" (itemDragLeave)=\"onDragLeave(selectButton)\" [disabled]=\"disabled\" #selectButton>\n        <mat-icon class=\"input-icon\">{{ iconAdd }}</mat-icon>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" [disabled]=\"disabled\" (click)=\"onLink()\" *ngIf=\"linkEnabled\">\n        <mat-icon>{{ iconLink }}</mat-icon>\n    </button>\n    <input [id]=\"id\" [accept]=\"fileAccept\" hidden type=\"file\" [attr.multiple]=\"fileLimit > 1 ? true : null\" #fileInput (change)=\"onSelectFile($event, selectButton)\">\n</ng-template>\n\n<ng-template #fileTemplate let-file let-index=\"index\">\n    <img class=\"image-preview\" [src]=\"file.preview\" *ngIf=\"file.preview\">\n    <button mat-button inputFileDropZone class=\"replace-button\" type=\"button\" (click)=\"fileReplace.click()\" (itemDrop)=\"onReplaceFile($event, index, replaceButton)\"\n        [disabled]=\"disabled\" (itemDragOver)=\"onDragOver(replaceButton)\" (itemDragLeave)=\"onDragLeave(replaceButton)\" #replaceButton>\n        <ng-container *ngIf=\"!file.preview\">\n            <mat-icon class=\"input-icon\">{{ iconFile }}</mat-icon>\n            <div class=\"file-name text-truncate\" [innerHtml]=\"file.file.name\" *ngIf=\"file.file\"></div>\n        </ng-container>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" (click)=\"onDeleteFile(index)\" [disabled]=\"disabled\">\n        <mat-icon>{{ iconDelete }}</mat-icon>\n    </button>\n    <input [accept]=\"fileAccept\" hidden type=\"file\" #fileReplace (change)=\"onReplaceFile($event, index, replaceButton, fileReplace)\">\n</ng-template>\n\n<ng-template #linkTemplate>\n    <form class=\"form-link slide-in-up\" [formGroup]=\"form\" (ngSubmit)=\"onSubmitLink()\" novalidate>\n        <mat-form-field class=\"input-link\">\n            <input matInput formControlName=\"link\" [placeholder]=\"placeholderLink\">\n        </mat-form-field>\n        <div class=\"form-link-button\">\n            <button mat-button type=\"button\" (click)=\"onLink()\" [disabled]=\"disabled\">\n                <mat-icon>arrow_back</mat-icon>\n            </button>\n            <button mat-button type=\"submit\" [disabled]=\"disabled\">\n                <mat-icon>check</mat-icon>\n            </button>\n        </div>\n    </form>\n</ng-template>\n", styles: [".input-file-container{position:relative}.input-file-container .files-container{display:flex;flex-direction:row;flex-wrap:wrap;padding-top:1.25rem}.input-file-container .file-container,.input-file-container .file-button{align-items:center;display:flex;height:10rem;justify-content:center;width:10rem}.input-file-container .secondary-button{width:10rem}.input-file-container .file-button{flex:1}.input-file-container .file-container{flex-direction:column;margin-right:1rem;overflow:hidden}.input-file-container .replace-button{flex:1;width:10rem}.input-file-container .mat-button:focus{outline:0}.input-file-container .file-name{width:7.5rem}.input-file-container .image-preview{position:absolute;height:10rem;-o-object-fit:contain;object-fit:contain;width:10rem}.input-file-container .input-icon{font-size:2.5rem;height:2.5rem;width:2.5rem}.input-file-container .form-link{display:flex;flex-direction:column;width:10rem}.input-file-container .input-link{width:10rem}.input-file-container .form-link-button{display:flex;flex-direction:row}.input-file-container .form-link-button .mat-button{min-width:5rem;width:5rem}.input-file-container .mat-orphan-label{color:#0000008a;display:block;font-size:1rem;left:0;margin:0;position:absolute;top:0;transform-origin:0;transition:.4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.input-file-container .mat-orphan-label.active{transform:scale(.75)}@keyframes bounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scale(1)}}.bounce-in{animation-duration:.75s;animation-name:bounceIn}@keyframes slideInUp{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translate(0)}}.slide-in-up{animation-duration:.25s;animation-name:slideInUp}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.FormBuilder }, { type: i2.InputFileService }]; }, propDecorators: { disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], classAnimation: [{
                type: Input
            }], fileAccept: [{
                type: Input
            }], fileLimit: [{
                type: Input
            }], iconAdd: [{
                type: Input
            }], iconDelete: [{
                type: Input
            }], iconFile: [{
                type: Input
            }], iconLink: [{
                type: Input
            }], linkEnabled: [{
                type: Input
            }], placeholderLink: [{
                type: Input
            }], sizeLimit: [{
                type: Input
            }], acceptedFile: [{
                type: Output
            }], deletedFile: [{
                type: Output
            }], rejectedFile: [{
                type: Output
            }], fileInput: [{
                type: ViewChild,
                args: ['fileInput', { static: false }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaW5wdXQtZmlsZS9zcmMvbGliL2NvbXBvbmVudHMvaW5wdXQtZmlsZS9pbnB1dC1maWxlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbnB1dC1maWxlL3NyYy9saWIvY29tcG9uZW50cy9pbnB1dC1maWxlL2lucHV0LWZpbGUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNSLE1BQU0sZUFBZSxDQUFDO0FBQzNCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBSWxFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBR2pGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7Ozs7Ozs7OztBQWM5RCxNQUFNLE9BQU8sa0JBQWtCO0lBZ0gzQixZQUNZLFdBQXdCLEVBQ3hCLGdCQUFrQztRQURsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBbEJwQyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFhLENBQUM7UUFDN0MsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBYSxDQUFDO1FBQzVDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFJeEQsVUFBSyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7UUFFL0IsT0FBRSxHQUFHLGtCQUFrQixrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FB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biAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgZm9yd2FyZFJlZixcbiAgICBJbnB1dCxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0LFxuICAgIFZpZXdDaGlsZFxuICAgIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBkZWZhdWx0U2V0dGluZ3MgfSBmcm9tICcuLi8uLi9zZXR0aW5ncy9kZWZhdWx0LnNldHRpbmdzJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBJbnB1dEZpbGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2lucHV0LWZpbGUnO1xuaW1wb3J0IHsgSW5wdXRGaWxlUmVqZWN0ZWQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2lucHV0LWZpbGUtcmVqZWN0ZWQnO1xuaW1wb3J0IHsgSW5wdXRGaWxlUmVqZWN0ZWRSZWFzb24gfSBmcm9tICcuLi8uLi9lbnVtcy9pbnB1dC1maWxlLXJlamVjdGVkLXJlYXNvbic7XG5pbXBvcnQgeyBJbnB1dEZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvaW5wdXQtZmlsZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1hdEJ1dHRvbiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQgeyB1cmxWYWxpZGF0b3IgfSBmcm9tICcuLi8uLi92YWxpZGF0b3JzL3VybC52YWxpZGF0b3InO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lucHV0LWZpbGUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9pbnB1dC1maWxlLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9pbnB1dC1maWxlLnNjc3MnXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBJbnB1dEZpbGVDb21wb25lbnQpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSW5wdXRGaWxlQ29tcG9uZW50IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG4gICAgc3RhdGljIG5leHRJZCA9IDA7XG4gICAgcHJpdmF0ZSBfY2xhc3NBbmltYXRpb246IHN0cmluZztcbiAgICBwcml2YXRlIF9maWxlQWNjZXB0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZmlsZUxpbWl0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfaWNvbkFkZDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ljb25EZWxldGU6IHN0cmluZztcbiAgICBwcml2YXRlIF9pY29uRmlsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ljb25MaW5rOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfbGlua0VuYWJsZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXJMaW5rOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2l6ZUxpbWl0OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2V0IGNsYXNzQW5pbWF0aW9uKGNsYXNzQW5pbWF0aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fY2xhc3NBbmltYXRpb24gPSBjbGFzc0FuaW1hdGlvbjtcbiAgICB9XG5cbiAgICBnZXQgY2xhc3NBbmltYXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGFzc0FuaW1hdGlvbiB8fCB0aGlzLmlucHV0RmlsZVNlcnZpY2UuY29uZmlnLmNsYXNzQW5pbWF0aW9uIHx8IGRlZmF1bHRTZXR0aW5ncy5jbGFzc0FuaW1hdGlvbjtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBzZXQgZmlsZUFjY2VwdChmaWxlQWNjZXB0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZmlsZUFjY2VwdCA9IGZpbGVBY2NlcHQ7XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVBY2NlcHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWxlQWNjZXB0IHx8IHRoaXMuaW5wdXRGaWxlU2VydmljZS5jb25maWcuZmlsZUFjY2VwdCB8fCBkZWZhdWx0U2V0dGluZ3MuZmlsZUFjY2VwdDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBzZXQgZmlsZUxpbWl0KGZpbGVMaW1pdDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2ZpbGVMaW1pdCA9IGZpbGVMaW1pdDtcbiAgICB9XG5cbiAgICBnZXQgZmlsZUxpbWl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsZUxpbWl0IHx8IHRoaXMuaW5wdXRGaWxlU2VydmljZS5jb25maWcuZmlsZUxpbWl0IHx8IGRlZmF1bHRTZXR0aW5ncy5maWxlTGltaXQ7XG4gICAgfVxuXG4gICAgQElucHV0KCkgc2V0IGljb25BZGQoaWNvbkFkZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2ljb25BZGQgPSBpY29uQWRkO1xuICAgIH1cblxuICAgIGdldCBpY29uQWRkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faWNvbkFkZCB8fCB0aGlzLmlucHV0RmlsZVNlcnZpY2UuY29uZmlnLmljb25BZGQgfHwgZGVmYXVsdFNldHRpbmdzLmljb25BZGQ7XG4gICAgfVxuXG4gICAgQElucHV0KCkgc2V0IGljb25EZWxldGUoaWNvbkRlbGV0ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2ljb25EZWxldGUgPSBpY29uRGVsZXRlO1xuICAgIH1cblxuICAgIGdldCBpY29uRGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faWNvbkRlbGV0ZSB8fCB0aGlzLmlucHV0RmlsZVNlcnZpY2UuY29uZmlnLmljb25EZWxldGUgfHwgZGVmYXVsdFNldHRpbmdzLmljb25EZWxldGU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgc2V0IGljb25GaWxlKGljb25GaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faWNvbkZpbGUgPSBpY29uRmlsZTtcbiAgICB9XG5cbiAgICBnZXQgaWNvbkZpbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pY29uRmlsZSB8fCB0aGlzLmlucHV0RmlsZVNlcnZpY2UuY29uZmlnLmljb25GaWxlIHx8IGRlZmF1bHRTZXR0aW5ncy5pY29uRmlsZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBzZXQgaWNvbkxpbmsoaWNvbkxpbms6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pY29uTGluayA9IGljb25MaW5rO1xuICAgIH1cblxuICAgIGdldCBpY29uTGluaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ljb25MaW5rIHx8IHRoaXMuaW5wdXRGaWxlU2VydmljZS5jb25maWcuaWNvbkxpbmsgfHwgZGVmYXVsdFNldHRpbmdzLmljb25MaW5rO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHNldCBsaW5rRW5hYmxlZChsaW5rRW5hYmxlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9saW5rRW5hYmxlZCA9IGxpbmtFbmFibGVkO1xuICAgIH1cblxuICAgIGdldCBsaW5rRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmtFbmFibGVkIHx8IHRoaXMuaW5wdXRGaWxlU2VydmljZS5jb25maWcubGlua0VuYWJsZWQgfHwgZGVmYXVsdFNldHRpbmdzLmxpbmtFbmFibGVkO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHNldCBwbGFjZWhvbGRlckxpbmsocGxhY2Vob2xkZXJMaW5rOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMaW5rID0gcGxhY2Vob2xkZXJMaW5rO1xuICAgIH1cblxuICAgIGdldCBwbGFjZWhvbGRlckxpbmsoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlckxpbmsgfHwgdGhpcy5pbnB1dEZpbGVTZXJ2aWNlLmNvbmZpZy5wbGFjZWhvbGRlckxpbmsgfHwgZGVmYXVsdFNldHRpbmdzLnBsYWNlaG9sZGVyTGluaztcbiAgICB9XG5cbiAgICBASW5wdXQoKSBzZXQgc2l6ZUxpbWl0KHNpemVMaW1pdDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3NpemVMaW1pdCA9IHNpemVMaW1pdDtcbiAgICB9XG5cbiAgICBnZXQgc2l6ZUxpbWl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZUxpbWl0IHx8IHRoaXMuaW5wdXRGaWxlU2VydmljZS5jb25maWcuc2l6ZUxpbWl0IHx8IGRlZmF1bHRTZXR0aW5ncy5zaXplTGltaXQ7XG4gICAgfVxuXG4gICAgQE91dHB1dCgpIGFjY2VwdGVkRmlsZSA9IG5ldyBFdmVudEVtaXR0ZXI8SW5wdXRGaWxlPigpO1xuICAgIEBPdXRwdXQoKSBkZWxldGVkRmlsZSA9IG5ldyBFdmVudEVtaXR0ZXI8SW5wdXRGaWxlPigpO1xuICAgIEBPdXRwdXQoKSByZWplY3RlZEZpbGUgPSBuZXcgRXZlbnRFbWl0dGVyPElucHV0RmlsZVJlamVjdGVkPigpO1xuICAgIEBWaWV3Q2hpbGQoJ2ZpbGVJbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KSBmaWxlSW5wdXQ6IEVsZW1lbnRSZWY7XG5cbiAgICBwdWJsaWMgYWRkTGluazogYm9vbGVhbjtcbiAgICBwdWJsaWMgZmlsZXMgPSBuZXcgQXJyYXk8SW5wdXRGaWxlPigpO1xuICAgIHB1YmxpYyBmb3JtOiBGb3JtR3JvdXA7XG4gICAgcHVibGljIGlkID0gYG5neC1pbnB1dC1maWxlLSR7SW5wdXRGaWxlQ29tcG9uZW50Lm5leHRJZCsrfWA7XG4gICAgcHVibGljIG9uQ2hhbmdlID0gKGZpbGVzOiBBcnJheTxJbnB1dEZpbGU+KSA9PiB7IH07XG4gICAgcHVibGljIG9uVG91Y2hlZCA9ICgpID0+IHsgfTtcblxuICAgIGdldCBjYW5BZGRGaWxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlcyAmJiB0aGlzLmZpbGVzLmxlbmd0aCA8IHRoaXMuZmlsZUxpbWl0O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICAgICAgcHJpdmF0ZSBpbnB1dEZpbGVTZXJ2aWNlOiBJbnB1dEZpbGVTZXJ2aWNlXG4gICAgKSB7IH1cblxuICAgIC8qKlxuICAgICAqIEFuZ3VsYXIgbGlmZWN5bGUgT25Jbml0IGltcGxlbWVudGF0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRGb3JtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gZGVsZXRlIGEgZmlsZSBldmVudCBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkRlbGV0ZUZpbGUoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5maWxlcy5zbGljZSgpO1xuICAgICAgICAgICAgdGhpcy5kZWxldGVkRmlsZS5lbWl0KGZpbGVzW2luZGV4XSk7XG4gICAgICAgICAgICBmaWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy53cml0ZVZhbHVlKGZpbGVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIGRyYWcgb3ZlciBldmVudCBoYW5kbGVyLlxuICAgICAqIEFkZHMgYSByaXBwbGUgZWZmZWN0IG9uIHRoZSBidXR0b24uXG4gICAgICovXG4gICAgcHVibGljIG9uRHJhZ092ZXIoYnV0dG9uOiBNYXRCdXR0b24pOiB2b2lkIHtcbiAgICAgICAgYnV0dG9uLnJpcHBsZS5sYXVuY2goeyBjZW50ZXJlZDogdHJ1ZSwgcGVyc2lzdGVudDogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBkcmFnIGxlYXZlIGV2ZW50IGhhbmRsZXIuXG4gICAgICogRmFkZXMgdGhlIHJpcHBsZSBlZmZlY3Qgb2YgdGhlIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnTGVhdmUoYnV0dG9uOiBNYXRCdXR0b24pOiB2b2lkIHtcbiAgICAgICAgYnV0dG9uLnJpcHBsZS5mYWRlT3V0QWxsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gYWRkcyBhIGxpbmsuXG4gICAgICovXG4gICAgcHVibGljIG9uTGluaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRMaW5rID0gIXRoaXMuYWRkTGluaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiByZXBsYWNlIG9uZSBmaWxlIGV2ZW50IGhhbmRsZXIuXG4gICAgICogV3JpdGVzIHRoZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gZmlsZUxpc3RcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKiBAcGFyYW0gZmlsZUlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uUmVwbGFjZUZpbGUoZTogRXZlbnQsIGluZGV4OiBudW1iZXIsIGJ1dHRvbjogTWF0QnV0dG9uLCBmaWxlSW5wdXQ/OiBIVE1MSW5wdXRFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpbGVMaXN0OiBGaWxlTGlzdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgLy8gQ29waWVzIHRoZSBhcnJheSB3aXRob3V0IHJlZmVyZW5jZS5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5maWxlcy5zbGljZSgpO1xuICAgICAgICAgICAgLy8gQXNzdW1lcyB0aGF0IGEgc2luZ2xlIGZpbGUgY2FuIGJlIHJlcGxhY2VkIGJ5IGEgc2luZ2xlIGZpbGUuXG4gICAgICAgICAgICBjb25zdCBpbnB1dEZpbGU6IElucHV0RmlsZSA9IHsgZmlsZSA6IGZpbGVMaXN0Lml0ZW0oMCkgfTtcbiAgICAgICAgICAgIGJ1dHRvbi5yaXBwbGUuZmFkZU91dEFsbCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZmlsZUd1YXJkKGZpbGVzLCBpbnB1dEZpbGUsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgZmlsZXNbaW5kZXhdID0gaW5wdXRGaWxlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWNjZXB0ZWRGaWxlLmVtaXQoaW5wdXRGaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMud3JpdGVWYWx1ZShmaWxlcyk7XG4gICAgICAgICAgICBpZiAoZmlsZUlucHV0KSB7XG4gICAgICAgICAgICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBzZWxlY3Qgb25lIG9yIG1vcmUgZmlsZXMgZXZlbnQgaGFuZGxlci5cbiAgICAgKiBXcml0ZXMgdGhlIHZhbHVlLlxuICAgICAqIEBwYXJhbSBmaWxlTGlzdFxuICAgICAqL1xuICAgIHB1YmxpYyBvblNlbGVjdEZpbGUoZTogRXZlbnQsIGJ1dHRvbjogTWF0QnV0dG9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpbGVMaXN0OiBGaWxlTGlzdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgYnV0dG9uLnJpcHBsZS5mYWRlT3V0QWxsKCk7XG4gICAgICAgICAgICAvLyBDb3BpZXMgdGhlIGFycmF5IHdpdGhvdXQgcmVmZXJlbmNlLlxuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVzLnNsaWNlKCk7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGZpbGVMaXN0KS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0RmlsZTogSW5wdXRGaWxlID0geyBmaWxlIH07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsZUd1YXJkKGZpbGVzLCBpbnB1dEZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goaW5wdXRGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2NlcHRlZEZpbGUuZW1pdChpbnB1dEZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy53cml0ZVZhbHVlKGZpbGVzKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIHN1Ym1pdCB0aGUgbGluayBmb3JtIGV2ZW50IGhhbmRsZXIuXG4gICAgICovXG4gICAgcHVibGljIG9uU3VibWl0TGluaygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuZm9ybS52YWxpZCkge1xuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVzLnNsaWNlKCk7XG4gICAgICAgICAgICBjb25zdCBpbnB1dEZpbGU6IElucHV0RmlsZSA9IHsgbGluazogdGhpcy5mb3JtLnZhbHVlLmxpbmssIHByZXZpZXc6IHRoaXMuZm9ybS52YWx1ZS5saW5rIH07XG4gICAgICAgICAgICBmaWxlcy5wdXNoKGlucHV0RmlsZSk7XG4gICAgICAgICAgICB0aGlzLmFjY2VwdGVkRmlsZS5lbWl0KGlucHV0RmlsZSk7XG4gICAgICAgICAgICB0aGlzLm9uTGluaygpO1xuICAgICAgICAgICAgdGhpcy5mb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLndyaXRlVmFsdWUoZmlsZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAgICogQHBhcmFtIGZuXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChmaWxlczogQXJyYXk8SW5wdXRGaWxlPikgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAgICogQHBhcmFtIGZuXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAgICogQHBhcmFtIGlzRGlzYWJsZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGF0aW9uIG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgICAqIEBwYXJhbSBmaWxlc1xuICAgICAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKGZpbGVzOiBBcnJheTxJbnB1dEZpbGU+KTogdm9pZCB7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIGZpbGVzID0gbmV3IEFycmF5PElucHV0RmlsZT4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG4gICAgICAgIHRoaXMuc2V0RmlsZVByZXZpZXcoKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmZpbGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBmaWxlIGNhbiBiZSBhZGRlZCB0byB0aGUgbW9kZWwuXG4gICAgICogQHBhcmFtIGZpbGVzXG4gICAgICogQHBhcmFtIGZpbGUsXG4gICAgICogQHBhcmFtIGJ5cGFzc0xpbWl0XG4gICAgICovXG4gICAgcHJpdmF0ZSBmaWxlR3VhcmQoZmlsZXM6IEFycmF5PElucHV0RmlsZT4sIGZpbGU6IElucHV0RmlsZSwgYnlwYXNzTGltaXQ/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghYnlwYXNzTGltaXQgJiYgIXRoaXMuaW5wdXRGaWxlU2VydmljZS5saW1pdEd1YXJkKGZpbGVzLCB0aGlzLmZpbGVMaW1pdCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ZWRGaWxlLmVtaXQoeyByZWFzb246IElucHV0RmlsZVJlamVjdGVkUmVhc29uLmxpbWl0UmVhY2hlZCwgZmlsZSB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pbnB1dEZpbGVTZXJ2aWNlLnNpemVHdWFyZChmaWxlLmZpbGUsIHRoaXMuc2l6ZUxpbWl0KSkge1xuICAgICAgICAgICAgdGhpcy5yZWplY3RlZEZpbGUuZW1pdCh7IHJlYXNvbjogSW5wdXRGaWxlUmVqZWN0ZWRSZWFzb24uc2l6ZVJlYWNoZWQsIGZpbGUgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaW5wdXRGaWxlU2VydmljZS50eXBlR3VhcmQoZmlsZS5maWxlLCB0aGlzLmZpbGVBY2NlcHQpKSB7XG4gICAgICAgICAgICB0aGlzLnJlamVjdGVkRmlsZS5lbWl0KHsgcmVhc29uOiBJbnB1dEZpbGVSZWplY3RlZFJlYXNvbi5iYWRGaWxlLCBmaWxlIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgZmlsZSBwcmV2aWV3IHdpdGggRmlsZVJlYWRlci5cbiAgICAgKi9cbiAgICBwcml2YXRlIHNldEZpbGVQcmV2aWV3KCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGluZGV4IGluIHRoaXMuZmlsZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbGVzW2luZGV4XS5maWxlICE9IG51bGwgJiYgdGhpcy5pbnB1dEZpbGVTZXJ2aWNlLnR5cGVHdWFyZCh0aGlzLmZpbGVzW2luZGV4XS5maWxlLCAnaW1hZ2UvKicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgICAgIGZyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxlc1tpbmRleF0ucHJldmlldyA9IGZyLnJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZyLnJlYWRBc0RhdGFVUkwodGhpcy5maWxlc1tpbmRleF0uZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSByZWFjdGl2ZSBmb3JtIHRvIGluc2VydCBhIGxpbmsuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRGb3JtKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgICAgICAgIGxpbms6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWQsIHVybFZhbGlkYXRvcl1dXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJpbnB1dC1maWxlLWNvbnRhaW5lclwiPlxuICAgIDxsYWJlbCBjbGFzcz1cIm1hdC1vcnBoYW4tbGFiZWxcIiBbZm9yXT1cImlkXCIgW2NsYXNzLmFjdGl2ZV09XCJmaWxlcz8ubGVuZ3RoXCIgW2lubmVySHRtbF09XCJwbGFjZWhvbGRlclwiICpuZ0lmPVwicGxhY2Vob2xkZXJcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJmaWxlcy1jb250YWluZXJcIj5cblxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBmaWxlIG9mIGZpbGVzOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmlsZS1jb250YWluZXJcIiBbbmdDbGFzc109XCJjbGFzc0FuaW1hdGlvblwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJmaWxlVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBmaWxlLCBpbmRleDogaSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNhbkFkZEZpbGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhYWRkTGluazsgZWxzZSBsaW5rVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImFkZFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2FkZFRlbXBsYXRlPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiBpbnB1dEZpbGVEcm9wWm9uZSBjbGFzcz1cImZpbGUtYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJmaWxlSW5wdXQuY2xpY2soKVwiIChpdGVtRHJvcCk9XCJvblNlbGVjdEZpbGUoJGV2ZW50LCBzZWxlY3RCdXR0b24pXCJcbiAgICAgICAgKGl0ZW1EcmFnT3Zlcik9XCJvbkRyYWdPdmVyKHNlbGVjdEJ1dHRvbilcIiAoaXRlbURyYWdMZWF2ZSk9XCJvbkRyYWdMZWF2ZShzZWxlY3RCdXR0b24pXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgI3NlbGVjdEJ1dHRvbj5cbiAgICAgICAgPG1hdC1pY29uIGNsYXNzPVwiaW5wdXQtaWNvblwiPnt7IGljb25BZGQgfX08L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiBjbGFzcz1cInNlY29uZGFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgKGNsaWNrKT1cIm9uTGluaygpXCIgKm5nSWY9XCJsaW5rRW5hYmxlZFwiPlxuICAgICAgICA8bWF0LWljb24+e3sgaWNvbkxpbmsgfX08L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICAgIDxpbnB1dCBbaWRdPVwiaWRcIiBbYWNjZXB0XT1cImZpbGVBY2NlcHRcIiBoaWRkZW4gdHlwZT1cImZpbGVcIiBbYXR0ci5tdWx0aXBsZV09XCJmaWxlTGltaXQgPiAxID8gdHJ1ZSA6IG51bGxcIiAjZmlsZUlucHV0IChjaGFuZ2UpPVwib25TZWxlY3RGaWxlKCRldmVudCwgc2VsZWN0QnV0dG9uKVwiPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNmaWxlVGVtcGxhdGUgbGV0LWZpbGUgbGV0LWluZGV4PVwiaW5kZXhcIj5cbiAgICA8aW1nIGNsYXNzPVwiaW1hZ2UtcHJldmlld1wiIFtzcmNdPVwiZmlsZS5wcmV2aWV3XCIgKm5nSWY9XCJmaWxlLnByZXZpZXdcIj5cbiAgICA8YnV0dG9uIG1hdC1idXR0b24gaW5wdXRGaWxlRHJvcFpvbmUgY2xhc3M9XCJyZXBsYWNlLWJ1dHRvblwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiZmlsZVJlcGxhY2UuY2xpY2soKVwiIChpdGVtRHJvcCk9XCJvblJlcGxhY2VGaWxlKCRldmVudCwgaW5kZXgsIHJlcGxhY2VCdXR0b24pXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgKGl0ZW1EcmFnT3Zlcik9XCJvbkRyYWdPdmVyKHJlcGxhY2VCdXR0b24pXCIgKGl0ZW1EcmFnTGVhdmUpPVwib25EcmFnTGVhdmUocmVwbGFjZUJ1dHRvbilcIiAjcmVwbGFjZUJ1dHRvbj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFmaWxlLnByZXZpZXdcIj5cbiAgICAgICAgICAgIDxtYXQtaWNvbiBjbGFzcz1cImlucHV0LWljb25cIj57eyBpY29uRmlsZSB9fTwvbWF0LWljb24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmlsZS1uYW1lIHRleHQtdHJ1bmNhdGVcIiBbaW5uZXJIdG1sXT1cImZpbGUuZmlsZS5uYW1lXCIgKm5nSWY9XCJmaWxlLmZpbGVcIj48L2Rpdj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9idXR0b24+XG4gICAgPGJ1dHRvbiBtYXQtYnV0dG9uIGNsYXNzPVwic2Vjb25kYXJ5LWJ1dHRvblwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwib25EZWxldGVGaWxlKGluZGV4KVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAgICA8bWF0LWljb24+e3sgaWNvbkRlbGV0ZSB9fTwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gICAgPGlucHV0IFthY2NlcHRdPVwiZmlsZUFjY2VwdFwiIGhpZGRlbiB0eXBlPVwiZmlsZVwiICNmaWxlUmVwbGFjZSAoY2hhbmdlKT1cIm9uUmVwbGFjZUZpbGUoJGV2ZW50LCBpbmRleCwgcmVwbGFjZUJ1dHRvbiwgZmlsZVJlcGxhY2UpXCI+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2xpbmtUZW1wbGF0ZT5cbiAgICA8Zm9ybSBjbGFzcz1cImZvcm0tbGluayBzbGlkZS1pbi11cFwiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIChuZ1N1Ym1pdCk9XCJvblN1Ym1pdExpbmsoKVwiIG5vdmFsaWRhdGU+XG4gICAgICAgIDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cImlucHV0LWxpbmtcIj5cbiAgICAgICAgICAgIDxpbnB1dCBtYXRJbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJsaW5rXCIgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyTGlua1wiPlxuICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1saW5rLWJ1dHRvblwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwib25MaW5rKClcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+YXJyb3dfYmFjazwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPmNoZWNrPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Zvcm0+XG48L25nLXRlbXBsYXRlPlxuIl19