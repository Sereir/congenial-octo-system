<template>
  <v-app>
    <!-- Header -->
    <v-app-bar class="px-4" color="white" elevation="1" height="72">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="text-h6 font-weight-bold ml-2">Uber Eats</v-toolbar-title>

      <v-spacer />

      <!-- Buttons in header -->
      <v-btn class="text-none mr-2" variant="text">
        <v-icon start>mdi-truck-delivery</v-icon>
        Livraison
      </v-btn>
      <v-btn class="text-none mr-2" variant="text">
        <v-icon start>mdi-bag-checked</v-icon>
        À emporter
      </v-btn>

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

      <!-- Auth buttons / User menu -->
      <template v-if="isAuthenticated">
        <v-menu>
          <template #activator="{ props }">
            <v-btn class="text-none" variant="text" v-bind="props">
              <v-icon start>mdi-account-circle</v-icon>
              {{ user?.name }}
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$router.push('/profile')">
              <v-list-item-title>
                <v-icon size="small" start>mdi-account</v-icon>
                Mon profil
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push('/orders')">
              <v-list-item-title>
                <v-icon size="small" start>mdi-receipt</v-icon>
                Mes commandes
              </v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="handleLogout">
              <v-list-item-title>
                <v-icon size="small" start>mdi-logout</v-icon>
                Déconnexion
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn class="text-none" variant="text" @click="$router.push('/login')">Connexion</v-btn>
        <v-btn class="text-none ml-2" color="black" @click="$router.push('/register')">Inscription</v-btn>
      </template>
    </v-app-bar>

    <!-- Cart Modal -->
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
                <v-list-item-subtitle class="text-grey-darken-1">{{ item.restaurant }}</v-list-item-subtitle>

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
              <span class="font-weight-bold">{{ deliveryFee.toFixed(2) }}€</span>
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

    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" temporary width="280">
      <v-list density="compact" nav>
        <v-list-item active prepend-icon="mdi-home" title="Domicile" />
        <v-list-item prepend-icon="mdi-receipt-text" title="Courses" />
        <v-list-item prepend-icon="mdi-store" title="Épicerie" />
        <v-list-item prepend-icon="mdi-glass-cocktail" title="Alcool" />
        <v-list-item prepend-icon="mdi-spa" title="Santé" />
        <v-list-item prepend-icon="mdi-shopping" title="Boutique" />
        <v-list-item prepend-icon="mdi-paw" title="Animal de compagnie" />
        <v-list-item prepend-icon="mdi-flower" title="Fleurs" />
        <v-list-item prepend-icon="mdi-baby-face" title="Bébé" />
        <v-list-item prepend-icon="mdi-heart-pulse" title="Hygiène" />
        <v-divider class="my-2" />
        <v-list-item prepend-icon="mdi-tag" title="Offres" />
        <v-list-item prepend-icon="mdi-account-plus" title="Inscription" />
        <v-list-item prepend-icon="mdi-account" title="Connexion" />
      </v-list>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="px-6 py-4" fluid>
        <!-- Loading state -->
        <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
          <v-progress-circular color="primary" indeterminate size="64" />
        </div>

        <div v-else>
          <!-- Categories horizontal scroll -->
          <div class="categories-scroll mb-6">
            <v-chip-group class="d-flex">
              <v-chip v-for="cat in categories" :key="cat.name" class="category-chip mx-1" size="large">
                <span class="category-emoji mr-2">{{ cat.emoji }}</span>
                <span class="category-name">{{ cat.name }}</span>
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Filter bar -->
          <div class="d-flex align-center mb-6 gap-2">
            <v-btn class="text-none" prepend-icon="mdi-tag" variant="outlined">Offres</v-btn>
            <v-btn class="text-none" variant="outlined">
              Frais de livraison
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
            <v-btn class="text-none" prepend-icon="mdi-star" variant="outlined">Les mieux notés</v-btn>
            <v-btn class="text-none" variant="outlined">
              Trier
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </div>

          <!-- Promotional offers -->
          <div class="mb-8">
            <v-row>
              <v-col v-for="promo in promos" :key="promo.title" cols="12" md="4">
                <v-card class="promo-card" :color="promo.color" rounded="lg">
                  <v-card-text class="pa-6">
                    <div class="d-flex">
                      <div class="grow">
                        <h3 class="text-h6 font-weight-bold mb-2">{{ promo.title }}</h3>
                        <p class="text-body-2 mb-4">{{ promo.subtitle }}</p>
                        <v-btn class="text-none" color="white" rounded variant="elevated">
                          J'en profite {{ promo.icon }}
                        </v-btn>
                      </div>
                      <div class="promo-image ml-4">
                        <v-img
                          class="rounded-lg"
                          cover
                          height="140"
                          :src="promo.image"
                          width="140"
                        />
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Section: Sur le pouce -->
          <div class="mb-4">
            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <h2 class="text-h5 font-weight-bold">Sur le pouce</h2>
                <p class="text-body-2 text-grey-darken-1">Les livraisons les plus rapides</p>
              </div>
              <v-btn class="text-none" variant="text">
                Tout afficher
                <v-icon end>mdi-chevron-right</v-icon>
              </v-btn>
            </div>

            <!-- Restaurant cards -->
            <v-row>
              <v-col
                v-for="resto in restaurants"
                :key="resto.name"
                cols="12"
                md="3"
                sm="6"
              >
                <v-card class="restaurant-card" elevation="1" rounded="lg" @click="openRestaurant(resto)">
                  <div class="restaurant-image">
                    <v-img cover height="180" :src="resto.image">
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular color="grey-lighten-3" indeterminate />
                        </div>
                      </template>
                    </v-img>
                    <v-chip v-if="resto.badge" class="badge-chip" :color="resto.badgeColor" size="small">
                      {{ resto.badge }}
                    </v-chip>
                  </div>
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <h3 class="text-h6 font-weight-bold">{{ resto.name }}</h3>
                      <v-btn icon size="small" variant="text" @click.stop="toggleFavorite(resto)">
                        <v-icon>{{ resto.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                      </v-btn>
                    </div>
                    <div class="d-flex align-center text-body-2 text-grey-darken-1">
                      <v-icon class="mr-1" size="small">mdi-star</v-icon>
                      <span class="font-weight-bold mr-1">{{ resto.rating }}</span>
                      <span>({{ resto.reviews }}) · {{ resto.time }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '../composables/useAuth'
  import { restaurantAPI } from '../services/api'

  const router = useRouter()
  const { user, isAuthenticated, initAuth, logout } = useAuth()

  const drawer = ref(false)
  const cartDialog = ref(false)
  const loading = ref(true)

  const cartItems = ref([])
  const deliveryFee = ref(2.5)

  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const total = computed(() => {
    return subtotal.value + deliveryFee.value
  })

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

  function openRestaurant (resto) {
    router.push(`/restaurant/${resto._id}`)
  }

  function toggleFavorite (resto) {
    resto.isFavorite = !resto.isFavorite
  }

  async function loadRestaurants () {
    try {
      loading.value = true
      const response = await restaurantAPI.getAll()
      restaurants.value = response.data.data.map(r => ({
        ...r,
        isFavorite: false,
        reviews: r.reviews || '0',
        time: r.deliveryTime || '30 min',
      }))
    } catch (error) {
      console.error('Error loading restaurants:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadRestaurants()
  })

  const categories = [
    { name: 'Courses', emoji: '🍌' },
    { name: 'Sushis', emoji: '🍣' },
    { name: 'Halal', emoji: '🥙' },
    { name: 'Pizzas', emoji: '🍕' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Fast food', emoji: '🍟' },
    { name: 'Thé aux perles', emoji: '🧋' },
    { name: 'Asiatique', emoji: '🍜' },
    { name: 'Poke (poisson cru)', emoji: '🥗' },
    { name: 'Cuisine saine', emoji: '🥙' },
    { name: 'Indienne', emoji: '🍛' },
    { name: 'Thaïlandaise', emoji: '🍲' },
    { name: 'Coréenne', emoji: '🍳' },
    { name: 'Sandwichs', emoji: '🥖' },
  ]

  const promos = [
    {
      title: '1 pizza achetée = 1 pizza offerte',
      subtitle: 'Pizza Hut vous régale !',
      icon: '🍕',
      color: '#FFB3BA',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    },
    {
      title: '1 acheté = 1 offert sur vos classiques chez Mcdonald\'s',
      subtitle: 'À dévorer',
      icon: '→',
      color: '#FFE4B5',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    },
    {
      title: 'Un acheté = un offert chez Fufu ramen 🍜',
      subtitle: 'et 10€ offerts avec le code FUFULYON',
      icon: '🥢',
      color: '#E8D5B7',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    },
  ]

  const restaurants = ref([])

  // Initialize auth on mount
  onMounted(async () => {
    initAuth()
    await loadRestaurants()
  })

  function handleLogout () {
    logout()
    router.push('/login')
  }
</script>

<style scoped>
.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.search-field :deep(.v-field) {
  border-radius: 24px;
  background-color: #f5f5f5;
}

.categories-scroll {
  overflow-x: auto;
  white-space: nowrap;
}

.categories-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  background-color: white !important;
  border: 1px solid #e0e0e0;
  font-weight: 500;
  font-size: 14px;
}

.category-emoji {
  font-size: 20px;
}

.category-name {
  color: #000000;
}

.promo-card {
  height: 100%;
  min-height: 200px;
}

.promo-image {
  flex-shrink: 0;
}

.image-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 8px;
}

.restaurant-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-4px);
}

.restaurant-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.restaurant-image .image-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 12px 12px 0 0;
}

.badge-chip {
  position: absolute;
  top: 12px;
  left: 12px;
  font-weight: 600;
  font-size: 11px;
}

.gap-2 {
  gap: 8px;
}
</style>
