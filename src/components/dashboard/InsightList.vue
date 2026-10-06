<template>
  <AppCard title="Insights">
    <ul v-if="insights" class="space-y-3">
      <li class="flex gap-3 rounded-lg bg-slate-50 p-3">
        <TrendingDown v-if="insights.spendingDelta <= 0" class="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
        <TrendingUp v-else class="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p class="text-sm text-slate-700">
          Your spending
          <span class="font-semibold">{{ insights.spendingDelta <= 0 ? 'decreased' : 'increased' }} {{ Math.abs(insights.spendingDelta) }}%</span>
          in {{ insights.monthLabel }}.
        </p>
      </li>
      <li v-if="insights.riser" class="flex gap-3 rounded-lg bg-slate-50 p-3">
        <component :is="riserIcons[insights.riser.category] ?? Tag" class="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
        <p class="text-sm text-slate-700">
          <span class="font-semibold">{{ insights.riser.category }}</span> spending
          {{ insights.riser.delta >= 0 ? 'rose' : 'fell' }} {{ Math.abs(insights.riser.delta) }}% vs last month.
        </p>
      </li>
      <li class="flex gap-3 rounded-lg bg-slate-50 p-3">
        <PiggyBank class="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
        <p class="text-sm text-slate-700">
          Savings rate is <span class="font-semibold">{{ insights.savingsRate }}%</span> of income this month.
        </p>
      </li>
    </ul>
  </AppCard>
</template>

<script setup>
import { CarFront, PiggyBank, ShoppingBag, Tag, TrendingDown, TrendingUp } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'

defineProps({ insights: { type: Object, default: null } })

const riserIcons = { Transport: CarFront, Shopping: ShoppingBag, Food: ShoppingBag }
</script>
