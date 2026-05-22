<script setup lang="ts">
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { SiteConfig } from '@/lib/types';
import { RiDeleteBin5Line } from '@remixicon/vue';
import { computed } from 'vue';

const props = defineProps<{ site: SiteConfig }>();
const emit = defineEmits<{
  (e: 'update', site: SiteConfig): void;
  (e: 'delete', id: string): void;
}>();

function patch<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
  emit('update', { ...props.site, [key]: value });
}

const widthModel = computed({
  get: () => [props.site.width],
  set: (v) => patch('width', v[0] ?? props.site.width),
});
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center justify-between border-b px-4 py-3">
      <div class="flex min-w-0 items-center gap-2">
        <SiteFavicon :url-pattern="site.urlPattern" :name="site.name" />
        <h2 class="truncate text-sm font-semibold font-heading">{{ site.name }}</h2>
        <span
          v-if="site.builtin"
          class="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >built-in</span
        >
      </div>
    </header>

    <div class="flex-1 space-y-4 overflow-y-auto px-4 py-4">
      <div v-if="!site.builtin" class="space-y-1.5">
        <Label class="text-xs">Name</Label>
        <Input
          :model-value="site.name"
          @update:model-value="(v) => patch('name', String(v))"
        />
      </div>
      <div class="space-y-1.5">
        <Label class="text-xs">URL pattern</Label>
        <Input
          :model-value="site.urlPattern"
          @update:model-value="(v) => patch('urlPattern', String(v))"
        />
      </div>
      <div class="space-y-1.5">
        <Label class="text-xs">CSS selector</Label>
        <Input
          :model-value="site.selector"
          @update:model-value="(v) => patch('selector', String(v))"
        />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label class="text-xs">Width</Label>
          <span class="text-xs text-muted-foreground">{{ site.width }}px</span>
        </div>
        <Slider v-model="widthModel" :min="320" :max="800" :step="10" />
      </div>
    </div>

    <footer v-if="!site.builtin" class="border-t px-4 py-3">
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive" size="sm" class="gap-1.5">
            <RiDeleteBin5Line class="size-3.5" />
            Delete site
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {{ site.name }}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the site from your list. You can re-add it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              @click="emit('delete', site.id)"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  </div>
</template>
