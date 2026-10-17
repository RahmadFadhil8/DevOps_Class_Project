<template>
    <section class="flex items-center justify-center min-h-screen bg-gray-100 pt-24 pb-24">
        <UiCard class="p-8">
            <div class="flex flex-col gap-4 items-center">
                <img src="~/assets/icon/check.svg" alt="" class="h-28 w-28">
                <h2>Booking Berhasil!</h2>
                <p class="w-xl text-center">Pesanan Anda Telah Dikonfirmasi. siapkan raket Anda dan sampai jumpa di lapangan!</p>

                <UiBadge>
                    Booking ID: #PH-20241024-001
                </UiBadge>

                <div class="grid grid-cols-2 gap-4 w-150">
                    <UiCard class="p-6">
                        <div class="flex gap-2 mb-2">
                            <img src="~/assets/icon/tennis.svg" alt="" class="w-6 h-6 ">
                            <p class="text-gray-500">lapangan</p>
                        </div>
                        <p class="font-bold">Padel Arena Jakarta</p>
                    </UiCard>

                    <UiCard class="p-6">
                        <div class="flex gap-2 mb-2">
                            <img src="~/assets/icon/calendar.svg" alt="" class="w-6 h-6 ">
                            <p class="text-gray-500">Waktu dan Tanggal</p>
                        </div>
                        <p class="font-bold">Padel Arena Jakarta</p>
                        <p>10:00 - 11:30 WIB</p>
                    </UiCard>


                    <UiCard class="col-span-2 p-6">
                        <div class="flex justify-between items-center">
                            <div class="flex gap-2 items-center">
                            <img src="~/assets/icon/barcode.svg" alt="user" class="h-6 w-6">
        
                            <div>
                                <p>Digital Payment(QRIS)</p>
                                <p class="text-gray-400">Gopay, Ovo, ShopeePay, Dana, LinkAja</p>
                            </div>
                        </div>
                            <UiBadge>
                                Paid
                            </UiBadge>
                        </div>
                    </UiCard>
                </div>


                <div class="flex justify-center gap-4 mt-4">
                    <UiButton>
                        <NuxtLink to="/profile">
                            Lihat Tiket Saya
                        </NuxtLink>
                    </UiButton>
                    <UiButton>
                        <NuxtLink to="/">
                            Kembali Ke Beranda
                        </NuxtLink>
                    </UiButton>
                </div>
            </div>
        </UiCard>
    </section>
</template>