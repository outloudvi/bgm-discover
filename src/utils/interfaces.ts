export interface SimpleItem {
    id: number;
    title: string;
}

export interface SimpleResult extends SimpleItem {
    hit: number;
}  