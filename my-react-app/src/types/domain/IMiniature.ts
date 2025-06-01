import { IDomainId } from "../IDomainId";

export interface IMiniature extends IDomainId {
    miniName: string;
    miniDesc: string;
    miniFactionId: string;
    miniPropertiesId: string;
    miniManufacturerId: string;
    // Optional related objects
    miniFaction?: {
        id: string;
        factionName: string;
        factionDesc: string;
    };
    miniProperties?: {
        id: string;
        propertyName: string;
        propertyDesc: string;
    };
    miniManufacturer?: {
        id: string;
        manufacturerName: string;
        headquartersLocation: string;
        contactEmail: string;
        contactPhone: string;
    };
}
