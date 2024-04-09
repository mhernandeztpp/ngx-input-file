import * as i0 from '@angular/core';
import { Injectable, Inject, EventEmitter, Directive, Input, Output, HostListener, forwardRef, Component, ViewChild, NgModule } from '@angular/core';
import * as i1 from '@angular/forms';
import { Validators, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i3 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import * as i4 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i5 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i6 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i8 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';

const defaultSettings = {
    classAnimation: 'bounce-in',
    fileAccept: '*',
    fileLimit: 1,
    iconAdd: 'add',
    iconDelete: 'delete',
    iconFile: 'insert_drive_file',
    iconLink: 'link',
    linkEnabled: false,
    placeholderLink: 'Link',
    sizeLimit: null
};

var InputFileRejectedReason;
(function (InputFileRejectedReason) {
    InputFileRejectedReason[InputFileRejectedReason["badFile"] = 0] = "badFile";
    InputFileRejectedReason[InputFileRejectedReason["limitReached"] = 1] = "limitReached";
    InputFileRejectedReason[InputFileRejectedReason["sizeReached"] = 2] = "sizeReached";
})(InputFileRejectedReason || (InputFileRejectedReason = {}));

function urlValidator(control) {
    if (Validators.required(control) != null) {
        return null;
    }
    const v = control.value;
    /* tslint:disable */
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v) ? null : { 'url': true };
    /* tslint:enable */
}

class InputFileService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        return this._config;
    }
    /**
     * Whether the limit is not reached.
     * @param files
     */
    limitGuard(files, fileLimit) {
        return files.length < fileLimit;
    }
    /**
     * Whether the file size is not bigger than the limit.
     * @param file
     * @param sizeLimit
     */
    sizeGuard(file, sizeLimit) {
        return !sizeLimit || file.size < sizeLimit * 1024 * 1024; // TODO : improve
    }
    /**
     * Whether the type of the file is enabled.
     * @param file
     * @param fileAccept
     */
    typeGuard(file, fileAccept) {
        let enabled = fileAccept == null;
        if (fileAccept) {
            const accept = fileAccept.replace('*', '');
            const types = accept.split(',');
            for (const type of types) {
                if (file.type.startsWith(type) || (type.charAt(0) === '.' && file.name != null && file.name.endsWith(type))) {
                    enabled = true;
                    break;
                }
            }
        }
        return enabled;
    }
}
InputFileService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileService, deps: [{ token: 'config' }], target: i0.ɵɵFactoryTarget.Injectable });
InputFileService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['config']
                }] }]; } });

