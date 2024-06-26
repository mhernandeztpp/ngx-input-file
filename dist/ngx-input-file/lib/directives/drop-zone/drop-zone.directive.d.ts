import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DropZoneDirective {
    disabled: boolean;
    itemDragOver: EventEmitter<any>;
    itemDragLeave: EventEmitter<any>;
    itemDrop: EventEmitter<any>;
    private isOver;
    private whiteListClasses;
    /**
     * Drag Over event handler.
     * @param event
     */
    onDragOver(event: any): void;
    /**
     * Drag Leave event handler.
     * @param event
     */
    onDragLeave(event: any): void;
    /**
     * Drop event handler.
     * @param event
     */
    onDrop(event: any): void;
    /**
     * Prevents and stops event propagration.
     * @param event
     */
    private preventAndStopEventPropagation;
    /**
     * Checks if the leave is not trigger by a children.
     * @param event
     */
    private isTrueLeave;
    static ɵfac: i0.ɵɵFactoryDeclaration<DropZoneDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DropZoneDirective, "[inputFileDropZone]", never, { "disabled": "disabled"; }, { "itemDragOver": "itemDragOver"; "itemDragLeave": "itemDragLeave"; "itemDrop": "itemDrop"; }, never>;
}
