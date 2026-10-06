<template>
  <Bar :data="chartData" :options="chartOptions" role="img" :aria-label="ariaLabel" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  income: { type: Array, default: () => [] },
  expenses: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: 'Monthly income versus expenses chart' },
})

function compactNaira(value) {
  if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `₦${Math.round(value / 1000)}k`
  return `₦${value}`
}

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Income',
      data: props.income,
      backgroundColor: '#4F46E5',
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    },
    {
      label: 'Expenses',
      data: props.expenses,
      backgroundColor: '#C7D2FE',
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', align: 'end', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true } },
    tooltip: {
      callbacks: {
        label: (item) => ` ${item.dataset.label}: ₦${Number(item.raw).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: '#F1F5F9' },
      border: { display: false },
      ticks: { font: { size: 11 }, callback: (v) => compactNaira(v) },
    },
  },
}))
</script>
