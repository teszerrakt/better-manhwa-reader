<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { SiteConfig } from '@/lib/types';
import { computed, reactive } from 'vue';

const emit = defineEmits<{
  (e: 'add', site: SiteConfig): void;
  (e: 'cancel'): void;
}>();

const form = reactive({
  name: '',
  urlPattern: '',
  selector: 'main',
  width: 480,
});

const widthModel = computed({
  get: () => [form.width],
  set: (v) => (form.width = v[0] ?? form.width),
});

const valid = computed(
  () =>
    form.name.trim().length > 0 &&
    form.urlPattern.trim().length > 0 &&
    form.selector.trim().length > 0,
);

function submit() {
  if (!valid.value) return;
  const slug = form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'site';
  emit('add', {
    id: `${slug}-${Date.now().toString(36)}`,
    name: form.name.trim(),
    urlPattern: form.urlPattern.trim(),
    selector: form.selector.trim(),
    width: form.width,
    enabled: true,
    builtin: false,
  });
}
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center border-b px-4 py-3">
      <h2 class="text-sm font-semibold font-heading">Add site</h2>
    </header>

    <div class="flex-1 space-y-4 overflow-y-auto px-4 py-4">
      <div class="space-y-1.5">
        <Label class="text-xs">Name</Label>
        <Input v-model="form.name" placeholder="Flamescans" />
      </div>
      <div class="space-y-1.5">
        <Label class="text-xs">URL pattern</Label>
        <Input v-model="form.urlPattern" placeholder="https://flamescans.org/*/chapter/*" />
      </div>
      <div class="space-y-1.5">
        <Label class="text-xs">CSS selector</Label>
        <Input v-model="form.selector" placeholder="main" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label class="text-xs">Width</Label>
          <span class="text-xs text-muted-foreground">{{ form.width }}px</span>
        </div>
        <Slider v-model="widthModel" :min="320" :max="800" :step="10" />
      </div>
    </div>

    <footer class="flex justify-end gap-2 border-t px-4 py-3">
      <Button variant="outline" size="sm" @click="emit('cancel')">Cancel</Button>
      <Button size="sm" :disabled="!valid" @click="submit">Add site</Button>
    </footer>
  </div>
</template>
