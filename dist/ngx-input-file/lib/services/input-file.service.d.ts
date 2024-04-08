import { InputFile } from '../interfaces/input-file';
import { InputFileConfig } from '../interfaces/input-file-config';
import * as i0 from "@angular/core";
export declare class InputFileService {
    private _config;
    constructor(_config: InputFileConfig);
    get config(): InputFileConfig;
    /**
     * Whether the limit is not reached.
     * @param files
     */
    limitGuard(files: Array<InputFile>, fileLimit: any): boolean;
    /**
     * Whether the file size is not bigger than the limit.
     * @param file
     * @param sizeLimit
     */
    sizeGuard(file: File, sizeLimit: number): boolean;
    /**
     * Whether the type of the file is enabled.
     * @param file
     * @param fileAccept
     */
    typeGuard(file: File, fileAccept: string): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputFileService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InputFileService>;
}
