<template>
  <div class="min-h-screen bg-white">
    <header class="border-b border-slate-200">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Primary">
        <RouterLink to="/" class="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-950 text-sm font-bold text-white">V</span>
          Vaulta
        </RouterLink>
        <div class="flex items-center gap-2">
          <RouterLink to="/login" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            Log in
          </RouterLink>
          <RouterLink to="/register" class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Open an account
          </RouterLink>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="border-t border-slate-200 py-8">
      <p class="mx-auto max-w-7xl px-4 text-xs text-slate-500 sm:px-6">
        Vaulta is a fictional portfolio prototype. No real banking services are provided.
      </p>
    </footer>
  </div>
</template>
