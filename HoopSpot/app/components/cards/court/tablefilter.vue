<template>
    <section>
        <UiCard class="p-6">
            <div class="grid grid-cols-5 items-end gap-4">
                <div>
                    <label>Lokasi</label>
                    <UiInput
                    v-model="text"
                    type="text"
                    placeholder="Jakarta Selatan, Bandung"
                    :icon="location"
                    />
                </div>

                <div>
                    <label>Tanggal</label>
                    <UiInput
                    v-model="date"
                    type="Date"
                    placeholder="mm/dd/yyyy"
                    :icon="Calendar"
                    />
                </div>

                <div>
                    <label>Rentang Harga</label>
                    <UiDropdown
                    v-model="Harga"
                    :data-dropdown="HargaOptions"
                    :icon="money"
                    >
                    </UiDropdown> 
                </div>

                <div>
                    <label>Tipe Lapangan</label>
                    <UiDropdown
                    v-model="statusLapangan"
                    :data-dropdown="lapanganOptions"
                    :icon="basketball"
                    >
                    </UiDropdown> 
                </div>

                <div class="mb-1">
                    <UiButton full>
                        Cari Sekarang
                    </UiButton>
                </div>
            </div>
        </UiCard>
    </section>
</template>
<script setup lang="ts">
import location from '~/assets/icon/location.svg'
import Calendar from '~/assets/icon/calendar.svg'
import money from '~/assets/icon/money.svg'
import basketball from '~/assets/icon/basketball.svg'
const text = ref('')
const date = ref('')
const Harga = ref('Semua Harga')
const statusLapangan = ref('Semua Tipe')

const HargaOptions = [
    {
        label: 'Pending',
        value: 'Pending'
    },
    {
        label: 'Approved',
        value: 'Approved'
    },
    {
        label: 'Rejected',
        value: 'Rejected'
    }
]

const lapanganOptions = [
    {
        label: 'Semua Tipe',
        value: 'Semua Tipe'
    },
    {
        label: 'Indoor',
        value: 'Indoor'
    },
    {
        label: 'Outdoor',
        value: 'Outdoor'
    },
]
</script>