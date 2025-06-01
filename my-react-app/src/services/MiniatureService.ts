import { IMiniature } from "@/types/domain/IMiniature";
import { EntityService } from "./EntityService";

export class MiniatureService extends EntityService<IMiniature, IMiniature> {
    constructor() {
        super('miniature'); // matches /api/v1/Miniature
    }
}
