<script setup lang="ts">

</script>

<template>
  <UiLayout class="px-4 py-5">
    <UiAppBar density="compact">
      <v-spacer />
      <v-tabs stacked>
        <v-tab to="/options">
          Home <icon-mdi-home />
        </v-tab>
        <v-tab to="/options/sounds-and-music">
          Sounds and music <icon-mdi-volume-source />
        </v-tab>
      </v-tabs>
      <v-spacer />
    </UiAppBar>

    <UiMain class="text-center text-gray-700" style="min-height: 300px;">
      <UiContainer fluid>
        <v-row>
          <v-col sm="2" cols="12">
            <v-sheet style="min-height: 268px;">
              <UiList v-if="$route.path.includes('/options/sounds-and-music')" nav density="compact">
                <UiListItem nav to="/options/sounds-and-music" active-color="primary" title="Sounds and music">
                  <template #prepend>
                    <icon-mdi-volume-source />
                  </template>
                </UiListItem>
                <UiListItem nav to="/options/sounds-and-music/background" active-color="primary" title="Background music">
                  <template #prepend>
                    <icon-mdi-image />
                  </template>
                </UiListItem>
              </UiList>
            </v-sheet>
          </v-col>
          <v-col sm="8" cols="12">
            <v-sheet style="min-height: 70vh; position: relative;">
              <RouterView />
            </v-sheet>
          </v-col>
          <v-col sm="2" cols="12">
            <!-- <v-sheet style="min-height: 268px;">
                <div></div>
              </v-sheet> -->
          </v-col>
        </v-row>
      </UiContainer>
    </UiMain>
  </UiLayout>
</template>
