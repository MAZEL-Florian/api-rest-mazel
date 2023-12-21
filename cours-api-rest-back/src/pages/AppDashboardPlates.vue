<script setup>
import ApiService from "../api/ApiService";
import { onMounted, ref } from "vue";
import RestaurantItem from "../components/RestaurantItem.vue";
import PlateItem from "../components/PlateItem.vue";

const plates = ref([]);

async function loadRestaurantPlates() {
  const user = await ApiService.getLoggedUser();
  const restaurantId = user.restaurant;

  plates.value = await ApiService.getRestaurantPlates(restaurantId);
}

onMounted(() => {
  loadRestaurantPlates();
});
</script>

<template>
  <div>
    <header class="page-header">
      <h1 class="page-title">Plats</h1>
      <RouterLink to="/dashboard/plates/create" class="add-plate button"
        >Ajouter un plat</RouterLink
      >
    </header>
    <div class="plates">
      <PlateItem :plate="plate" v-for="plate in plates" :key="plate._id" />
    </div>
  </div>
</template>

<style scoped>
.add-plate {
  margin-left: auto;
}

.plates {
  margin-top: 20px;
  flex-wrap: wrap;
  display: flex;
}
</style>
