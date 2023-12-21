<script setup>
import ApiService from "../api/ApiService";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import OrderItem from "../components/OrderItem.vue";

const orders = ref([]);
const route = useRoute();

async function loadRestaurantOrders() {
  const user = await ApiService.getLoggedUser();
  const restaurantId = user.restaurant;
  orders.value = await ApiService.getRestaurantOrders(restaurantId);
}

async function onOrderCanceled() {
  loadRestaurantOrders();
}
onMounted(() => {
  loadRestaurantOrders();
});



</script>

<template>
  <div>
    <header class="page-header">
      <h1 class="page-title">Commandes</h1>
    </header>
    <div class="orders">
      <OrderItem
        v-for="order in orders"
        :key="order._id"
        :order="order"
        @orderDeleted="onOrderCanceled" 
      />
    </div>
  </div>
</template>

<style scoped>
.orders {
  margin-top: 20px;
}
</style>
