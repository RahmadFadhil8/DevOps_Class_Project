<template>
    <section class="px-36 pt-20 mb-20">
        <div class="my-4">
            <h1 class="text-5xl font-bold">{{ Data?.judul }}</h1>
            <div class="flex gap-4 items-center">
                <div class="flex gap-2 items-center">
                    <img src="~/assets/icon/star.svg" alt="" class="h-4 w-4">
                    <p class="text-lg font-semibold">{{ Data?.rating }}</p>
                </div>
                <div class="flex gap-2 items-center">
                    <img src="~/assets/icon/location.svg" alt="" class="h-4 w-4">
                    <p class="text-lg font-semibold">{{ Data?.alamat }}</p>
                </div>
            </div>
        </div>

        <div class="flex gap-4 items-start">
            <div class="flex-1">
                <img :src="Data?.gambar" :alt="Data?.judul" class="rounded-2xl mb-4">
                <div>
                    <h2 class="text-2xl font-bold">Deskripsi Lapangan</h2>
                    <p class="text-lg mt-2 mb-4">{{ Data?.deskripsi }}</p>
                </div>
        
                <div class="grid grid-cols-4 gap-2">
                    <UiCard
                    v-for="item in Data?.fasilitas" :key="item" class="text-center p-10">
                        {{ item }}
                    </UiCard>
                </div>
            </div>

            <div class="shrink-0 w-105">
                <UiCard class="p-6">
                    <div class="flex justify-between mb-4">
                        <h6>Booking Lapangan</h6>
                        <UiBadge>
                            Tersedia
                        </UiBadge>
                    </div> 

                    <div>
                        <p class="mb-2 font-semibold">Pilih Tanggal</p>
                        <div class="flex gap-4 mb-2">
                            <UiRadioButton
                            v-for="value in durations"
                            :key="value.value"
                            v-model="durasi"
                            nama="durasi"
                            :value="value.value"
                            :label="value.label"
                            />
                        </div>
                    </div>

                    <div>
                        <p class="mb-2 font-semibold">Durasi Mail</p>
                        <div class="grid grid-cols-3 gap-4 mb-2">
                            <UiRadioButton
                            v-for="value in durations"
                            :key="value.value"
                            v-model="durasi"
                            nama="durasi"
                            :value="value.value"
                            :label="value.label"
                            />
                        </div>
                    </div>

                    <div>
                        <p class="mb-2 font-semibold">Pilih Slot Waktu</p>
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <UiRadioButton
                            v-for="value in timeSlots"
                            :key="value.value"
                            v-model="durasi"
                            nama="durasi"
                            :value="value.value"
                            :label="value.label"
                            />
                        </div>
                    </div>
                    <div class="border border-gray-500 mb-6"></div>

                    <div class="flex justify-between">
                        <p class="mb-2 font-semibold">Sewa Lapangan</p>
                        <p>Harga</p>
                    </div>

                    <div class="flex justify-between">
                        <p class="mb-2 font-semibold">Biaya Layanan</p>
                        <p>Rp 5.000</p>
                    </div>

                    <div class="flex justify-between">
                        <p class="mb-4 font-semibold">Total</p>
                        <p>Rp 250.000</p>
                    </div>

                    <UiButton full>
                            <NuxtLink to="/pembayaran">
                            Lanjut ke Pembayaran
                        </NuxtLink>
                    </UiButton>
                </UiCard>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import {DataLapangan} from '~/data/lapangan';
import { durations, timeSlots } from '~/data/booking';

const durasi = ref(90)
const selectedDate = ref('')
const LapanganId = Number(useRoute().params.id);

const Data = DataLapangan.find(
    item => item.id === LapanganId
)

</script>