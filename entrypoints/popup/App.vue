<script setup lang="ts">
import AddSiteForm from '@/components/AddSiteForm.vue';
import SiteCard from '@/components/SiteCard.vue';
import { loadSites, onSitesChanged, resetDefaults, saveSites } from '@/lib/storage';
import type { SiteConfig } from '@/lib/types';
import { onMounted, onUnmounted, ref } from 'vue';

const sites = ref<SiteConfig[]>([]);

let unsubscribe: (() => void) | null = null;

onMounted(async () => {
  sites.value = await loadSites();
  unsubscribe = onSitesChanged((next) => {
    if (Array.isArray(next)) sites.value = next;
  });
});

onUnmounted(() => unsubscribe?.());

async function persist(next: SiteConfig[]) {
  sites.value = next;
  await saveSites(next);
}

function onUpdate(updated: SiteConfig) {
  if (!Array.isArray(sites.value)) return;
  persist(sites.value.map((s) => (s.id === updated.id ? updated : s)));
}

function onDelete(id: string) {
  if (!Array.isArray(sites.value)) return;
  persist(sites.value.filter((s) => s.id !== id));
}

function onAdd(site: SiteConfig) {
  if (!Array.isArray(sites.value)) return;
  persist([...sites.value, site]);
}

async function onReset() {
  if (!confirm('Reset to default sites? Custom sites will be removed.')) return;
  sites.value = await resetDefaults();
}
</script>

<template>
  <div class="bg-background p-3">
    <header class="mb-3 flex items-center justify-between">
      <h1 class="text-sm font-semibold">Better Manhwa Reader</h1>
      <button
        class="text-xs text-muted-foreground underline-offset-2 hover:underline"
        @click="onReset"
      >
        Reset
      </button>
    </header>
    <div class="space-y-3">
      <SiteCard
        v-for="site in sites"
        :key="site.id"
        :site="site"
        @update="onUpdate"
        @delete="onDelete"
      />
      <AddSiteForm @add="onAdd" />
    </div>
  </div>
</template>
