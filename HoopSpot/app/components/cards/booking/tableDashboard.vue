<template>
    <UiCard>
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold">
                Booking Requests
            </h2>

            <NuxtLink
                to="/dashboard/bookings"
                class="text-primary font-medium"
            >
                View All
            </NuxtLink>
        </div>

        <UiTable>
            <!-- TABLE HEADER -->
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                        USER
                    </th>

                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                        COURT
                    </th>

                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                        TIME SLOT
                    </th>

                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                        STATUS
                    </th>

                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-500">
                        ACTIONS
                    </th>
                </tr>
            </thead>

            <!-- TABLE BODY -->
            <tbody>

                <tr v-for="Booking in Bookings" :key="Booking.user" class="border-t border-gray-200">

                    <td class="px-6 py-5">
                        {{Booking.user}}
                    </td>

                    <td class="px-6 py-5">
                        {{Booking.court}}
                    </td>

                    <td class="px-6 py-5">
                        {{ Booking.timeSlot.start }} - {{ Booking.timeSlot.end }}
                    </td>

                    <td class="px-6 py-5">
                        <span
                            class="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600"
                        >
                            {{Booking.status}}
                        </span>
                    </td>

                    <td class="px-6 py-5">
                        Actions
                    </td>

                </tr>

            </tbody>
        </UiTable>

    </UiCard>
</template>
<script setup lang="ts">
import type {DaftarBooking} from '~/types'

defineProps<{
    Bookings:DaftarBooking[]
}>()
</script>