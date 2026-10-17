<template>
    <footer class="bg-primary px-36 py-10">
        <div class="flex justify-between">
            <div class="text-white">
                <img src="~/assets/images/logo3.png" alt="padelLogo" class="h-36 w-auto mb-6">
                <p class="w-96">Platform booking lapangan Basket yang membantu Anda menemukan, memesan, dan bermain di lapangan terbaik dengan lebih cepat dan mudah.</p>
                <div>
                    
                </div>
            </div>
            <div class="text-white">
                <ul class="flex flex-col gap-6">
                    <li><NuxtLink to="/" class="hover:text-hover-primary">Beranda</NuxtLink></li>
                    <li><NuxtLink to="/" class="hover:text-hover-primary">lapangan</NuxtLink></li>
                    <li><NuxtLink to="/" class="hover:text-hover-primary">Lokasi</NuxtLink></li>
                    <li><NuxtLink to="/" class="hover:text-hover-primary">FAQ</NuxtLink></li>
                    <li><NuxtLink to="/" class="hover:text-hover-primary">Tentang Kami</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-4 text-white text-left">
                <p>Hubungi Kami</p>
                <div class="">
                    <p>Kontak</p>
                    <div class="flex gap-3 mt-2">
                        <img src="~/assets/icon/phone.svg" alt="" class="h-6 w-6">
                        <p class="font-bold">{{ PHONE_NUMBER }}</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <img src="~/assets/icon/email.svg" alt="" class="h-6 w-6">
                    <p class="font-bold">{{ EMAIL }}</p>
                </div>
            </div>
        </div>
        <div>
            <div class="flex justify-center text-center pt-5 border-t border-white/20 text-xs lg:text-sm mt-8 lg:mt-10">
                <p class="text-white">Copyright HoopSpot 2026 All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import {PHONE_NUMBER, EMAIL} from "~/constants";
</script>