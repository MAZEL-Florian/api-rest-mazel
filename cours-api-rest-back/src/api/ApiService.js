import AxiosInstance from "./AxiosInstance";

class ApiService {
  async getLoggedUser() {
    const { data } = await AxiosInstance.get(`/users/@me`);
    return data;
  }

  async getRestaurantAccounts() {
    const { data } = await AxiosInstance.get(`/restaurants`);
    return data;
  }

  async deleteRestaurant(restaurantId) {
    return AxiosInstance.delete(`http://localhost:3000/api/restaurants/${restaurantId}`);
  }

  async createRestaurantUser(restaurantUser) {
    console.log(restaurantUser);
    return AxiosInstance.post('http://localhost:3000/api/restaurants', {
      name: restaurantUser.name,
      address: restaurantUser.address,
      postalCode: restaurantUser.postalCode,
      city: restaurantUser.city,
      password: restaurantUser.password,
      email : restaurantUser.email
    });
  }

  async updateRestaurantUser(restaurantData) {
    const restaurantId = restaurantData.restaurant; 
    return AxiosInstance.put(`http://localhost:3000/api/restaurants/${restaurantId}`, {
      name: restaurantData.name,
      address: restaurantData.address,
      postalCode: restaurantData.postalCode,
      city: restaurantData.city
    });
  }

  async getPlate(plateId) {
    const response = await AxiosInstance.get(`http://localhost:3000/api/dishes/${plateId}`);
    return response.data;
  }

  async updatePlate(plateId, newPlate) {
    return AxiosInstance.put(`http://localhost:3000/api/dishes/${plateId}`, {
      name: newPlate.name,
      urlPhoto: newPlate.urlPhoto,
      prix: newPlate.prix
    });
  }
  
  

  async createPlate(newPlate) {
    return AxiosInstance.post('http://localhost:3000/api/dishes', {
      name: newPlate.name,
      urlPhoto: newPlate.urlPhoto,
      prix: newPlate.prix,
      restaurant: newPlate.restaurant_id
    });
  }
  

  async getRestaurantPlates(restaurantId) {
    try {
      const response = await AxiosInstance.get(`http://localhost:3000/api/dishes/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des plats : ", error);
      return [];
    }
  }
  

  async deleteOrder(orderId) {
    return AxiosInstance.delete(`http://localhost:3000/api/orders/${orderId}`);
  }

  async getRestaurantOrders(restaurantId) {
    try {
      const response = await AxiosInstance.get(`http://localhost:3000/api/orders/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes : ", error);
      return [];
    }
  }
  
}

export default new ApiService();
