import { IMiniatureCollection } from "@/types/domain/IMiniatureCollection";
import { EntityService } from "./EntityService";
import { IMiniatureCollectionAdd } from "@/types/domain/IMiniatureCollectionAdd";

export class MiniatureCollectionService extends EntityService<IMiniatureCollection, IMiniatureCollectionAdd> {
    constructor() {
        super('miniaturecollection'); // matches /api/v1/MiniatureCollection
    }
}
