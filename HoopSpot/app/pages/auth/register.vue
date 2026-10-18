<template>
  <section class="flex items-center justify-center min-h-screen bg-gray-100 pt-24 pb-24">
    <div class="flex shadow-xl rounded-2xl overflow-hidden w-215 max-w-full bg-white">
        <!-- <div class="relative w-95 shrink-0 hidden md:block">
          <img src="~/assets/images/imgRegister.jpg" alt="Padel Player" class="w-full h-full object-cover rounded-l-lg">

          <div class="absolute bottom-7/12 left-0 right-0 p-6 bg-linear-to-t from-black/70 to-transparent">
            <UiBadge>JOIN THE ELITE</UiBadge>
            <h2 class="text-white text-4xl font-bold mb-4">
              Mulai Perjalanan Padel Anda.
            </h2>
            <p class="text-white/80 text-sm mt-1">
              Dapatkan Akses Eksklusif ke lapangan premium, komunitas atletik yang berkembang, dan sistem booking temudah di Indonesia.
            </p>
          </div>
        </div> -->

        <!-- kanan:form -->
        <div class="flex flex-col justify-center px-10 py-12 flex-1">
            <div class="mb-4">
              <h1 class="text-2xl font-bold">Buat Akun Baru</h1>
              <p class="text">Lengkapi data diri Anda untuk bergabung bersama kami.</p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <UiInput
              v-model="form.nama"
              type="text"
              placeholder="Masukkan Nama Lengkap"
              :icon="namaIcon"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <UiInput
              v-model="form.email"
              type="email"
              placeholder="nama@email.com"
              :icon="emailIcon"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <UiInput
              v-model="form.tel"
              type="tel"
              placeholder="0812xxxx"
              :icon="telIcon"
              />
            </div>

            <!-- password -->
            <div class="mb-6">
              <label class="text-sm font-medium text-gray-700">Kata Sandi</label>
              <UiInput
              v-model="form.password"
              type="password"
              placeholder="Min. 8 Karakter"
              :icon="passIcon"
              />
            </div>

            <div class="flex gap-2 mb-6">
              <input
                id="terms"
                v-model="termsAccepted"
                type="checkbox"
                name="terms"
                class="mt-1"
              >

              <label for="terms" class="text-sm">
                Saya menyetujui
                <span class="text-secondary font-semibold">
                  Syarat dan Ketentuan
                </span>
                serta
                <span class="text-secondary font-semibold">
                  Kebijakan Privasi
                </span>
                Padel.
              </label>
            </div>

            <!-- tombol masuk -->
            <UiButton
              full
              class="mb-4 cursor-pointer"
              :disabled="isLoading"
              @click="handleRegister"
            >
              {{ isLoading ? 'Memproses...' : 'Daftar Sekarang' }}
            </UiButton>

            <!-- devider -->
            <div class="flex items-center gap-3 mb-4">
              <div class="flex-1 h-px bg-gray-200"></div>
              <span class="text-sm text-gray-400">atau daftar dengan</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <!-- tombol google -->
            <UiButton variant="outline" full class="mb-6">
              <img src="~/assets/icon/google.svg" alt="" srcset="" class="h-5 w-5">Daftar dengan Google
            </UiButton>

            <!-- daftar -->
            <p class="text-sm text-center text-gray-600">
              Sudah Punya Akun? 
              <NuxtLink to="/auth/login" class="text-secondary font-semibold hover:underline">Login Disini</NuxtLink>
            </p>
        </div>
    </div>
  </section>
</template>


<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

import { reactive, ref } from 'vue'
import emailIcon from '~/assets/icon/email-hitam.svg'
import passIcon from '~/assets/icon/eye.svg'
import namaIcon from '~/assets/icon/user.svg'
import telIcon from '~/assets/icon/phoneHitam.svg'
import type { RegisterDto } from '~/types/auth'

const { register } = useAuth()

const form = reactive<RegisterDto>({
  nama: '',
  email: '',
  tel: '',
  password: '',
})

const termsAccepted = ref(false)
const isLoading = ref(false)

const handleRegister = async () => {
  if (isLoading.value) return

  if (!termsAccepted.value) {
    alert('Silakan setujui syarat dan ketentuan terlebih dahulu.')
    return
  }

  isLoading.value = true

  try {
    await register(form)

    alert('Registrasi berhasil! Silakan login.')
    await navigateTo('/auth/login')
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal mendaftar, silakan coba lagi.'

    alert(message)
  } finally {
    isLoading.value = false
  }
}
</script>
