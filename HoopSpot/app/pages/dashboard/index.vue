<script setup>
import Dashboard from '~/layouts/dashboard.vue';

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div class="flex min-h-screen">

    <SectionsDashboardComponentsSidebar/>

    <div class="flex-1">
      <SectionsDashboardComponentsHeader/>
      <main class="mx-6 my-4 flex flex-col gap-8">
        <SectionsDashboardComponentsStatistik/>

        <div class="flex gap-8">
          <div class="w-2/3">
            <SectionsDashboardComponentsBoking/>
          </div>
          <div class="w-1/3">
            <SectionsDashboardComponentsStatuscourt/>
          </div>
        </div>
      </main>
    </div>

  </div>
</template>