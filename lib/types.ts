export type SiteConfig = {
  id: string;
  name: string;
  urlPattern: string;
  selector: string;
  width: number;
  enabled: boolean;
  builtin: boolean;
};

export type StorageShape = {
  sites: SiteConfig[];
};
