<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="mb-6 flex items-center justify-center gap-2 font-semibold tracking-tight text-slate-900">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950 text-sm font-bold text-white">V</span>
        Vaulta
      </RouterLink>
      <div class="card p-6 sm:p-8">
        <slot />
      </div>
      <p class="mt-4 text-center text-xs text-slate-500">
        Vaulta demo — fictional data only, no real money moves.
      </p>
    </div>
  </div>
</template>
