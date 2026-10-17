<template>
    <UiCard>
        <div class="rounded-2xl shadow-xl bg-white h-full">
            <div class="flex flex-col justify-between h-full gap-4 px-10 py-10">
                <div class="flex gap-1">
                    <img :src="testimoni.rating" class="h-5 w-5">
                    <img :src="testimoni.rating" class="h-5 w-5">
                    <img :src="testimoni.rating" class="h-5 w-5">
                    <img :src="testimoni.rating" class="h-5 w-5">
                    <img :src="testimoni.rating" class="h-5 w-5">
                </div>
                <p class="text-lg italic">{{ testimoni.testimo }}</p>
                <div class="flex items-center gap-2 mt-1">
                    <img :src="testimoni.profil" alt="" class="h-10 w-10 rounded-full bg-cover">
                    <p class="font-bold text-lg">{{ testimoni.namaUser }}</p>
                </div>
            </div>
        </div>
    </UiCard>
</template>

<script setup lang="ts">
import type {Testimoni} from "~/types"
defineProps<{
    testimoni:Testimoni
}>()
</script>