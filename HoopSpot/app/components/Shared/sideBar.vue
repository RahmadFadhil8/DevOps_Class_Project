<template>
    <div class="flex flex-col justify-between h-screen items-center pt-6 border-r border-gray-300 w-fit bg-white">
        <div class="px-4">
            <div class="mb-10 pl-4">
                <img src="~/assets/images/navbar.png" alt="logo" class="h-12">
                <p class="text-sm text-gray-500 mt-2">Admin Console</p>
            </div>
            <ul class="space-y-2">
                <li>
                    <UiButton variant="sidebar" full>
                        <NuxtLink to="/" class="flex items-center gap-2 w-full">
                            <img src="~/assets/icon/home.svg" alt="" class="h-6 w-6">
                            Overview
                        </NuxtLink>
                    </UiButton>
                </li>
                <li>
                    <UiButton variant="sidebar" full>
                        <NuxtLink to="/" class="flex gap-2">
                            <img src="~/assets/icon/tennisCourt.svg" alt="" class="h-6 w-6">
                            Manage Courts
                        </NuxtLink>
                    </UiButton>
                </li>
                <li>
                    <UiButton variant="sidebar" full>
                        <NuxtLink to="/" class="flex gap-2">
                            <img src="~/assets/icon/calendar.svg" alt="" class="h-6 w-6">
                            Bookings
                        </NuxtLink>
                    </UiButton>
                </li>
                <li>
                    <UiButton variant="sidebar" full>
                        <NuxtLink to="/" class="flex gap-2">
                            <img src="~/assets/icon/user.svg" alt="" class="h-6 w-6">
                            Users
                        </NuxtLink>
                    </UiButton>
                </li>
                <li>
                    <UiButton variant="sidebar" full>
                        <NuxtLink to="/" class="flex gap-2">
                            <img src="~/assets/icon/reports.svg" alt="" class="h-6 w-6">
                            Reports
                        </NuxtLink>
                    </UiButton>
                </li>
                <li>
                    <UiButton variant="sidebar" full>
                        <NuxtLink to="/" class="flex gap-2">
                            <img src="~/assets/icon/logout.svg" alt="" class="h-6 w-6">
                            Log out
                        </NuxtLink>
                    </UiButton>
                </li>
            </ul>
        </div>

        <div class="flex justify-center items-center gap-4 bg-gray-200 w-full p-4">
            <img src="~/assets/images/pofil (3).jpg" alt="profil" class="rounded-full object-cover h-12 w-12">
            <div>
                <p class="font-semibold">Admin User</p>
                <p class="text-sm text-gray-500">System Master</p>
            </div>
        </div>
    </div>
</template>