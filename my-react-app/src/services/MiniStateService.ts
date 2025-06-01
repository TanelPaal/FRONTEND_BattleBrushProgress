import { IMiniState } from "@/types/domain/IMiniState";
import { EntityService } from "./EntityService";

export class MiniStateService extends EntityService<IMiniState, IMiniState> {
    constructor() {
        super('ministate'); // matches /api/v1/MiniState
    }
}
