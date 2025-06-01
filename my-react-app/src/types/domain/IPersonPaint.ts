import { IDomainId } from "../IDomainId";

export interface IPersonPaint extends IDomainId {
	quantity: number;
	acquisitionDate: string; // ISO string
	personId: string;
	personName: string;
	person: {
		id: string;
		personName: string;
	};
	paintId: string;
	paint: {
		id: string;
		name: string;
		hexCode: string;
		upc: string;
		brandId: string;
		brand?: {
			id: string;
			brandName: string;
		};
		paintTypeId: string;
		paintType?: {
			id: string;
			name: string;
		};
		paintLineId?: string;
		paintLine?: {
			id: string;
			paintLineName: string;
		};
	};
}