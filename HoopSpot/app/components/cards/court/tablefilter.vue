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
                    <UiButton full @click="cari">
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

// Dikirim ke halaman induk (pages/lapangan/index.vue) saat tombol "Cari Sekarang" ditekan
const emit = defineEmits<{
    (e: 'cari', filter: { q: string; tipe: string; hargaMin: string; hargaMax: string }): void
}>()

const text = ref('')
const date = ref('')
const Harga = ref('semua')
const statusLapangan = ref('Semua Tipe')

// value berformat "min-max" (kosong = tanpa batas)
const HargaOptions = [
    { label: 'Semua Harga', value: 'semua' },
    { label: 'Di bawah Rp 200.000', value: '-199999' },
    { label: 'Rp 200.000 - Rp 250.000', value: '200000-250000' },
    { label: 'Di atas Rp 250.000', value: '250001-' },
]

const lapanganOptions = [
    { label: 'Semua Tipe', value: 'Semua Tipe' },
    { label: 'Indoor', value: 'Indoor' },
    { label: 'Outdoor', value: 'Outdoor' },
]

const cari = () => {
    const [hargaMin = '', hargaMax = ''] =
        Harga.value === 'semua' ? [] : Harga.value.split('-')

    emit('cari', {
        q: text.value.trim(),
        tipe: statusLapangan.value === 'Semua Tipe' ? '' : statusLapangan.value,
        hargaMin,
        hargaMax,
    })
}
</script>