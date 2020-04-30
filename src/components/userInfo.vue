<template>
  <v-list style="background-color: transparent;">
    <v-list-item>
      <v-list-item-avatar v-if="userInfo.images.length > 0">
        <img :src="userInfo.images[0].url" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ userInfo.display_name }}</v-list-item-title>
        <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  /**
   * @module components/userInfo
   * @desc Display information about user
   * @vue-prop {Object} userInfo - Object with information about logged user
   */
  props: {
    userInfo: Object,
  },
};
</script>
