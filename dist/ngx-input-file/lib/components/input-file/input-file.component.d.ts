import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InputFile } from '../../interfaces/input-file';
import { InputFileRejected } from '../../interfaces/input-file-rejected';
import { InputFileService } from '../../services/input-file.service';
import { MatButton } from '@angular/material/button';
import * as i0 from "@angular/core";
export declare class InputFileComponent implements ControlValueAccessor, OnInit {
    private formBuilder;
    private inputFileService;
    static nextId: number;
    private _classAnimation;
    private _fileAccept;
    private _fileLimit;
    private _iconAdd;
    private _iconDelete;
    private _iconFile;
    private _iconLink;
    private _linkEnabled;
    private _placeholderLink;
    private _sizeLimit;
    disabled: boolean;
    placeholder: string;
    set classAnimation(classAnimation: string);
    get classAnimation(): string;
    set fileAccept(fileAccept: string);
    get fileAccept(): string;
    set fileLimit(fileLimit: number);
    get fileLimit(): number;
    set iconAdd(iconAdd: string);
    get iconAdd(): string;
    set iconDelete(iconDelete: string);
    get iconDelete(): string;
    set iconFile(iconFile: string);
    get iconFile(): string;
    set iconLink(iconLink: string);
    get iconLink(): string;
    set linkEnabled(linkEnabled: boolean);
    get linkEnabled(): boolean;
    set placeholderLink(placeholderLink: string);
    get placeholderLink(): string;
    set sizeLimit(sizeLimit: number);
    get sizeLimit(): number;
    acceptedFile: EventEmitter<InputFile>;
    deletedFile: EventEmitter<InputFile>;
    rejectedFile: EventEmitter<InputFileRejected>;
    fileInput: ElementRef;
    addLink: boolean;
    files: InputFile[];
    form: FormGroup;
    id: string;
    onChange: (files: Array<InputFile>) => void;
    onTouched: () => void;
    get canAddFile(): boolean;
    constructor(formBuilder: FormBuilder, inputFileService: InputFileService);
    /**
     * Angular lifecyle OnInit implementation.
     */
    ngOnInit(): void;
    /**
     * On delete a file event handler.
     * @param index
     */
    onDeleteFile(index: number): void;
    /**
     * On drag over event handler.
     * Adds a ripple effect on the button.
     */
    onDragOver(button: MatButton): void;
    /**
     * On drag leave event handler.
     * Fades the ripple effect of the button.
     */
    onDragLeave(button: MatButton): void;
    /**
     * On adds a link.
     */
    onLink(): void;
    /**
     * On replace one file event handler.
     * Writes the value.
     * @param fileList
     * @param index
     * @param fileInput
     */
    onReplaceFile(e: Event, index: number, button: MatButton, fileInput?: HTMLInputElement): void;
    /**
     * On select one or more files event handler.
     * Writes the value.
     * @param fileList
     */
    onSelectFile(e: Event, button: MatButton): void;
    /**
     * On submit the link form event handler.
     */
    onSubmitLink(): void;
    /**
     * Implementation of ControlValueAccessor.
     * @param fn
     */
    registerOnChange(fn: (files: Array<InputFile>) => void): void;
    /**
     * Implementation of ControlValueAccessor.
     * @param fn
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Implementation of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Implementation of ControlValueAccessor.
     * @param files
     */
    writeValue(files: Array<InputFile>): void;
    /**
     * Whether the file can be added to the model.
     * @param files
     * @param file,
     * @param bypassLimit
     */
    private fileGuard;
    /**
     * Sets the file preview with FileReader.
     */
    private setFilePreview;
    /**
     * Sets the reactive form to insert a link.
     */
    private setForm;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputFileComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InputFileComponent, "input-file", never, { "disabled": "disabled"; "placeholder": "placeholder"; "classAnimation": "classAnimation"; "fileAccept": "fileAccept"; "fileLimit": "fileLimit"; "iconAdd": "iconAdd"; "iconDelete": "iconDelete"; "iconFile": "iconFile"; "iconLink": "iconLink"; "linkEnabled": "linkEnabled"; "placeholderLink": "placeholderLink"; "sizeLimit": "sizeLimit"; }, { "acceptedFile": "acceptedFile"; "deletedFile": "deletedFile"; "rejectedFile": "rejectedFile"; }, never, never>;
}
