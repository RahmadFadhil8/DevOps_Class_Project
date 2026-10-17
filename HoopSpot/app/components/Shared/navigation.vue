<template>
    <nav class="fixed flex justify-between items-center px-6 py-2 mt-2 left-1/2 -translate-x-1/2 w-5xl rounded-xl bg-neutral border-gray-300 border shadow-lg z-50">
        <div>
            <img src="~/assets/images/logo3.png" alt="logo Padel Booking" class="w-auto h-12">
        </div>
        <ul class="flex gap-6">
            <li><NuxtLink to="/" class="hover:text-hover-primary">Beranda</NuxtLink></li>
            <li><NuxtLink to="/lapangan" class="hover:text-hover-primary">lapangan</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-hover-primary">Lokasi</NuxtLink></li>
            <li><NuxtLink to="/#faq" class="hover:text-hover-primary">FAQ</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-hover-primary">Tentang Kami</NuxtLink></li>
        </ul>
        <div>
            <UiButton>
                <NuxtLink to="/auth/login">Login</NuxtLink>
            </UiButton>
        </div>
    </nav>
</template>