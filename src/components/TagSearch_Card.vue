<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ item.title }}</span>
      <small class="lMargin subtitle" v-if="infoListItem.id !== undefined">
        {{ infoListItem.name }}
      </small>
      <el-badge class="lMargin item" :value="hitCount"></el-badge>
      <el-button style="float: right; padding: 3px 0" type="text">
        <a target="_blank" :href="url">Visit on Bangumi</a>
      </el-button>
    </div>
    <div class="text item" v-if="infoListItem.id !== undefined">
      {{ infoListItem.summary }}
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from 'vue-property-decorator';
import { SimpleResult } from '@/utils/interfaces';

@Component
export default class TagCard extends Vue {
  @Prop() private item!: SimpleResult;
  @Prop() private infoListItem!: object;

  get url() {
    return `https://bgm.tv/subject/${this.item.id}`;
  }

  get hitCount() {
    return this.item.hit === 1 ? "1 hit" : `${this.item.hit} hits`;
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  color: grey;
}

.lMargin {
  margin-left: 10px;
}
</style>
