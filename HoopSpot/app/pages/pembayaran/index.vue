<template>
    <section class="px-36 mb-10">
        <div class="pt-28 grid grid-cols-12 gap-8">
            <div class="col-span-8">

                <div class="mb-4">
                    <h1 class="font-bold text-3xl">Konfirmasi & Pembayaran</h1>
                    <p class="text-gray-400">Selelsaikan Pembayaran Anda Untuk mengamankan slot Lapangan.</p>
                </div>
    
                <UiCard class="p-6 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <img src="~/assets/icon/user.svg" alt="user" class="h-6 w-6">
                        <p class="font-bold text-xl">Informasi Kontak</p>
                    </div>
                    <div class="flex gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1"> Nama Lengkap</label>
                            <UiInput
                            v-model="text"
                            type="text"
                            placeholder="Nama Anda"
                            />
                        </div>
    
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email Konfirmasi</label>
                            <UiInput
                            v-model="email"
                            type="email"
                            placeholder="email Anda"
                            />
                        </div>
                    </div>
                </UiCard>
    
                <div class="flex gap-2 mb-4">
                    <img src="~/assets/icon/wallet.svg" alt="user" class="h-6 w-6">
                    <p>Metode Pembayaran</p>
                </div>

                <UiCard class="p-6">
                    <div class="flex justify-between items-center">
                        <div class="flex gap-2 items-center">
                            <img src="~/assets/icon/barcode.svg" alt="user" class="h-6 w-6">
        
                            <div>
                                <p>Digital Payment(QRIS)</p>
                                <p class="text-gray-400">Gopay, Ovo, ShopeePay, Dana, LinkAja</p>
                            </div>
                        </div>
                        <UiBadge>
                            Paling Cepat
                        </UiBadge>
                    </div>
                </UiCard>
            </div>
            <div class="col-span-4">
                <UiCard>
                    <div>
                        <img src="~/assets/images/4.png" alt="" class="h-48 w-full object-cover">
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="flex items-center gap-2">
                                <img src="~/assets/icon/user.svg" alt="user" class="h-6 w-6">
                                <div>
                                    <p>tanggal</p>
                                    <p class="font-bold">Sen, 24 Okt 2024</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <img src="~/assets/icon/user.svg" alt="user" class="h-6 w-6">
                                <div>
                                    <p>tanggal</p>
                                    <p class="font-bold">Sen, 24 Okt 2024</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <img src="~/assets/icon/user.svg" alt="user" class="h-6 w-6">
                                <div>
                                    <p>tanggal</p>
                                    <p class="font-bold">Sen, 24 Okt 2024</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <img src="~/assets/icon/user.svg" alt="user" class="h-6 w-6">
                                <div>
                                    <p>tanggal</p>
                                    <p class="font-bold">Sen, 24 Okt 2024</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="border border-gray-400 mb-6"></div>
    
                        <div class="flex justify-between items-center mb-2">
                            <p>Sewa Lapangan (90m)</p>
                            <p>Rp 450.000</p>
                        </div>
    
                        <div class="flex justify-between items-center mb-6">
                            <p>Biaya Layanan</p>
                            <p>Rp 5.000</p>
                        </div>
    
                        <div class="border border-gray-400"></div>
    
                        <div class="flex justify-between items-center mb-6">
                            <p class="font-bold text-xl">Total Bayar</p>
                            <p class="font-bold text-xl">Rp 455.000</p>
                        </div>

                        <UiButton full>
                                <NuxtLink to="/konfirmasi">
                                Bayar sekarang
                            </NuxtLink>
                        </UiButton>
                    </div>
                </UiCard>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
const text = ref('')
const email = ref('')
</script>