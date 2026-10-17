<template>
    <div class="relative">
        <span 
        v-if="icon"
        class="absolute inset-y-0 left-3 flex items-center"
        >
            <img :src="icon" alt="" class="w-6 h-6"> 
        </span>

        <select v-model="pilihNilai" 
        :class="['w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition', icon ? 'pl-10' : 'pl-4']">
            <option 
            v-for="option in dataDropdown"
            :key="option.value"
            :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
interface Option {
    label: string
    value: string
}

const pilihNilai = defineModel<string>()

defineProps<{
    dataDropdown: Option[]
    icon?: string
}>()
</script>