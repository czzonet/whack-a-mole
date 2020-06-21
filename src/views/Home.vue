<template>
  <div class="home">
    <game-panel></game-panel>
  </div>
</template>

<script>
// @ is an alias to /src
import GamePanel from "@/components/GamePanel/index.vue";

export default {
  name: "Home",
  components: {
    GamePanel
  }
};
</script>
