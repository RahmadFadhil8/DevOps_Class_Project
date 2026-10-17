<template>
    <div class="relative">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <img :src="icon" alt="" srcset="" class="h-5 w-5">
        </span>

        <input 
        :type="type" 
        :placeholder="placeholder" 
        :value="modelValue"
        @input="handleInput"
        class="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition">
    </div>
</template>

<script setup lang="ts">
interface Props {
    modelValue: string
    type?: string
    placeholder?:string
    icon?:string
}

withDefaults(defineProps<Props>(), {
    modelValue:'',
    type:'text',
    placeholder:'',
    icon:''
})

const emit = defineEmits<{
    (e: 'update:modelValue', value:string):void
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>