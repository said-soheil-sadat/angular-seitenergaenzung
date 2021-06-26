export interface LruPage {
  page_value: number;
  bg_color: string;
}
export interface FifoPage extends LruPage {
  page_age: number;
}
export interface SecChance extends LruPage {
  secondChance: boolean;
}
export interface LfuPage extends FifoPage {
  page_hits: number;
}
