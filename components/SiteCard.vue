<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { SiteConfig } from '@/lib/types';
import { Trash2 } from 'lucide-vue-next';
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
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">{{ site.name }}</span>
        <span
          v-if="site.builtin"
          class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >built-in</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Switch
          :model-value="site.enabled"
          @update:model-value="(v: boolean) => patch('enabled', v)"
        />
        <Button
          v-if="!site.builtin"
          variant="ghost"
          size="icon"
          class="h-7 w-7"
          @click="emit('delete', site.id)"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="!site.builtin" class="space-y-1">
        <Label class="text-xs">Name</Label>
        <Input
          :model-value="site.name"
          @update:model-value="(v) => patch('name', String(v))"
        />
      </div>
      <div class="space-y-1">
        <Label class="text-xs">URL pattern</Label>
        <Input
          :model-value="site.urlPattern"
          @update:model-value="(v) => patch('urlPattern', String(v))"
        />
      </div>
      <div class="space-y-1">
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
    </CardContent>
  </Card>
</template>
