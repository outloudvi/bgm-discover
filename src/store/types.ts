import { SimpleItem, SimpleResult, EntityType } from '@/utils/interfaces';

export interface RootState {
    tagNameToHits: { [key: string]: number };
    tagItems: { [key: string]: SimpleItem[] };
    itemDetails: { [key: number]: object; };
    checkedTags: string[];
    addLoading: boolean;
    searchLoading: boolean;
    searchSelection: object[];
}