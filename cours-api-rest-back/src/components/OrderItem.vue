<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ApiService from "../api/ApiService";

const props = defineProps({
  order: Object,
  onOrderCanceled: Function,
});

const emit = defineEmits(['orderDeleted']); // Définir l'événement 'orderDeleted'

const total = computed(() =>
  props?.order?.items?.reduce((total, item) => total + dishDetails.prix, 0)
);

async function deleteOrder() {
  await ApiService.deleteOrder(props.order?._id);
  props.onOrderCanceled?.();
  emit('orderDeleted'); // Émettre l'événement 'orderDeleted'
}
</script>


<template>
  <div class="order-item-wrapper">
    <div class="order-item">
      <div class="order-client col">{{ order?.userInfo?.email }}</div>
      <div class="order-total col">{{ order?.dishDetails?.prix }}€</div>
      <div class="order-nb-articles col">1</div>
      <div class="order-actions col">
        <button @click="deleteOrder" class="button button-error">
          Annuler la commande
        </button>
      </div>
    </div>
    <div class="items">
      <div class="item">
        <img class="item-image" :src="order?.dishDetails?.urlPhoto" alt="" />
        <div class="item-infos">
          <div class="item-title">{{ order?.dishDetails?.name }}</div>
          <div class="item-price">{{ order?.dishDetails?.prix }}€</div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.order-item {
  display: flex;
  align-items: center;
}

.order-item-wrapper {
  background-color: white;
  padding: 20px;
  margin: 5px;
}

.col {
  flex: 1;
}

.item {
  display: flex;
  align-items: center;
  padding: 10px;
}

.item-image {
  width: 70px;
  margin-right: 16px;
}
.item-title {
  font-weight: bold;
}
</style>