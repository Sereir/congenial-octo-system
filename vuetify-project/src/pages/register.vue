<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" lg="4" md="5" sm="8">
            <v-card class="pa-8" elevation="2">
              <!-- Logo -->
              <div class="text-center mb-6">
                <h1 class="text-h4 font-weight-bold mb-2">Uber Eats</h1>
                <p class="text-body-1 text-grey-darken-1">Créez votre compte</p>
              </div>

              <!-- Error Alert -->
              <v-alert
                v-if="error"
                class="mb-4"
                closable
                type="error"
                variant="tonal"
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>

              <!-- Register Form -->
              <v-form ref="registerForm" @submit.prevent="handleRegister">
                <v-text-field
                  v-model="name"
                  class="mb-3"
                  label="Nom complet"
                  prepend-inner-icon="mdi-account-outline"
                  required
                  :rules="nameRules"
                  variant="outlined"
                />

                <v-text-field
                  v-model="email"
                  class="mb-3"
                  label="Email"
                  prepend-inner-icon="mdi-email-outline"
                  required
                  :rules="emailRules"
                  type="email"
                  variant="outlined"
                />

                <v-text-field
                  v-model="phone"
                  class="mb-3"
                  label="Téléphone (optionnel)"
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                />

                <v-text-field
                  v-model="password"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  class="mb-3"
                  label="Mot de passe"
                  prepend-inner-icon="mdi-lock-outline"
                  required
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="showPassword = !showPassword"
                />

                <v-text-field
                  v-model="confirmPassword"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  class="mb-4"
                  label="Confirmer le mot de passe"
                  prepend-inner-icon="mdi-lock-outline"
                  required
                  :rules="confirmPasswordRules"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                />

                <v-checkbox
                  v-model="acceptTerms"
                  class="mb-2"
                  :rules="[v => !!v || 'Vous devez accepter les conditions']"
                >
                  <template #label>
                    <span class="text-body-2">
                      J'accepte les
                      <a class="text-decoration-none" href="#">conditions d'utilisation</a>
                      et la
                      <a class="text-decoration-none" href="#">politique de confidentialité</a>
                    </span>
                  </template>
                </v-checkbox>

                <v-btn
                  block
                  class="mb-4"
                  color="black"
                  :loading="loading"
                  size="large"
                  type="submit"
                >
                  S'inscrire
                </v-btn>
              </v-form>

              <!-- Divider -->
              <div class="divider-row my-4">
                <v-divider />
                <span class="mx-3 text-body-2 text-grey-darken-1">ou</span>
                <v-divider />
              </div>

              <!-- Social Register -->
              <v-btn
                block
                class="mb-3 text-none"
                size="large"
                variant="outlined"
              >
                <v-icon color="#EA4335" start>mdi-google</v-icon>
                S'inscrire avec Google
              </v-btn>

              <v-btn
                block
                class="mb-4 text-none"
                size="large"
                variant="outlined"
              >
                <v-icon start>mdi-apple</v-icon>
                S'inscrire avec Apple
              </v-btn>

              <!-- Login Link -->
              <div class="text-center">
                <span class="text-body-2 text-grey-darken-1">Vous avez déjà un compte ?</span>
                <v-btn class="text-none" variant="text" @click="$router.push('/login')">
                  Se connecter
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '../composables/useAuth'
  import { authAPI } from '../services/api'

  const router = useRouter()
  const { login } = useAuth()
  const registerForm = ref(null)

  const name = ref('')
  const email = ref('')
  const phone = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const acceptTerms = ref(false)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loading = ref(false)
  const error = ref('')

  const nameRules = [
    v => !!v || 'Nom requis',
    v => v.length >= 2 || 'Au moins 2 caractères',
  ]

  const emailRules = [
    v => !!v || 'Email requis',
    v => /.+@.+\..+/.test(v) || 'Email invalide',
  ]

  const passwordRules = [
    v => !!v || 'Mot de passe requis',
    v => v.length >= 6 || 'Au moins 6 caractères',
  ]

  const confirmPasswordRules = [
    v => !!v || 'Confirmation requise',
    v => v === password.value || 'Les mots de passe ne correspondent pas',
  ]

  async function handleRegister () {
    const { valid } = await registerForm.value.validate()

    if (!valid) return

    try {
      loading.value = true
      error.value = ''

      const response = await authAPI.register(
        name.value,
        email.value,
        password.value,
        phone.value,
      )

      if (response.data.success) {
        // Use composable to manage auth state
        login(response.data.data.user, response.data.data.token)

        // Redirect to home
        router.push('/')
      }
    } catch (error_) {
      error.value = error_.response?.data?.message || 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.divider-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
</style>
