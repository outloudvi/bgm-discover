export interface SimpleItem {
    id: number;
    title: string;
}

export interface SimpleResult extends SimpleItem {
    hit: number;
}

export interface SearchResult {
    list: object[];
    results: number;
}

export const EntityType = {
    1: "书籍",
    2: "动画",
    3: "音乐",
    4: "游戏",
    5: "现实人物"
}