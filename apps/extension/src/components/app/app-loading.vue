<script setup lang="ts"></script>

<template>
  <v-container class="fill-height">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="text-subtitle-1 text-center" cols="12">
        <img
          src="/assets/icon.svg"
          class="icon-btn mx-2 text-2xl"
          alt="extension icon"
        >
      </v-col>
      <v-col cols="6">
        <div class="d-flex justify-center" style="width: 100%">
          <v-progress-circular indeterminate />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
