import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';

import { getTagList, getTagItems, getSubjectInfo, getSearchResults } from "@/utils/bgm";
import { SimpleItem, SimpleResult, tagItem } from '@/utils/interfaces';
import difference from "lodash.difference";

Vue.use(Vuex);

function tagKVToObject(tags: { [key: string]: number; }): tagItem[] {
    let ret: tagItem[] = [];
    for (const key in tags) {
        ret.push({
            name: key,
            count: tags[key]
        })
    }
    return ret;
}

function tagItemsSort(obj: tagItem[]): tagItem[] {
    return obj.sort((a, b) => {
        if (a.count !== b.count) {
            return b.count - a.count;
        } else {
            return a.name < b.name ? -1 : 1;
        }
    });
}

const store: StoreOptions<RootState> = {
    state: {
        tagNameToHits: {},
        checkedTags: [],
        tagItems: {},
        itemDetails: {},
        addLoading: false,
        searchLoading: false,
        searchSelection: []
    },
    getters: {
        tagItemsSorted: state => {
            let tagsObj = tagKVToObject(state.tagNameToHits);
            return tagItemsSort(tagsObj);
        },
        targetList: state => {
            const ret: { [key: string]: SimpleResult } = {}
            for (const tag of state.checkedTags) {
                for (const item of state.tagItems[tag]) {
                    if (ret[item.title] === undefined) {
                        ret[item.title] = Object.assign({
                            hit: 1
                        }, item)
                    } else {
                        ret[item.title].hit++;
                    }
                }
            }
            return Object.values(ret).sort((a, b) => {
                return b.hit - a.hit;
            });
        }
    },
    mutations: {
        pushTag(state, tag: string) {
            if (!state.checkedTags.includes(tag))
                state.checkedTags.push(tag);
        },
        setTagItem(state, item: { tag: string, objects: SimpleItem[] }) {
            Vue.set(state.tagItems, item.tag, item.objects);
        },
        setItem(state, item: { id: number, object: object }) {
            Vue.set(state.itemDetails, item.id, item.object);
        },
        uncheckTag(state, tag: string) {
            let index = state.checkedTags.indexOf(tag);
            if (index !== -1)
                Vue.delete(state.checkedTags, index);
        },
        hitTag(state, tag: string) {
            if (state.tagNameToHits[tag] === undefined)
                Vue.set(state.tagNameToHits, tag, 1);
            else
                Vue.set(state.tagNameToHits, tag, state.tagNameToHits[tag] + 1);

        },
        rmTag(state, tag: string) {
            let checkIdx = state.checkedTags.indexOf(name);
            checkIdx === -1 || Vue.delete(state.checkedTags, checkIdx);
            Vue.delete(state.tagNameToHits, tag);
        },
        add_Loading(state) {
            state.addLoading = true;
        },
        add_Loaded(state) {
            state.addLoading = false;
        },
        search_Loading(state) {
            state.searchLoading = true;
        },
        search_Loaded(state) {
            state.searchLoading = false;
        },
        saveSearchResults(state, results: object[]) {
            Vue.set(state, "searchSelection", results);
        }
    },
    actions: {
        updateCheckedTags({ dispatch, commit, state }, tags: string[]) {
            let diffPlus = difference(tags, state.checkedTags);
            let diffMinus = difference(state.checkedTags, tags);
            for (const i of diffPlus) {
                dispatch('checkTag', i);
                dispatch('fetchTagItem', i);
            }
            for (const i of diffMinus) {
                commit('uncheckTag', i);
            }
        },
        addTagFromItem({ commit }, id: number) {
            getTagList(id).then(tagsToPush => {
                for (const i of tagsToPush) {
                    commit('hitTag', i);
                }
            })
        },

        search({ commit }, word: string) {
            commit("search_Loading")
            getSearchResults(word)
                .then(data => data.list)
                .then(list => {
                    commit("saveSearchResults", list);
                })
                .catch(err => {
                    console.warn("Search error:", err);
                }).finally(() => {
                    commit("search_Loaded")
                });
        },
        fetchTagItem({ commit, state }, tagName: string) {
            if (state.tagItems[tagName] !== undefined) return;
            commit('setTagItem', {
                tag: tagName,
                objects: []
            })
            getTagItems(tagName).then((item) => {
                commit('setTagItem', {
                    tag: tagName,
                    objects: item
                })
            });
        },
        checkTag({ commit, dispatch }, tag: string) {
            commit('pushTag', tag);
            dispatch('fetchTagItem', tag);
        },
        fetchItem({ commit, state }, id: number) {
            if (state.itemDetails[id] !== undefined) return;
            commit('setItem', {
                id,
                object: {}
            })
            getSubjectInfo(id).then((data) => {
                commit('setItem', {
                    id,
                    object: data
                })
            });
        }
    }
};

export default new Vuex.Store<RootState>(store);