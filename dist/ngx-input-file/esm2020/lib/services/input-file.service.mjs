import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class InputFileService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtZmlsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWlucHV0LWZpbGUvc3JjL2xpYi9zZXJ2aWNlcy9pbnB1dC1maWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBT25ELE1BQU0sT0FBTyxnQkFBZ0I7SUFFekIsWUFDOEIsT0FBd0I7UUFBeEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7SUFDbEQsQ0FBQztJQUVMLElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksVUFBVSxDQUFDLEtBQXVCLEVBQUUsU0FBUztRQUNoRCxPQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksU0FBUyxDQUFDLElBQVUsRUFBRSxTQUFpQjtRQUMxQyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUI7SUFDL0UsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTLENBQUMsSUFBVSxFQUFFLFVBQWtCO1FBQzNDLElBQUksT0FBTyxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUM7UUFDakMsSUFBSSxVQUFVLEVBQUU7WUFDWixNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDekcsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDZixNQUFNO2lCQUNUO2FBQ0o7U0FDSjtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7OzhHQTlDUSxnQkFBZ0Isa0JBR2IsUUFBUTtrSEFIWCxnQkFBZ0IsY0FGYixNQUFNOzRGQUVULGdCQUFnQjtrQkFINUIsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckI7OzBCQUlRLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5wdXRGaWxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pbnB1dC1maWxlJztcbmltcG9ydCB7IElucHV0RmlsZUNvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvaW5wdXQtZmlsZS1jb25maWcnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIElucHV0RmlsZVNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoJ2NvbmZpZycpIHByaXZhdGUgX2NvbmZpZzogSW5wdXRGaWxlQ29uZmlnXG4gICAgKSB7IH1cblxuICAgIGdldCBjb25maWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgbGltaXQgaXMgbm90IHJlYWNoZWQuXG4gICAgICogQHBhcmFtIGZpbGVzXG4gICAgICovXG4gICAgcHVibGljIGxpbWl0R3VhcmQoZmlsZXM6IEFycmF5PElucHV0RmlsZT4sIGZpbGVMaW1pdCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoIDwgZmlsZUxpbWl0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGZpbGUgc2l6ZSBpcyBub3QgYmlnZ2VyIHRoYW4gdGhlIGxpbWl0LlxuICAgICAqIEBwYXJhbSBmaWxlXG4gICAgICogQHBhcmFtIHNpemVMaW1pdFxuICAgICAqL1xuICAgIHB1YmxpYyBzaXplR3VhcmQoZmlsZTogRmlsZSwgc2l6ZUxpbWl0OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICFzaXplTGltaXQgfHwgZmlsZS5zaXplIDwgc2l6ZUxpbWl0ICogMTAyNCAqIDEwMjQ7IC8vIFRPRE8gOiBpbXByb3ZlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgdHlwZSBvZiB0aGUgZmlsZSBpcyBlbmFibGVkLlxuICAgICAqIEBwYXJhbSBmaWxlXG4gICAgICogQHBhcmFtIGZpbGVBY2NlcHRcbiAgICAgKi9cbiAgICBwdWJsaWMgdHlwZUd1YXJkKGZpbGU6IEZpbGUsIGZpbGVBY2NlcHQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZW5hYmxlZCA9IGZpbGVBY2NlcHQgPT0gbnVsbDtcbiAgICAgICAgaWYgKGZpbGVBY2NlcHQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjY2VwdCA9IGZpbGVBY2NlcHQucmVwbGFjZSgnKicsICcnKTtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZS50eXBlLnN0YXJ0c1dpdGgodHlwZSkgfHwgKHR5cGUuY2hhckF0KDApID09PSAnLicgJiYgZmlsZS5uYW1lICE9IG51bGwgJiYgZmlsZS5uYW1lLmVuZHNXaXRoKHR5cGUpKSkge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVuYWJsZWQ7XG4gICAgfVxufVxuIl19