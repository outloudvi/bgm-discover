<template>
  <el-card class="box-card">
    {{ item.title }} ( {{ item.hit }} ) {{ infoListItem }}
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from 'vue-property-decorator';
import { SimpleItem } from '@/utils/interfaces';

@Component
export default class TagCard extends Vue {
  @Prop() private item!: SimpleItem;
  @Prop() private infoListItem!: object;
}
</script>

<style lang="scss" scoped>
</style>
