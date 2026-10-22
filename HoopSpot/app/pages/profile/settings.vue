
<template>
  <main class="min-h-screen bg-slate-50/70 pb-16 pt-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 text-sm text-slate-500">
        <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/profile" class="hover:text-primary">Profile</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-slate-800">Pengaturan</span>
      </div>

      <div class="mb-8">
        <p class="text-sm font-semibold text-primary">PREFERENSI AKUN</p>
        <h1 class="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Pengaturan Akun
        </h1>
        <p class="mt-3 text-sm text-slate-500 sm:text-base">
          Perbarui informasi pribadi dan kelola keamanan akunmu.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CardsProfileSidebar />

        <div class="min-w-0 space-y-6">
          <!-- Profile form -->
          <form
            class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
            @submit.prevent="saveProfile"
          >
            <div class="border-b border-slate-100 pb-5">
              <h2 class="text-lg font-bold text-slate-900">
                Informasi Pribadi
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                Pastikan informasi akunmu selalu terbaru.
              </p>
            </div>

            <div class="mt-6 flex items-center gap-4">
              <div
                class="flex h-16 w-16 shrink-0 items-center justify-center
                rounded-full bg-primary/10 text-xl font-bold text-primary"
              >
                {{ initials }}
              </div>

              <div>
                <p class="font-semibold text-slate-800">
                  {{ form.nama }}
                </p>
                <p class="mt-1 text-sm text-slate-500">
                  Member HoopSpot
                </p>
                <p class="mt-1 text-xs text-slate-400">
                  Foto profil belum dapat diubah.
                </p>
              </div>
            </div>

            <div class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label for="nama" class="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Lengkap
                </label>
                <input
                  id="nama"
                  v-model.trim="form.nama"
                  type="text"
                  required
                  autocomplete="name"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none transition focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label for="email" class="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none transition focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label for="telepon" class="mb-2 block text-sm font-semibold text-slate-700">
                  Nomor Telepon
                </label>
                <input
                  id="telepon"
                  v-model.trim="form.telepon"
                  type="tel"
                  autocomplete="tel"
                  placeholder="Contoh: 081234567890"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none transition focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label for="lokasi" class="mb-2 block text-sm font-semibold text-slate-700">
                  Kota / Lokasi
                </label>
                <input
                  id="lokasi"
                  v-model.trim="form.lokasi"
                  type="text"
                  autocomplete="address-level2"
                  placeholder="Contoh: Medan"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none transition focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <p
              v-if="profileMessage"
              role="status"
              class="mt-5 rounded-xl bg-emerald-50 px-4 py-3
              text-sm text-emerald-700"
            >
              {{ profileMessage }}
            </p>

            <div class="mt-7 flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                class="rounded-xl bg-primary px-5 py-3 text-sm font-bold
                text-white transition hover:opacity-90"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>

          <!-- Security form -->
          <form
            class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
            @submit.prevent="changePassword"
          >
            <div class="border-b border-slate-100 pb-5">
              <h2 class="text-lg font-bold text-slate-900">
                Keamanan Akun
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                Kelola kata sandi untuk menjaga keamanan akun.
              </p>
            </div>

            <div class="mt-6 space-y-5">
              <div>
                <label for="old-password" class="mb-2 block text-sm font-semibold text-slate-700">
                  Kata Sandi Saat Ini
                </label>
                <input
                  id="old-password"
                  v-model="password.old"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label for="new-password" class="mb-2 block text-sm font-semibold text-slate-700">
                  Kata Sandi Baru
                </label>
                <input
                  id="new-password"
                  v-model="password.new"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
                <p class="mt-2 text-xs text-slate-400">
                  Gunakan minimal 8 karakter.
                </p>
              </div>

              <div>
                <label for="confirm-password" class="mb-2 block text-sm font-semibold text-slate-700">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  id="confirm-password"
                  v-model="password.confirm"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  class="w-full rounded-xl border border-slate-200 px-4 py-3
                  text-sm outline-none focus:border-primary
                  focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <p
              v-if="passwordMessage"
              role="status"
              class="mt-5 rounded-xl px-4 py-3 text-sm"
              :class="
                passwordError
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-emerald-700'
              "
            >
              {{ passwordMessage }}
            </p>

            <div class="mt-7 flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                class="rounded-xl bg-primary px-5 py-3 text-sm font-bold
                text-white transition hover:opacity-90"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useProfile } from '~/composables/useProfile'
import { pesanError } from '~/utils/pesanError'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const { user, refresh } = await useProfile()

const form = reactive({
  nama: user.value.nama,
  email: user.value.email,
  telepon: user.value.telepon,
  lokasi: user.value.lokasi,
})

const password = reactive({
  old: '',
  new: '',
  confirm: '',
})

const profileMessage = ref('')
const passwordMessage = ref('')
const passwordError = ref(false)

const initials = computed(() =>
  form.nama
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

const saveProfile = async () => {
  try {
    await api('/api/profile', {
      method: 'PUT',
      body: {
        nama: form.nama,
        email: form.email,
        telepon: form.telepon,
        lokasi: form.lokasi,
      },
    })
    await refresh() // muat ulang data profil supaya sidebar ikut berubah
    profileMessage.value = 'Informasi berhasil diperbarui.'
  } catch (error) {
    profileMessage.value = pesanError(error, 'Gagal menyimpan perubahan.')
  }
}

const changePassword = async () => {
  passwordMessage.value = ''
  passwordError.value = false

  if (password.new !== password.confirm) {
    passwordError.value = true
    passwordMessage.value =
      'Konfirmasi kata sandi baru tidak cocok.'
    return
  }

  try {
    await api('/api/profile/password', {
      method: 'PUT',
      body: {
        passwordLama: password.old,
        passwordBaru: password.new,
      },
    })
    passwordMessage.value = 'Kata sandi berhasil diperbarui.'
    password.old = ''
    password.new = ''
    password.confirm = ''
  } catch (error) {
    passwordError.value = true
    passwordMessage.value = pesanError(error, 'Gagal memperbarui kata sandi.')
  }
}
</script>
