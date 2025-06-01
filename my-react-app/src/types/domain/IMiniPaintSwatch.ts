import { IDomainId } from "../IDomainId";

export interface IMiniPaintSwatch extends IDomainId {
    usageType: string;
    notes: string;
    miniatureCollectionId: string;
    personPaintsId: string;
    miniatureCollection?: { id: string; collectionName: string };
    personPaints?: { 
        id: string; 
        paint?: { 
            id: string; 
            name: string;
            hexCode: string;
        } 
    };
}
