<template>
  <v-app>
    <!-- Header -->
    <v-app-bar class="px-4" color="white" elevation="1" height="72">
      <v-btn icon @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6 font-weight-bold ml-2">Uber Eats</v-toolbar-title>

      <v-spacer />

      <!-- Location -->
      <v-btn class="text-none mr-2" variant="text">
        <v-icon start>mdi-map-marker</v-icon>
        73 Rue Rachais · Maintenant
        <v-icon end size="small">mdi-chevron-down</v-icon>
      </v-btn>

      <!-- Search -->
      <v-text-field
        class="search-field mx-2"
        density="compact"
        hide-details
        placeholder="Rechercher dans Uber Eats"
        prepend-inner-icon="mdi-magnify"
        style="max-width: 300px"
        variant="outlined"
      />

      <!-- Cart -->
      <v-btn class="mr-2" icon @click="cartDialog = true">
        <v-badge color="green" :content="cartItems.length">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main class="bg-grey-lighten-4">
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
        <v-progress-circular color="primary" indeterminate size="64" />
      </div>

      <div v-else-if="restaurant">
        <!-- Restaurant Header Image -->
        <v-img cover height="400" :src="restaurant.image">
          <div class="restaurant-header-overlay">
            <v-btn
              class="ma-4"
              color="white"
              icon
              size="large"
              @click="$router.back()"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            <div class="ma-4">
              <v-btn color="white" icon size="large" @click="toggleFavorite">
                <v-icon>{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              </v-btn>
              <v-btn class="ml-2" color="white" icon size="large">
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </div>
          </div>
        </v-img>

        <v-container class="px-8 py-6" fluid>
          <!-- Restaurant Info -->
          <div class="mb-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <h1 class="text-h4 font-weight-bold mb-2">{{ restaurant.name }}</h1>
                <div class="d-flex align-center text-body-1 text-grey-darken-1 mb-2">
                  <v-icon class="mr-1" size="small">mdi-star</v-icon>
                  <span class="font-weight-bold mr-1">{{ restaurant.rating }}</span>
                  <span>({{ restaurant.reviews }}) · </span>
                  <span class="mx-2">{{ restaurant.category }}</span>
                  <span v-if="restaurant.badge" class="mx-2">· {{ restaurant.badge }}</span>
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  <v-icon class="mr-1" size="small">mdi-currency-eur</v-icon>
                  Frais de livraison {{ restaurant.deliveryFee }}€ · {{ restaurant.deliveryTime }}
                </div>
              </div>

              <div class="text-right">
                <v-chip class="mb-2" color="green" size="large" variant="elevated">
                  <v-icon start>mdi-clock-outline</v-icon>
                  {{ restaurant.deliveryTime }}
                </v-chip>
              </div>
            </div>

            <p class="text-body-1">{{ restaurant.description }}</p>
          </div>

          <!-- Delivery Type Buttons -->
          <div class="d-flex gap-2 mb-6">
            <v-btn
              class="text-none"
              :color="deliveryType === 'delivery' ? 'black' : 'grey-lighten-2'"
              @click="deliveryType = 'delivery'"
            >
              <v-icon start>mdi-truck-delivery</v-icon>
              Livraison
            </v-btn>
            <v-btn
              class="text-none"
              :color="deliveryType === 'pickup' ? 'black' : 'grey-lighten-2'"
              @click="deliveryType = 'pickup'"
            >
              <v-icon start>mdi-bag-checked</v-icon>
              À emporter
            </v-btn>
          </div>

          <v-divider class="mb-6" />

          <!-- Search in menu -->
          <v-text-field
            v-model="searchMenu"
            class="mb-6"
            clearable
            hide-details
            placeholder="Rechercher dans le menu"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />

          <!-- Menu Categories Tabs -->
          <v-tabs v-model="selectedCategory" class="mb-6" color="black">
            <v-tab value="all">Tous</v-tab>
            <v-tab v-for="cat in menuCategories" :key="cat" :value="cat">
              {{ cat }}
            </v-tab>
          </v-tabs>

          <!-- Products List -->
          <div v-for="category in displayedCategories" :key="category" class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-4">{{ category }}</h2>

            <v-row>
              <v-col
                v-for="product in getProductsByCategory(category)"
                :key="product._id"
                cols="12"
                md="6"
              >
                <v-card class="product-card" elevation="1" @click="openProductDialog(product)">
                  <div class="d-flex pa-4">
                    <div class="grow pr-4">
                      <h3 class="text-h6 font-weight-bold mb-2">{{ product.name }}</h3>
                      <p class="text-body-2 text-grey-darken-1 mb-2">{{ product.description }}</p>
                      <div class="d-flex align-center">
                        <span class="text-h6 font-weight-bold">{{ product.price.toFixed(2) }}€</span>
                        <v-chip
                          v-if="product.discount > 0"
                          class="ml-2"
                          color="red"
                          size="small"
                        >
                          -{{ product.discount }}%
                        </v-chip>
                      </div>
                    </div>
                    <div class="product-image-container">
                      <v-img
                        class="rounded-lg"
                        cover
                        height="120"
                        :src="product.image"
                        width="120"
                      />
                      <v-btn
                        class="add-btn"
                        color="white"
                        icon
                        size="small"
                        @click.stop="addToCart(product)"
                      >
                        <v-icon color="black">mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- No results -->
          <div v-if="filteredProducts.length === 0" class="text-center py-8">
            <v-icon color="grey-lighten-1" size="64">mdi-magnify</v-icon>
            <p class="text-h6 mt-4 text-grey-darken-1">Aucun produit trouvé</p>
          </div>
        </v-container>
      </div>

      <!-- Error state -->
      <div v-else class="text-center py-8">
        <v-icon color="grey-lighten-1" size="64">mdi-alert-circle</v-icon>
        <p class="text-h6 mt-4 text-grey-darken-1">Restaurant non trouvé</p>
        <v-btn class="mt-4" color="black" @click="$router.push('/')">Retour à l'accueil</v-btn>
      </div>
    </v-main>

    <!-- Product Detail Dialog -->
    <v-dialog v-model="productDialog" max-width="600">
      <v-card v-if="selectedProduct">
        <v-img cover height="300" :src="selectedProduct.image" />

        <v-card-title class="pt-4">
          <h2 class="text-h5 font-weight-bold">{{ selectedProduct.name }}</h2>
        </v-card-title>

        <v-card-text>
          <p class="text-body-1 mb-4">{{ selectedProduct.description }}</p>
          <div class="text-h5 font-weight-bold">{{ selectedProduct.price.toFixed(2) }}€</div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="productDialog = false">Annuler</v-btn>
          <v-btn color="black" @click="addToCartFromDialog">
            Ajouter au panier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cart Modal (same as home page) -->
    <v-dialog v-model="cartDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h5 font-weight-bold">Votre panier</span>
          <v-btn icon variant="text" @click="cartDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4" style="max-height: 400px; overflow-y: auto;">
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <v-icon color="grey-lighten-1" size="64">mdi-cart-outline</v-icon>
            <p class="text-h6 mt-4 text-grey-darken-1">Votre panier est vide</p>
            <p class="text-body-2 text-grey">Ajoutez des articles pour commencer</p>
          </div>

          <div v-else>
            <v-list>
              <v-list-item v-for="(item, index) in cartItems" :key="index" class="px-0 mb-3">
                <template #prepend>
                  <v-avatar rounded size="60">
                    <v-img cover :src="item.image" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-grey-darken-1">{{ restaurant.name }}</v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center">
                    <v-btn icon size="small" variant="outlined" @click="decreaseQuantity(index)">
                      <v-icon size="small">mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-3 font-weight-bold">{{ item.quantity }}</span>
                    <v-btn icon size="small" variant="outlined" @click="increaseQuantity(index)">
                      <v-icon size="small">mdi-plus</v-icon>
                    </v-btn>
                    <span class="ml-4 font-weight-bold">{{ (item.price * item.quantity).toFixed(2) }}€</span>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between mb-2">
              <span>Sous-total</span>
              <span class="font-weight-bold">{{ subtotal.toFixed(2) }}€</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Frais de livraison</span>
              <span class="font-weight-bold">{{ restaurant.deliveryFee.toFixed(2) }}€</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between">
              <span class="text-h6 font-weight-bold">Total</span>
              <span class="text-h6 font-weight-bold">{{ total.toFixed(2) }}€</span>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn
            block
            class="text-none"
            color="black"
            :disabled="cartItems.length === 0"
            size="large"
          >
            Passer la commande
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { productAPI, restaurantAPI } from '../../services/api'

  const route = useRoute()

  const loading = ref(true)
  const restaurant = ref(null)
  const products = ref([])
  const cartItems = ref([])
  const cartDialog = ref(false)
  const productDialog = ref(false)
  const selectedProduct = ref(null)
  const deliveryType = ref('delivery')
  const searchMenu = ref('')
  const selectedCategory = ref('all')
  const isFavorite = ref(false)

  const menuCategories = computed(() => {
    const categories = [...new Set(products.value.map(p => p.category))]
    return categories.filter(c => c && c !== 'Autres')
  })

  const displayedCategories = computed(() => {
    if (selectedCategory.value === 'all') {
      return menuCategories.value
    }
    return [selectedCategory.value]
  })

  const filteredProducts = computed(() => {
    if (!searchMenu.value) return products.value

    const search = searchMenu.value.toLowerCase()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(search)
      || p.description.toLowerCase().includes(search),
    )
  })

  function getProductsByCategory (category) {
    const prods = filteredProducts.value.filter(p => p.category === category)
    return prods
  }

  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const total = computed(() => {
    if (!restaurant.value) return 0
    return subtotal.value + restaurant.value.deliveryFee
  })

  async function loadRestaurant () {
    try {
      loading.value = true
      const restaurantId = route.params.id

      // Load restaurant details
      const restoResponse = await restaurantAPI.getById(restaurantId)
      restaurant.value = restoResponse.data.data

      // Load products for this restaurant
      const productsResponse = await productAPI.getByRestaurant(restaurantId)
      products.value = productsResponse.data.data
    } catch (error) {
      console.error('Error loading restaurant:', error)
    } finally {
      loading.value = false
    }
  }

  function addToCart (product) {
    const existingIndex = cartItems.value.findIndex(item => item._id === product._id)

    if (existingIndex === -1) {
      cartItems.value.push({
        ...product,
        quantity: 1,
      })
    } else {
      cartItems.value[existingIndex].quantity++
    }
  }

  function openProductDialog (product) {
    selectedProduct.value = product
    productDialog.value = true
  }

  function addToCartFromDialog () {
    if (selectedProduct.value) {
      addToCart(selectedProduct.value)
      productDialog.value = false
    }
  }

  function increaseQuantity (index) {
    cartItems.value[index].quantity++
  }

  function decreaseQuantity (index) {
    if (cartItems.value[index].quantity > 1) {
      cartItems.value[index].quantity--
    } else {
      cartItems.value.splice(index, 1)
    }
  }

  function toggleFavorite () {
    isFavorite.value = !isFavorite.value
  }

  onMounted(() => {
    loadRestaurant()
  })
</script>

<style scoped>
.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.restaurant-header-overlay {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
}

.search-field :deep(.v-field) {
  border-radius: 24px;
  background-color: #f5f5f5;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image-container {
  position: relative;
  flex-shrink: 0;
}

.add-btn {
  position: absolute;
  bottom: -8px;
  right: -8px;
}

.gap-2 {
  gap: 8px;
}
</style>
