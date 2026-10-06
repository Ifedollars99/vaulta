<template>
  <PublicLayout>
    <!-- HERO -->
    <section class="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-20">
      <div>
        <p class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          <span class="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
          Fictional demo — no real banking
        </p>
        <h1 class="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Banking built around you.
        </h1>
        <p class="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
          Vaulta gives you instant transfers, spending analytics, virtual cards and
          24/7 account monitoring — designed for how Nigerians actually move money.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink to="/register" class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            Open an account
          </RouterLink>
          <RouterLink to="/dashboard" class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Explore dashboard
          </RouterLink>
        </div>
        <dl class="mt-8 flex gap-8">
          <div>
            <dt class="label">Transfers</dt>
            <dd class="tnum mt-1 text-lg font-semibold text-slate-900">Instant</dd>
          </div>
          <div>
            <dt class="label">Monitoring</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900">24/7</dd>
          </div>
          <div>
            <dt class="label">Card control</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900">1-tap freeze</dd>
          </div>
        </dl>
      </div>

      <!-- Dashboard preview (static mock) -->
      <div class="card overflow-hidden" aria-label="Preview of the Vaulta dashboard">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p class="text-sm font-semibold text-slate-900">Good evening, Adewale</p>
          <span class="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Verified</span>
        </div>
        <div class="px-5 py-4">
          <p class="label">Available balance</p>
          <p class="tnum mt-1 text-3xl font-semibold tracking-tight text-slate-900">₦2,847,500.00</p>
          <p class="mt-1 font-mono text-xs text-slate-500">•••• 4821 · GTBank</p>
          <div class="mt-4 flex items-end gap-1.5" aria-hidden="true">
            <div v-for="(h, i) in bars" :key="i" class="flex-1 rounded-sm" :class="i % 3 === 2 ? 'bg-brand-600' : 'bg-brand-100'" :style="{ height: h + 'px' }" />
          </div>
          <ul class="mt-4 divide-y divide-slate-100 text-sm">
            <li v-for="t in previewTxns" :key="t.name" class="flex items-center justify-between py-2">
              <span class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">{{ t.initials }}</span>
                <span>
                  <span class="block font-medium text-slate-900">{{ t.name }}</span>
                  <span class="block text-xs text-slate-500">{{ t.meta }}</span>
                </span>
              </span>
              <span class="tnum font-semibold" :class="t.credit ? 'text-green-700' : 'text-slate-900'">{{ t.amount }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- TRUST -->
    <section class="border-y border-slate-200 bg-slate-50">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div v-for="t in trust" :key="t.title" class="flex gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <component :is="t.icon" class="h-5 w-5 text-brand-700" aria-hidden="true" />
          </span>
          <div>
            <h2 class="text-sm font-semibold text-slate-900">{{ t.title }}</h2>
            <p class="mt-1 text-sm text-slate-600">{{ t.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p class="label">What you get</p>
      <h2 class="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-slate-900">
        Everything you need to run your money.
      </h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="f in features" :key="f.title" class="card p-5">
          <component :is="f.icon" class="h-5 w-5 text-brand-700" aria-hidden="true" />
          <h3 class="mt-3 text-sm font-semibold text-slate-900">{{ f.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ f.body }}</p>
        </article>
      </div>
    </section>

    <!-- SECURITY -->
    <section class="bg-brand-950">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-brand-100">Security</p>
          <h2 class="mt-2 text-3xl font-semibold tracking-tight text-white">
            Protected by default, alerted in seconds.
          </h2>
          <p class="mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
            Every transaction is scored for risk. New devices, unusual amounts and
            odd-hour activity trigger instant alerts — you approve or block in one tap.
            Simulated in this demo; no real fraud engine.
          </p>
          <RouterLink to="/security" class="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-brand-950 hover:bg-brand-50">
            See the Security Center
          </RouterLink>
        </div>
        <ul class="space-y-3">
          <li v-for="s in securityPoints" :key="s.title" class="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-white">
              <component :is="s.icon" class="h-4 w-4 text-brand-100" aria-hidden="true" />
              {{ s.title }}
            </h3>
            <p class="mt-1 text-sm text-slate-300">{{ s.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Take control of your money.</h2>
      <p class="mx-auto mt-3 max-w-md text-sm text-slate-600">
        Open a free demo account in under two minutes. No BVN, no paperwork — this is a portfolio prototype.
      </p>
      <div class="mt-6 flex justify-center gap-3">
        <RouterLink to="/register" class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          Open an account
        </RouterLink>
        <RouterLink to="/login" class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Log in
        </RouterLink>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
  ArrowLeftRight, ChartColumn, CreditCard, ShieldCheck, BellRing,
  Zap, Lock, Smartphone, ScanEye,
} from 'lucide-vue-next'
import PublicLayout from '@/layouts/PublicLayout.vue'

const bars = [28, 44, 62, 40, 70, 52, 84, 60, 92, 74, 56, 88]

const previewTxns = [
  { initials: 'MN', name: 'MTN Airtime', meta: 'Today · Bills', amount: '−₦5,000.00', credit: false },
  { initials: 'SL', name: 'Salary — Paystack', meta: 'Yesterday · Income', amount: '+₦850,000.00', credit: true },
  { initials: 'NF', name: 'Netflix', meta: 'Mon · Subscriptions', amount: '−₦7,500.00', credit: false },
]

const trust = [
  { icon: Lock, title: 'Secure by design', body: 'Masked PANs, hidden balances and explicit transfer confirmation.' },
  { icon: Zap, title: 'Fast transfers', body: 'Bank transfers with clear fees and instant receipts.' },
  { icon: ChartColumn, title: 'Smart insights', body: 'Spending trends and savings rate, computed automatically.' },
  { icon: BellRing, title: '24/7 monitoring', body: 'Login and transaction alerts the moment something changes.' },
]

const features = [
  { icon: ArrowLeftRight, title: 'Payments', body: 'Send money to any Nigerian bank with a review-before-you-pay flow.' },
  { icon: ChartColumn, title: 'Analytics', body: 'Category breakdowns, income vs expenses and monthly comparisons.' },
  { icon: CreditCard, title: 'Cards', body: 'Virtual and physical cards with freeze, limits and masked details.' },
  { icon: ShieldCheck, title: 'Security', body: 'Security score, trusted devices and login history in one place.' },
  { icon: ScanEye, title: 'Fraud monitoring', body: 'Risk-scored transactions with approve, block and investigate actions.' },
  { icon: Smartphone, title: 'Mobile-first', body: 'Bottom navigation and card-based layouts built for phones.' },
]

const securityPoints = [
  { icon: ScanEye, title: 'Transaction monitoring', body: 'Each transfer is scored 0–100 with plain-language reasons.' },
  { icon: Smartphone, title: 'Device monitoring', body: 'New iPhone, Android or PC sign-ins ask for your approval.' },
  { icon: BellRing, title: 'Suspicious activity alerts', body: 'Push-style alerts with a one-tap “That wasn’t me” action.' },
]
</script>
