import axios from 'axios';
import { SimpleItem } from './interfaces';
const API_SERVER = "http://172.17.0.2"

const parser = new DOMParser();

export async function getTagList(id: number): Promise<string[]> {
  const resp = await axios.request({ url: `${API_SERVER}/bgm.tv/subject/${id}`, timeout: 5000 })
  const doc = parser.parseFromString(resp.data, "text/html");
  return Array.from(doc.querySelectorAll(".subject_tag_section .inner .l > span")).map(x => x.textContent || "").filter(x => x !== "");
}

export async function getTagItems(tag: string): Promise<SimpleItem[]> {
  const resp = await axios.request({ url: `${API_SERVER}/bgm.tv/anime/tag/${tag}/?sort=rank`, timeout: 5000 })
  const doc = parser.parseFromString(resp.data, "text/html");
  const domItems = Array.from(doc.querySelectorAll('#browserItemList .item'));
  return domItems.map((item) => {
    const idMatch: any = item.id.match(/item_(\d+)/);
    const id = (idMatch === null && idMatch.length === 2) ? -1 : Number(idMatch[1]);
    const titleMatch = item.querySelector("h3 a.l");
    const title = (titleMatch !== null) ? (titleMatch.textContent || "") : "";
    return {
      id,
      title,
    };
  });
}

export async function getSubjectInfo(id: number): Promise<Object> {
  const resp = await axios.request({ url: `${API_SERVER}/api.bgm.tv/subject/${id}`, timeout: 5000 })
  console.log(resp);
  return resp.data;
}

declare global {
  interface Window {
    bgm: any;
  }
}

// @predev: remove_before_prod
window.bgm = {
  getTagItems,
  getTagList,
  getSubjectInfo
}