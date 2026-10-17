<template>
    <label class="cursor-pointer">
        <input type="radio" class="hidden" :nama="nama" :value="value" :checked="modelValue === value" @change="$emit('update:modelValue',value)">
        <div class="rounded-xl border px-4 py-3 text-center transition-all" :class="modelValue === value ? 'bg-lime-300 border-lime-400 font-semibold text-gray-800' : 'bg-white border-gray-200 text-gray-500 hover:border-lime-300'">
            <slot>
                {{ label }}
            </slot>
        </div>
    </label>
</template>

<script setup lang="ts">
defineProps<{
    modelValue : string | number
    value: string | number
    label?: string
    nama: string
}>()

defineEmits<{
    (e: 'update:modelValue', value:string | number):void
}>()
</script>