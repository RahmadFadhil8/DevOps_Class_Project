<template>
    <CardsBookingTableDashboard
    :-bookings="DataBooking"
    />
</template>
<script setup lang="ts">
import type { DaftarBooking } from '~/types';
const DataBooking: DaftarBooking[] = [
    {
        user: "Jhon Doe",
        court: "Court A1",
        timeSlot: {
            start: "18:00",
            end: "19:30"
        },
        status:'Pending'
    },
    {
        user: "Jhon",
        court: "Court A3",
        timeSlot: {
            start: "19:00",
            end: "20:30"
        },
        status:'Pending'
    },
    {
        user: "Doe",
        court: "Court A2",
        timeSlot: {
            start: "3:00",
            end: "12:30"
        },
        status:'Pending'
    },
]
</script>