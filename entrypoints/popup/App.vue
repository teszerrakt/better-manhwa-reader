<script setup lang="ts">
import AddSiteForm from '@/components/AddSiteForm.vue';
import SiteCard from '@/components/SiteCard.vue';
import SiteFavicon from '@/components/SiteFavicon.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  loadLastSelected,
  loadSites,
  onSitesChanged,
  resetDefaults,
  saveLastSelected,
  saveSites,
} from '@/lib/storage';
import type { SiteConfig } from '@/lib/types';
import { RiAddLine, RiMoonLine, RiRefreshLine, RiSunLine } from '@remixicon/vue';
import { useDark, useToggle } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const isDark = useDark({ storageKey: 'bmr-theme' });
const toggleDark = useToggle(isDark);

const sites = ref<SiteConfig[]>([]);
const selectedId = ref<string>('');
const adding = ref(false);

let unsubscribe: (() => void) | null = null;

const selectedSite = computed(() =>
  sites.value.find((s) => s.id === selectedId.value) ?? null,
);

onMounted(async () => {
  sites.value = await loadSites();
  const last = await loadLastSelected();
  selectedId.value =
    (last && sites.value.find((s) => s.id === last)?.id) ?? sites.value[0]?.id ?? '';
  unsubscribe = onSitesChanged((next) => {
    if (!Array.isArray(next)) return;
    sites.value = next;
    if (!next.find((s) => s.id === selectedId.value)) {
      selectedId.value = next[0]?.id ?? '';
    }
  });
});

onUnmounted(() => unsubscribe?.());

watch(selectedId, (id) => {
  if (id) saveLastSelected(id);
});

async function persist(next: SiteConfig[]) {
  sites.value = next;
  await saveSites(next);
}

function onUpdate(updated: SiteConfig) {
  persist(sites.value.map((s) => (s.id === updated.id ? updated : s)));
}

function toggleEnabled(site: SiteConfig, value: boolean) {
  onUpdate({ ...site, enabled: value });
}

function onDelete(id: string) {
  const next = sites.value.filter((s) => s.id !== id);
  if (selectedId.value === id) selectedId.value = next[0]?.id ?? '';
  persist(next);
}

function onAdd(site: SiteConfig) {
  persist([...sites.value, site]);
  selectedId.value = site.id;
  adding.value = false;
}

function startAdding() {
  adding.value = true;
}

function cancelAdding() {
  adding.value = false;
}

async function onReset() {
  const next = await resetDefaults();
  sites.value = next;
  selectedId.value = next[0]?.id ?? '';
  adding.value = false;
}

function selectSite(id: string) {
  adding.value = false;
  selectedId.value = id;
}
</script>

<template>
  <div class="flex h-full w-full bg-background text-foreground">
    <aside class="flex w-40 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <header class="flex items-center justify-between border-b px-3 py-2.5">
        <h1 class="text-xs font-semibold font-heading">Reader</h1>
        <div class="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDark()"
          >
            <RiSunLine v-if="isDark" class="size-3.5" />
            <RiMoonLine v-else class="size-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="ghost" size="icon-xs" title="Reset to defaults">
                <RiRefreshLine class="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
                <AlertDialogDescription>
                  Removes all custom sites and restores built-ins to their original settings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  @click="onReset"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <ScrollArea class="flex-1">
        <nav class="flex flex-col p-1.5">
          <div
            v-for="site in sites"
            :key="site.id"
            :data-active="!adding && selectedId === site.id ? '' : undefined"
            :data-disabled="site.enabled ? undefined : ''"
            class="group/tab flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
          >
            <button
              type="button"
              class="flex min-w-0 flex-1 items-center gap-2 text-left data-[disabled]:opacity-50 group-data-[disabled]/tab:opacity-50"
              @click="selectSite(site.id)"
            >
              <SiteFavicon :url-pattern="site.urlPattern" :name="site.name" />
              <span class="truncate">{{ site.name }}</span>
            </button>
            <Switch
              :model-value="site.enabled"
              :title="site.enabled ? 'Disable' : 'Enable'"
              @update:model-value="(v: boolean) => toggleEnabled(site, v)"
            />
          </div>
        </nav>
      </ScrollArea>

      <div class="border-t p-1.5">
        <Button
          variant="ghost"
          size="sm"
          class="w-full justify-start gap-1.5"
          :data-active="adding ? '' : undefined"
          @click="startAdding"
        >
          <RiAddLine class="size-3.5" />
          Add site
        </Button>
      </div>
    </aside>

    <main class="flex flex-1 flex-col bg-background">
      <AddSiteForm v-if="adding" @add="onAdd" @cancel="cancelAdding" />
      <SiteCard
        v-else-if="selectedSite"
        :key="selectedSite.id"
        :site="selectedSite"
        @update="onUpdate"
        @delete="onDelete"
      />
      <div v-else class="flex flex-1 items-center justify-center text-xs text-muted-foreground">
        Pick a site or add one
      </div>
    </main>
  </div>
</template>