class DropZoneDirective {
    constructor() {
        this.disabled = false;
        this.itemDragOver = new EventEmitter();
        this.itemDragLeave = new EventEmitter();
        this.itemDrop = new EventEmitter();
        // Prevent dragleave on children, could be better but it's cheap for better performance
        this.whiteListClasses = ['file-button', 'mat-button-wrapper', 'input-icon'];
    }
    /**
     * Drag Over event handler.
     * @param event
     */
    onDragOver(event) {
        this.preventAndStopEventPropagation(event);
        if (!this.isOver && !this.disabled) {
            this.isOver = true;
            this.itemDragOver.emit();
        }
    }
    /**
     * Drag Leave event handler.
     * @param event
     */
    onDragLeave(event) {
        this.preventAndStopEventPropagation(event);
        if (this.isOver && this.isTrueLeave(event) && !this.disabled) {
            this.isOver = false;
            this.itemDragLeave.emit();
        }
    }
    /**
     * Drop event handler.
     * @param event
     */
    onDrop(event) {
        if (!this.disabled) {
            this.preventAndStopEventPropagation(event);
            this.isOver = false;
            try {
                this.itemDrop.emit(event.dataTransfer.files);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    /**
     * Prevents and stops event propagration.
     * @param event
     */
    preventAndStopEventPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * Checks if the leave is not trigger by a children.
     * @param event
     */
    isTrueLeave(event) {
        for (const c of this.whiteListClasses) {
            if (event.fromElement != null && event.fromElement.className.indexOf(c) >= 0) {
                return false;
            }
        }
        return true;
    }
}
DropZoneDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: DropZoneDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
DropZoneDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.11", type: DropZoneDirective, selector: "[inputFileDropZone]", inputs: { disabled: "disabled" }, outputs: { itemDragOver: "itemDragOver", itemDragLeave: "itemDragLeave", itemDrop: "itemDrop" }, host: { listeners: { "dragover": "onDragOver($event)", "dragleave": "onDragLeave($event)", "drop": "onDrop($event)" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: DropZoneDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[inputFileDropZone]'
                }]
        }], propDecorators: { disabled: [{
                type: Input
            }], itemDragOver: [{
                type: Output
            }], itemDragLeave: [{
                type: Output
            }], itemDrop: [{
                type: Output
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });

class InputFileComponent {
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
InputFileComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileComponent, deps: [{ token: i1.FormBuilder }, { token: InputFileService }], target: i0.ɵɵFactoryTarget.Component });
InputFileComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: InputFileComponent, selector: "input-file", inputs: { disabled: "disabled", placeholder: "placeholder", classAnimation: "classAnimation", fileAccept: "fileAccept", fileLimit: "fileLimit", iconAdd: "iconAdd", iconDelete: "iconDelete", iconFile: "iconFile", iconLink: "iconLink", linkEnabled: "linkEnabled", placeholderLink: "placeholderLink", sizeLimit: "sizeLimit" }, outputs: { acceptedFile: "acceptedFile", deletedFile: "deletedFile", rejectedFile: "rejectedFile" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFileComponent),
            multi: true
        }
    ], viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true }], ngImport: i0, template: "<div class=\"input-file-container\">\n    <label class=\"mat-orphan-label\" [for]=\"id\" [class.active]=\"files?.length\" [innerHtml]=\"placeholder\" *ngIf=\"placeholder\"></label>\n    <div class=\"files-container\">\n\n        <ng-container *ngFor=\"let file of files; let i = index\">\n            <div class=\"file-container\" [ngClass]=\"classAnimation\">\n                <ng-container *ngTemplateOutlet=\"fileTemplate; context: { $implicit: file, index: i }\"></ng-container>\n            </div>\n        </ng-container>\n\n        <ng-container *ngIf=\"canAddFile\">\n            <div class=\"file-container\">\n                <ng-container *ngIf=\"!addLink; else linkTemplate\">\n                    <ng-container *ngTemplateOutlet=\"addTemplate\"></ng-container>\n                </ng-container>\n            </div>\n        </ng-container>\n    </div>\n\n</div>\n\n<ng-template #addTemplate>\n    <button mat-button inputFileDropZone class=\"file-button\" type=\"button\" (click)=\"fileInput.click()\" (itemDrop)=\"onSelectFile($event, selectButton)\"\n        (itemDragOver)=\"onDragOver(selectButton)\" (itemDragLeave)=\"onDragLeave(selectButton)\" [disabled]=\"disabled\" #selectButton>\n        <mat-icon class=\"input-icon\">{{ iconAdd }}</mat-icon>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" [disabled]=\"disabled\" (click)=\"onLink()\" *ngIf=\"linkEnabled\">\n        <mat-icon>{{ iconLink }}</mat-icon>\n    </button>\n    <input [id]=\"id\" [accept]=\"fileAccept\" hidden type=\"file\" [attr.multiple]=\"fileLimit > 1 ? true : null\" #fileInput (change)=\"onSelectFile($event, selectButton)\">\n</ng-template>\n\n<ng-template #fileTemplate let-file let-index=\"index\">\n    <img class=\"image-preview\" [src]=\"file.preview\" *ngIf=\"file.preview\">\n    <button mat-button inputFileDropZone class=\"replace-button\" type=\"button\" (click)=\"fileReplace.click()\" (itemDrop)=\"onReplaceFile($event, index, replaceButton)\"\n        [disabled]=\"disabled\" (itemDragOver)=\"onDragOver(replaceButton)\" (itemDragLeave)=\"onDragLeave(replaceButton)\" #replaceButton>\n        <ng-container *ngIf=\"!file.preview\">\n            <mat-icon class=\"input-icon\">{{ iconFile }}</mat-icon>\n            <div class=\"file-name text-truncate\" [innerHtml]=\"file.file.name\" *ngIf=\"file.file\"></div>\n        </ng-container>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" (click)=\"onDeleteFile(index)\" [disabled]=\"disabled\">\n        <mat-icon>{{ iconDelete }}</mat-icon>\n    </button>\n    <input [accept]=\"fileAccept\" hidden type=\"file\" #fileReplace (change)=\"onReplaceFile($event, index, replaceButton, fileReplace)\">\n</ng-template>\n\n<ng-template #linkTemplate>\n    <form class=\"form-link slide-in-up\" [formGroup]=\"form\" (ngSubmit)=\"onSubmitLink()\" novalidate>\n        <mat-form-field class=\"input-link\">\n            <input matInput formControlName=\"link\" [placeholder]=\"placeholderLink\">\n        </mat-form-field>\n        <div class=\"form-link-button\">\n            <button mat-button type=\"button\" (click)=\"onLink()\" [disabled]=\"disabled\">\n                <mat-icon>arrow_back</mat-icon>\n            </button>\n            <button mat-button type=\"submit\" [disabled]=\"disabled\">\n                <mat-icon>check</mat-icon>\n            </button>\n        </div>\n    </form>\n</ng-template>\n", styles: [".input-file-container{position:relative}.input-file-container .files-container{display:flex;flex-direction:row;flex-wrap:wrap;padding-top:1.25rem}.input-file-container .file-container,.input-file-container .file-button{align-items:center;display:flex;height:10rem;justify-content:center;width:10rem}.input-file-container .secondary-button{width:10rem}.input-file-container .file-button{flex:1}.input-file-container .file-container{flex-direction:column;margin-right:1rem;overflow:hidden}.input-file-container .replace-button{flex:1;width:10rem}.input-file-container .mat-button:focus{outline:0}.input-file-container .file-name{width:7.5rem}.input-file-container .image-preview{position:absolute;height:10rem;-o-object-fit:contain;object-fit:contain;width:10rem}.input-file-container .input-icon{font-size:2.5rem;height:2.5rem;width:2.5rem}.input-file-container .form-link{display:flex;flex-direction:column;width:10rem}.input-file-container .input-link{width:10rem}.input-file-container .form-link-button{display:flex;flex-direction:row}.input-file-container .form-link-button .mat-button{min-width:5rem;width:5rem}.input-file-container .mat-orphan-label{color:#0000008a;display:block;font-size:1rem;left:0;margin:0;position:absolute;top:0;transform-origin:0;transition:.4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.input-file-container .mat-orphan-label.active{transform:scale(.75)}@keyframes bounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scale(1)}}.bounce-in{animation-duration:.75s;animation-name:bounceIn}@keyframes slideInUp{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translate(0)}}.slide-in-up{animation-duration:.25s;animation-name:slideInUp}\n"], components: [{ type: i3.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i4.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { type: i5.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }], directives: [{ type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: DropZoneDirective, selector: "[inputFileDropZone]", inputs: ["disabled"], outputs: ["itemDragOver", "itemDragLeave", "itemDrop"] }, { type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i8.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileComponent, decorators: [{
            type: Component,
            args: [{ selector: 'input-file', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => InputFileComponent),
                            multi: true
                        }
                    ], template: "<div class=\"input-file-container\">\n    <label class=\"mat-orphan-label\" [for]=\"id\" [class.active]=\"files?.length\" [innerHtml]=\"placeholder\" *ngIf=\"placeholder\"></label>\n    <div class=\"files-container\">\n\n        <ng-container *ngFor=\"let file of files; let i = index\">\n            <div class=\"file-container\" [ngClass]=\"classAnimation\">\n                <ng-container *ngTemplateOutlet=\"fileTemplate; context: { $implicit: file, index: i }\"></ng-container>\n            </div>\n        </ng-container>\n\n        <ng-container *ngIf=\"canAddFile\">\n            <div class=\"file-container\">\n                <ng-container *ngIf=\"!addLink; else linkTemplate\">\n                    <ng-container *ngTemplateOutlet=\"addTemplate\"></ng-container>\n                </ng-container>\n            </div>\n        </ng-container>\n    </div>\n\n</div>\n\n<ng-template #addTemplate>\n    <button mat-button inputFileDropZone class=\"file-button\" type=\"button\" (click)=\"fileInput.click()\" (itemDrop)=\"onSelectFile($event, selectButton)\"\n        (itemDragOver)=\"onDragOver(selectButton)\" (itemDragLeave)=\"onDragLeave(selectButton)\" [disabled]=\"disabled\" #selectButton>\n        <mat-icon class=\"input-icon\">{{ iconAdd }}</mat-icon>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" [disabled]=\"disabled\" (click)=\"onLink()\" *ngIf=\"linkEnabled\">\n        <mat-icon>{{ iconLink }}</mat-icon>\n    </button>\n    <input [id]=\"id\" [accept]=\"fileAccept\" hidden type=\"file\" [attr.multiple]=\"fileLimit > 1 ? true : null\" #fileInput (change)=\"onSelectFile($event, selectButton)\">\n</ng-template>\n\n<ng-template #fileTemplate let-file let-index=\"index\">\n    <img class=\"image-preview\" [src]=\"file.preview\" *ngIf=\"file.preview\">\n    <button mat-button inputFileDropZone class=\"replace-button\" type=\"button\" (click)=\"fileReplace.click()\" (itemDrop)=\"onReplaceFile($event, index, replaceButton)\"\n        [disabled]=\"disabled\" (itemDragOver)=\"onDragOver(replaceButton)\" (itemDragLeave)=\"onDragLeave(replaceButton)\" #replaceButton>\n        <ng-container *ngIf=\"!file.preview\">\n            <mat-icon class=\"input-icon\">{{ iconFile }}</mat-icon>\n            <div class=\"file-name text-truncate\" [innerHtml]=\"file.file.name\" *ngIf=\"file.file\"></div>\n        </ng-container>\n    </button>\n    <button mat-button class=\"secondary-button\" type=\"button\" (click)=\"onDeleteFile(index)\" [disabled]=\"disabled\">\n        <mat-icon>{{ iconDelete }}</mat-icon>\n    </button>\n    <input [accept]=\"fileAccept\" hidden type=\"file\" #fileReplace (change)=\"onReplaceFile($event, index, replaceButton, fileReplace)\">\n</ng-template>\n\n<ng-template #linkTemplate>\n    <form class=\"form-link slide-in-up\" [formGroup]=\"form\" (ngSubmit)=\"onSubmitLink()\" novalidate>\n        <mat-form-field class=\"input-link\">\n            <input matInput formControlName=\"link\" [placeholder]=\"placeholderLink\">\n        </mat-form-field>\n        <div class=\"form-link-button\">\n            <button mat-button type=\"button\" (click)=\"onLink()\" [disabled]=\"disabled\">\n                <mat-icon>arrow_back</mat-icon>\n            </button>\n            <button mat-button type=\"submit\" [disabled]=\"disabled\">\n                <mat-icon>check</mat-icon>\n            </button>\n        </div>\n    </form>\n</ng-template>\n", styles: [".input-file-container{position:relative}.input-file-container .files-container{display:flex;flex-direction:row;flex-wrap:wrap;padding-top:1.25rem}.input-file-container .file-container,.input-file-container .file-button{align-items:center;display:flex;height:10rem;justify-content:center;width:10rem}.input-file-container .secondary-button{width:10rem}.input-file-container .file-button{flex:1}.input-file-container .file-container{flex-direction:column;margin-right:1rem;overflow:hidden}.input-file-container .replace-button{flex:1;width:10rem}.input-file-container .mat-button:focus{outline:0}.input-file-container .file-name{width:7.5rem}.input-file-container .image-preview{position:absolute;height:10rem;-o-object-fit:contain;object-fit:contain;width:10rem}.input-file-container .input-icon{font-size:2.5rem;height:2.5rem;width:2.5rem}.input-file-container .form-link{display:flex;flex-direction:column;width:10rem}.input-file-container .input-link{width:10rem}.input-file-container .form-link-button{display:flex;flex-direction:row}.input-file-container .form-link-button .mat-button{min-width:5rem;width:5rem}.input-file-container .mat-orphan-label{color:#0000008a;display:block;font-size:1rem;left:0;margin:0;position:absolute;top:0;transform-origin:0;transition:.4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.input-file-container .mat-orphan-label.active{transform:scale(.75)}@keyframes bounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scale(1)}}.bounce-in{animation-duration:.75s;animation-name:bounceIn}@keyframes slideInUp{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translate(0)}}.slide-in-up{animation-duration:.25s;animation-name:slideInUp}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.FormBuilder }, { type: InputFileService }]; }, propDecorators: { disabled: [{
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

class InputFileModule {
    static forRoot(config) {
        return {
            ngModule: InputFileModule,
            providers: [
                InputFileService,
                { provide: 'config', useValue: config }
            ]
        };
    }
}
InputFileModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
InputFileModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileModule, declarations: [DropZoneDirective,
        InputFileComponent], imports: [CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule], exports: [InputFileComponent] });
InputFileModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileModule, providers: [
        InputFileService
    ], imports: [[
            CommonModule,
            FormsModule,
            MatButtonModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            ReactiveFormsModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: InputFileModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DropZoneDirective,
                        InputFileComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        MatButtonModule,
                        MatFormFieldModule,
                        MatIconModule,
                        MatInputModule,
                        ReactiveFormsModule
                    ],
                    exports: [
                        InputFileComponent
                    ],
                    providers: [
                        InputFileService
                    ],
                    entryComponents: [InputFileComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { InputFileComponent, InputFileModule, InputFileService };
//# sourceMappingURL=mhernandez-easygo-ngx-input-file.mjs.map
