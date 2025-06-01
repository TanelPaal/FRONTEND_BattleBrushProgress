import { IDomainId } from "../IDomainId";

export interface IMiniState extends IDomainId {
    stateName: string;
    stateDesc: string;
}
