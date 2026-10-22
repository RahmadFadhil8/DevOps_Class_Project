<template>
    <UiCard class="p-6">
        <div class="flex justify-between mb-4">
            <h4 class="font-bold">Court Status</h4>
            <button type="button" class="cursor-pointer" @click="refresh()">
                <img src="~/assets/icon/reload.svg" alt="reload"  class="h-6 w-6">
            </button>
        </div>

        <UiCard v-for="court in courts" :key="court.id" class="mb-4">
            <div class="flex gap-4 p-4">
                <div class="border-2 rounded-2xl"></div>
                <div>
                    <p>{{ court.judul }}</p>
                    <p>{{ court.tipe }}</p>
                </div>
                <div>
                    <UiBadge>
                        {{ court.status }}
                    </UiBadge>
                    <p>{{ keterangan(court) }}</p>
                </div>
            </div>
        </UiCard>
    </UiCard>
</template>

<script setup lang="ts">
type StatusCourt = {
    id: string
    judul: string
    tipe: string
    status: 'Available' | 'Booked' | 'Closed'
    sampai: string | null
}

// Endpoint admin: butuh token admin
const api = useApi()
const { data: courts, refresh } = await useAsyncData('admin-court-status', () =>
    api<StatusCourt[]>('/api/admin/lapangan/status'),
    { default: () => [] }
)

const keterangan = (court: StatusCourt) => {
    if (court.status === 'Booked') return `Booked until ${court.sampai}`
    if (court.status === 'Closed') return court.sampai ? `Opens at ${court.sampai}` : 'Closed today'
    return court.sampai ? `Free until ${court.sampai}` : 'Free all day'
}
</script>
