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
  values: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: 'Weekly spending chart' },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Spent',
      data: props.values,
      backgroundColor: '#4F46E5',
      borderRadius: 4,
      barPercentage: 0.7,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (item) => ` Spent: ₦${Number(item.raw).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
    y: {
      grid: { color: '#F1F5F9' },
      border: { display: false },
      ticks: {
        font: { size: 11 },
        callback: (v) => (v >= 1000 ? `₦${Math.round(v / 1000)}k` : `₦${v}`),
      },
    },
  },
}))
</script>
