<template>
    <button :class="['rounded-lg px-4 py-2 font-medium transition-colors duration-200 flex gap-3', buttonClass, full ? 'w-full' : 'w-fit']">
        <slot />
    </button>
</template>

<script setup lang="ts">
const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
    },
    full: {
        type:Boolean,
        default: false
    }
})

const buttonClass = computed(() => {
    switch (props.variant) {
        case 'outline':
            return 'border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white justify-center items-center'
        case 'secondary':
            return 'bg-secondary text-white justify-center items-center'
        case 'sidebar':
            return 'hover:bg-secondary'
        default:
            return 'bg-primary text-white justify-center items-center'
    }
})
</script>