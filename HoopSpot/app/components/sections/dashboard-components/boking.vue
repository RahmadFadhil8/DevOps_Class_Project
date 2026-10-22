<template>
    <CardsBookingTableDashboard
    :-bookings="DataBooking"
    @ubah="ubahStatus"
    />
</template>
<script setup lang="ts">
import type { DaftarBooking } from '~/types';

const api = useApi()

const { data: DataBooking, refresh } = await useAsyncData('admin-booking', () =>
    api<DaftarBooking[]>('/api/admin/booking', { query: { limit: 10 } }),
    { default: () => [] }
)

// Dipanggil saat admin menekan tombol Approve / Reject di tabel
const ubahStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
        await api(`/api/admin/booking/${id}`, { method: 'PATCH', body: { status } })
        await refresh()
        await refreshNuxtData(['admin-stats', 'admin-court-status'])
    } catch (error) {
        alert(pesanError(error, 'Gagal mengubah status booking.'))
    }
}
</script>