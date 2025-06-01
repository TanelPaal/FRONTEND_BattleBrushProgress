import { IDomainId } from "../IDomainId";

export interface IMiniatureCollection extends IDomainId {
    collectionName: string;
    collectionDesc: string;
    acquisitionDate: string; // ISO string
    completionDate: string; // ISO string
    miniatureId: string;
    miniStateId: string;
    personId: string;
    miniature?: { id: string; miniName: string };
    miniState?: { id: string; stateName: string };
    person?: { id: string; personName: string };
    // Optionally, expand with related objects if backend supports it:
    // miniature?: { id: string; name: string; ... }
    // miniState?: { id: string; name: string; ... }
    // person?: { id: string; personName: string; }
}
