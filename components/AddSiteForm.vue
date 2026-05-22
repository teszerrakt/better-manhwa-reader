<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { SiteConfig } from '@/lib/types';
import { Plus, X } from 'lucide-vue-next';
import { computed, reactive, ref } from 'vue';

const emit = defineEmits<{ (e: 'add', site: SiteConfig): void }>();

const open = ref(false);

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

function reset() {
  form.name = '';
  form.urlPattern = '';
  form.selector = 'main';
  form.width = 480;
}

function submit() {
  if (!valid.value) return;
  const id = form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `site-${Date.now()}`;
  emit('add', {
    id: `${id}-${Date.now().toString(36)}`,
    name: form.name.trim(),
    urlPattern: form.urlPattern.trim(),
    selector: form.selector.trim(),
    width: form.width,
    enabled: true,
    builtin: false,
  });
  reset();
  open.value = false;
}
</script>

<template>
  <Card v-if="open">
    <CardContent class="space-y-3 pt-5">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold">Add site</span>
        <Button variant="ghost" size="icon" class="h-7 w-7" @click="open = false">
          <X class="h-4 w-4" />
        </Button>
      </div>
      <div class="space-y-1">
        <Label class="text-xs">Name</Label>
        <Input v-model="form.name" placeholder="Flamescans" />
      </div>
      <div class="space-y-1">
        <Label class="text-xs">URL pattern</Label>
        <Input v-model="form.urlPattern" placeholder="https://flamescans.org/*/chapter/*" />
      </div>
      <div class="space-y-1">
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
      <Button class="w-full" :disabled="!valid" @click="submit">Save</Button>
    </CardContent>
  </Card>
  <Button v-else variant="outline" class="w-full" @click="open = true">
    <Plus class="mr-2 h-4 w-4" /> Add site
  </Button>
</template>
