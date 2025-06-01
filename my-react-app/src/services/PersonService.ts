import { IPerson } from "@/types/domain/IPerson";
import { EntityService } from "./EntityService";
import { IPersonAdd } from "@/types/domain/IPersonAdd";

export class PersonService extends EntityService<IPerson, IPersonAdd> {
	constructor(){
		super('person')
	}
}
