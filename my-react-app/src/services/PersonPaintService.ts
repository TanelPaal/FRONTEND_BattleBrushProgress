import { IPersonPaint } from "@/types/domain/IPersonPaint";
import { EntityService } from "./EntityService";
import { IPersonPaintAdd } from "@/types/domain/IPersonPaintAdd";

export class PersonPaintService extends EntityService<IPersonPaint, IPersonPaintAdd> {
	constructor() {
		super('personpaints');
	}
}
