<template>
  <div>
    <h1>Bangumi - 发现频道</h1>

    <el-row type="flex" justify="center">
      <el-col :span="3">
        <el-input
          placeholder="Bangumi Item ID"
          v-model="curAddingBgmId"
        ></el-input>
      </el-col>
      <el-col :span="1">
        <el-button
          type="primary"
          @click="updateTagList"
          :loading="addLoading"
          :disabled="addLoading"
          >添加
        </el-button>
      </el-col>
    </el-row>

    <el-row id="rowOpr" type="flex" justify="center" :gutter="20">
      <el-col :span="3">
        <el-checkbox-group class="checkboxGroup" v-model="checkedTags">
          <div class="checkboxItem" v-for="obj in tagsSorted" :key="obj.name">
            <el-checkbox class="checkboxBox" :label="obj.name">
              {{ obj.name }}
            </el-checkbox>
            <div class="cntBadge">{{ obj.count }}</div>
            <i class="el-icon-delete ricon" @click="removeTag(obj.name)" />
          </div>
        </el-checkbox-group>
        <el-button
          id="btnClearTags"
          v-show="tags.length > 0"
          @click="clearTags"
          type="warning"
          >Clear</el-button
        >
      </el-col>
      <el-col :span="12">
        <div id="bgmItemList">
          <TagCard
            class="bgmOneItem"
            v-for="(item, index) in targetList"
            :key="index"
            :item="item"
            v-bind:info-list-item="infoList[item.id]"
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
import { Watch } from 'vue-property-decorator'
import { getTagList, getTagItems, getSubjectInfo } from "@/utils/bgm";
import { SimpleItem, SimpleResult } from '@/utils/interfaces';
import TagCard from '@/components/TagSearch_Card.vue';
import difference from "lodash.difference";

interface tagItem {
  name: string;
  count: number;
}


@Component(
  {
    components: { TagCard }
  }
)
export default class App extends Vue {
  tags: { [key: string]: number; } = {}

  checkedTags: string[] = []

  curAddingBgmId = 48031

  tagItemList: { [key: string]: SimpleItem[] } = {}

  targetList: SimpleResult[] = []

  addLoading = false

  infoList: { [key: number]: object; } = {}

  infoChanged: { [key: number]: number; } = {}

  async updateTagList() {
    this.addLoading = true;
    let tagList = [];
    try {
      tagList = await getTagList(this.curAddingBgmId);
    } catch (err) {
      this.addLoading = false;
      return;
    }
    for (const i of tagList) {
      if (this.tags[i] === undefined) {
        this.$set(this.tags, i, 1);
      } else {
        this.$set(this.tags, i, this.tags[i] + 1);
      }
    }
    this.addLoading = false;
  }

  removeTag(name: string) {
    this.$delete(this.checkedTags, this.checkedTags.indexOf(name));
    this.$delete(this.tags, name);
  }

  get tagsSorted(): tagItem[] {
    const ret: tagItem[] = [];
    for (const key in this.tags) {
      ret.push({
        name: key,
        count: this.tags[key]
      })
    }
    return ret.sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      } else {
        return a.name < b.name ? -1 : 1;
      }
    });
  }

  clearTags() {
    for (const key in this.tags) {
      this.removeTag(key);
    }
  }

  @Watch('checkedTags')
  async updateTagsItem(newT: string[]) {
    for (const i of newT) {
      if (this.tagItemList[i] == undefined) {
        let item = await getTagItems(i);
        this.$set(this.tagItemList, i, item);
      }
    }
    this.updateTargetList();
  }

  updateTargetList() {
    const ret: { [key: string]: SimpleResult } = {}
    for (const tag of this.checkedTags) {
      if (this.tagItemList[tag] === undefined) continue;
      for (const item of this.tagItemList[tag]) {
        if (ret[item.title] === undefined) {
          ret[item.title] = Object.assign({
            hit: 1
          }, item)
          if (this.infoList[item.id] === undefined)
            this.fetchAndSaveItem(item.id);
        } else {
          ret[item.title].hit++;
        }
      }
    }
    this.targetList = Object.values(ret).sort((a, b) => {
      return b.hit - a.hit;
    });
  }

  async fetchAndSaveItem(id: number) {
    this.$set(this.infoList, id, {})
    let _this = this
    getSubjectInfo(id).then((data) => {
      _this.$set(_this.infoList, id, data);
    }).catch(
      () => { console.warn(`Fetch failed for #${id}`) }
    );
  }

}
</script>


<style lang="scss" scoped>
h1 {
  text-align: center;
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
