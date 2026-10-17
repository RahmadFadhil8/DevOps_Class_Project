<template>
    <UiCard class="p-6">
        <div class="flex justify-between mb-4">
            <h4 class="font-bold">Court Status</h4>
            <NuxtLink to="/">
                <img src="~/assets/icon/reload.svg" alt="reload"  class="h-6 w-6">
            </NuxtLink>
        </div>
        <UiCard class="mb-4">
            <div class="flex gap-4 p-4">
                <div class="border-2 rounded-2xl"></div>
                <div>
                    <p>Court A1</p>
                    <p>Indoor Premium</p>
                </div>
                <div>
                    <UiBadge>
                        Available
                    </UiBadge>
                    <p>Free until 18:00</p>
                </div>
            </div>
        </UiCard>

        <UiCard class="mb-4">
            <div class="flex gap-4 p-4">
                <div class="border-2 rounded-2xl"></div>
                <div>
                    <p>Court A1</p>
                    <p>Indoor Premium</p>
                </div>
                <div>
                    <UiBadge>
                        Available
                    </UiBadge>
                    <p>Free until 18:00</p>
                </div>
            </div>
        </UiCard>
    </UiCard>
</template>