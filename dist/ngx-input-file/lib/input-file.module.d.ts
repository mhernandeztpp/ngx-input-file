import { InputFileConfig } from './interfaces/input-file-config';
import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./directives/drop-zone/drop-zone.directive";
import * as i2 from "./components/input-file/input-file.component";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/form-field";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
export declare class InputFileModule {
    static forRoot(config: InputFileConfig): ModuleWithProviders<InputFileModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputFileModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InputFileModule, [typeof i1.DropZoneDirective, typeof i2.InputFileComponent], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.MatButtonModule, typeof i6.MatFormFieldModule, typeof i7.MatIconModule, typeof i8.MatInputModule, typeof i4.ReactiveFormsModule], [typeof i2.InputFileComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InputFileModule>;
}
