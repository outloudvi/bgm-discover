<template>
  <div>
    <h1>Bangumi - 发现频道</h1>

    <el-row type="flex" justify="center" :gutter="5">
      <el-col :span="6">
        <el-select
          class="elSelect"
          v-model="curAddingBgmId"
          filterable
          remote
          reserve-keyword
          placeholder="keyword"
          :remote-method="updateSearch"
          :loading="$store.state.searchLoading"
        >
          <el-option
            v-for="item in $store.state.searchSelection"
            :key="item.id"
            :label="item.name_cn || item.name"
            :value="item.id"
          >
            <span style="float: left">{{ item.name_cn || item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ entityType[item.type] }} / #{{ item.id }}
            </span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button
          type="primary"
          @click="updateTagList"
          :loading="$store.state.addLoading"
          :disabled="$store.state.addLoading"
          >添加
        </el-button>
      </el-col>
    </el-row>

    <el-row id="rowOpr" type="flex" justify="center" :gutter="20">
      <el-col :span="3">
        <el-checkbox-group class="checkboxGroup" v-model="checkedTags">
          <div
            class="checkboxItem"
            v-for="obj in $store.getters.tagItemsSorted"
            :key="obj.name"
          >
            <el-checkbox class="checkboxBox" :label="obj.name">
              {{ obj.name }}
            </el-checkbox>
            <div class="cntBadge">{{ obj.count }}</div>
            <i
              class="el-icon-delete ricon"
              @click="$store.commit('rmTag', obj.name)"
            />
          </div>
        </el-checkbox-group>
        <el-button
          id="btnClearTags"
          v-show="$store.getters.tagItemsSorted.length > 0"
          @click="clearTags"
          type="warning"
          >Clear</el-button
        >
      </el-col>
      <el-col :span="12">
        <div id="bgmItemList">
          <TagCard
            class="bgmOneItem"
            v-for="(item, index) in $store.getters.targetList"
            :key="index"
            :item="item"
            v-bind:info-list-item="$store.state.itemDetails[item.id]"
          >
          </TagCard>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { SimpleResult, EntityType } from '@/utils/interfaces';
import TagCard from '@/components/TagSearch_Card.vue';

declare global {
  interface Window {
    vueu: any;
  }
}

@Component(
  {
    components: { TagCard },
  }
)
export default class App extends Vue {

  curAddingBgmId: string | number = ""

  checkedTags: string[] = []

  entityType = EntityType;

  clearTags() {
    let tags = Array.from(this.$store.state.checkedTags);
    for (const i of tags) {
      this.$store.commit('uncheckTag', i);
    }
  }

  @Watch('checkedTags')
  updateTagsItem(newT: string[]) {
    this.$store.dispatch('updateCheckedTags', newT);
    const ret: { [key: string]: SimpleResult } = {}
    for (const tag of this.$store.state.checkedTags) {
      for (const item of this.$store.state.tagItems[tag]) {
        this.$store.dispatch('fetchItem', item.id);
      }
    }
  }

  updateTagList() {
    this.$store.dispatch('addTagFromItem', this.curAddingBgmId);
  }

  updateSearch(query: string) {
    this.$store.dispatch("search", query);
  }

}
</script>


<style lang="scss" scoped>
h1 {
  text-align: center;
}

.elSelect {
  width: 100%;
}

#rowOpr {
  margin-top: 3vh;
}

.checkboxGroup {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .checkboxItem {
    padding: 5px 0;
    display: flex;
    font-size: 14px;
    position: relative;
    align-items: center;
  }

  .checkboxBox {
    flex-grow: 1;
    .el-checkbox__label {
      white-space: initial;
    }
  }

  .ricon {
    margin-left: 10px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .cntBadge {
    background-color: aquamarine;
    border-radius: 20%;
    margin-left: 20px;
    padding: 2px 5px;
  }
}

#btnClearTags {
  width: 100%;
}

#bgmItemList {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.bgmOneItem {
  margin-bottom: 10px;
}
</style>
