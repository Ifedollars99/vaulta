<template>
  <Doughnut :data="chartData" :options="chartOptions" role="img" :aria-label="ariaLabel" />
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: 'Spending by category chart' },
})

const PALETTE = ['#4F46E5', '#818CF8', '#38BDF8', '#34D399', '#FBBF24', '#F472B6', '#94A3B8']

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: PALETTE.slice(0, props.values.length),
      borderWidth: 2,
      borderColor: '#FFFFFF',
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, font: { size: 11 } } },
    tooltip: {
      callbacks: {
        label: (item) => ` ${item.label}: ₦${Number(item.raw).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      },
    },
  },
}))
</script>
