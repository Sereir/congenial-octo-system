<template>
  <v-app>
    <v-container class="pa-0" fluid style="background-color: #f6f6f6; min-height: 100vh;">
      <!-- Barre noire avec logo Uber Eats -->
      <v-app-bar color="black" elevation="0" height="56">
        <v-container>
          <img
            alt="Uber Eats"
            src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/ee037aca86fd084a.svg"
            style="height: 24px; cursor: pointer;"
            @click="$router.push('/')"
          >
        </v-container>
      </v-app-bar>

      <!-- Contenu principal -->
      <v-main>
        <v-container class="d-flex justify-center align-center" style="min-height: calc(100vh - 56px); padding: 40px 20px;">
          <div style="max-width: 450px; width: 100%;">
            <h1 class="text-h5 font-weight-bold mb-2" style="color: #000; font-size: 28px !important;">
              Indiquez votre numéro de téléphone ou votre adresse e-mail
            </h1>

            <v-form ref="loginForm" class="mt-6" @submit.prevent="handleContinue">
              <!-- Champ email/téléphone -->
              <v-text-field
                v-model="emailOrPhone"
                bg-color="white"
                class="mb-4"
                density="comfortable"
                hide-details="auto"
                placeholder="Saisissez un numéro de téléphone ou une adresse e-mail"
                required
                :rules="emailOrPhoneRules"
                style="border-radius: 4px;"
                variant="outlined"
              />

              <!-- Champ mot de passe (affiché si email saisi) -->
              <v-text-field
                v-if="showPasswordField"
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                bg-color="white"
                class="mb-4"
                density="comfortable"
                hide-details="auto"
                placeholder="Mot de passe"
                required
                :rules="passwordRules"
                style="border-radius: 4px;"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
              />

              <!-- Alert erreur -->
              <v-alert
                v-if="error"
                class="mb-4"
                closable
                density="compact"
                type="error"
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>

              <!-- Bouton Continuer / Connexion -->
              <v-btn
                block
                class="mb-4 text-none"
                color="black"
                elevation="0"
                :loading="loading"
                size="x-large"
                style="border-radius: 500px; font-weight: 600; text-transform: none; letter-spacing: 0;"
                type="submit"
              >
                {{ showPasswordField ? 'Connexion' : 'Continuer' }}
              </v-btn>

              <div v-if="showPasswordField" class="text-center mb-4">
                <v-btn class="text-none" style="color: #000; text-decoration: underline;" variant="text">
                  Mot de passe oublié ?
                </v-btn>
              </div>

              <!-- Divider -->
              <div class="text-center my-4">
                <v-divider>
                  <span class="px-3 text-grey" style="font-size: 14px; font-weight: 500;">ou</span>
                </v-divider>
              </div>

              <!-- Bouton Google -->
              <v-btn
                block
                class="mb-3 text-none"
                elevation="0"
                size="x-large"
                style="border-radius: 500px; font-weight: 500; border: 1.5px solid #e0e0e0; color: #000; text-transform: none; letter-spacing: 0;"
                variant="outlined"
              >
                <img
                  alt="Google"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  style="width: 18px; height: 18px; margin-right: 12px;"
                >
                Continuer avec Google
              </v-btn>

              <!-- Bouton Apple -->
              <v-btn
                block
                class="mb-4 text-none"
                elevation="0"
                size="x-large"
                style="border-radius: 500px; font-weight: 500; border: 1.5px solid #e0e0e0; color: #000; text-transform: none; letter-spacing: 0;"
                variant="outlined"
              >
                <v-icon size="22" start>mdi-apple</v-icon>
                Continuer avec Apple
              </v-btn>

              <!-- Divider -->
              <div class="text-center my-4">
                <v-divider>
                  <span class="px-3 text-grey" style="font-size: 14px; font-weight: 500;">ou</span>
                </v-divider>
              </div>

              <!-- Bouton QR Code -->
              <v-btn
                block
                class="mb-6 text-none"
                elevation="0"
                size="x-large"
                style="border-radius: 500px; font-weight: 500; border: 1.5px solid #e0e0e0; color: #000; text-transform: none; letter-spacing: 0;"
                variant="outlined"
              >
                <v-icon size="20" start>mdi-qrcode-scan</v-icon>
                Connectez-vous avec le QR code
              </v-btn>

              <!-- Texte légal -->
              <p class="text-caption text-grey-darken-1" style="line-height: 1.5; font-size: 12px;">
                En continuant, vous acceptez de recevoir des appels, y compris par numérotation automatique, des communications sur WhatsApp ou des SMS d'Uber et de ses sociétés affiliées.
              </p>
            </v-form>
          </div>
        </v-container>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '../composables/useAuth'
  import { authAPI } from '../services/api'

  const router = useRouter()
  const { login } = useAuth()
  const loginForm = ref(null)

  const emailOrPhone = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const showPasswordField = ref(false)
  const loading = ref(false)
  const error = ref('')

  const emailOrPhoneRules = [
    v => !!v || 'Ce champ est requis',
    v => {
      // Accepte email ou numéro de téléphone
      const emailRegex = /.+@.+\..+/
      const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/
      return emailRegex.test(v) || phoneRegex.test(v) || 'Entrez un email ou un numéro de téléphone valide'
    },
  ]

  const passwordRules = [
    v => !!v || 'Le mot de passe est requis',
    v => v.length >= 6 || 'Au moins 6 caractères',
  ]

  // Afficher le champ mot de passe quand un email valide est saisi
  watch(emailOrPhone, value => {
    const emailRegex = /.+@.+\..+/
    showPasswordField.value = emailRegex.test(value)
  })

  async function handleContinue () {
    const { valid } = await loginForm.value.validate()
    if (!valid) return

    // Si le champ mot de passe n'est pas affiché, c'est juste la validation de l'email
    if (!showPasswordField.value) {
      error.value = 'Authentification par téléphone non encore implémentée. Utilisez un email.'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const response = await authAPI.login(emailOrPhone.value, password.value)

      console.log('Login response:', response.data)

      if (response.data.success && response.data.data) {
        // Use composable to manage auth state
        login(response.data.data.user, response.data.data.token)
        router.push('/')
      } else {
        error.value = 'Erreur de connexion. Vérifiez vos identifiants.'
      }
    } catch (error_) {
      console.error('Login error:', error_)
      error.value = error_.response?.data?.message || 'Email ou mot de passe incorrect'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.v-field--variant-outlined .v-field__outline {
  border-radius: 4px;
}

.v-btn {
  font-family: 'Roboto', sans-serif !important;
}
</style>
