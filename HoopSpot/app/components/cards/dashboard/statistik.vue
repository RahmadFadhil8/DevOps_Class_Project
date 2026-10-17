<template>
    <div>
        <UiCard>
            <div class="py-6 px-4">
                <h1 class="font-bold text-xl">{{statistik.judul}}</h1>
                <p class="font-semibold text-lg">{{ statistik.jumlah }}</p>
            </div>
        </UiCard>
    </div>
</template>
<script setup lang="ts">
import type {Statistik} from "~/types"

defineProps<{
    statistik:Statistik
}>()
</script>