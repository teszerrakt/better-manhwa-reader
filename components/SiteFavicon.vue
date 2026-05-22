<script setup lang="ts">
import { faviconUrl, originFromUrlPattern } from '@/lib/favicon';
import { computed } from 'vue';

const props = defineProps<{ urlPattern: string; name: string; size?: number }>();

const origin = computed(() => originFromUrlPattern(props.urlPattern));
const src = computed(() => (origin.value ? faviconUrl(origin.value, props.size ?? 32) : ''));
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="name"
    class="size-5 shrink-0 rounded-sm object-cover"
    referrerpolicy="no-referrer"
  />
  <div
    v-else
    class="size-5 shrink-0 rounded-sm bg-muted"
    :aria-label="name"
  />
</template>
