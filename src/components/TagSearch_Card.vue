<template>
  <el-card class="box-card"> {{ item.title }} ( {{ item.hit }} ) </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from 'vue-property-decorator';
import { SimpleItem } from '@/utils/interfaces';

@Component
export default class TagCard extends Vue {
  @Prop() private item!: SimpleItem;
}
</script>

<style lang="scss" scoped>
</style>
