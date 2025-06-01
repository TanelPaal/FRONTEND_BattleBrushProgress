import { IMiniPaintSwatch } from "@/types/domain/IMiniPaintSwatch";
import { IMiniPaintSwatchAdd } from "@/types/domain/IMiniPaintSwatchAdd";
import { EntityService } from "./EntityService";

export class MiniPaintSwatchService extends EntityService<IMiniPaintSwatch, IMiniPaintSwatchAdd> {
    constructor() {
        super('minipaintswatch'); // matches /api/v1/MiniPaintSwatch
    }
}
