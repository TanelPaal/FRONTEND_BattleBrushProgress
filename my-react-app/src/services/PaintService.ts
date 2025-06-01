import { IPaint } from "@/types/domain/IPaint";
import { EntityService } from "./EntityService";

export class PaintService extends EntityService<IPaint, any> {
    constructor() {
        super('paint');
    }
}
