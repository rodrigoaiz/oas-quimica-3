declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"objetos": {
"oa1.mdx": {
	id: "oa1.mdx";
  slug: "oa1";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/bohr.mdx": {
	id: "oa1/bohr.mdx";
  slug: "oa1/bohr";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/cuantico.mdx": {
	id: "oa1/cuantico.mdx";
  slug: "oa1/cuantico";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/dalton.mdx": {
	id: "oa1/dalton.mdx";
  slug: "oa1/dalton";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/evaluacion.mdx": {
	id: "oa1/evaluacion.mdx";
  slug: "oa1/evaluacion";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/introduccion.mdx": {
	id: "oa1/introduccion.mdx";
  slug: "oa1/introduccion";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/rutherford.mdx": {
	id: "oa1/rutherford.mdx";
  slug: "oa1/rutherford";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa1/thomson.mdx": {
	id: "oa1/thomson.mdx";
  slug: "oa1/thomson";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa2.mdx": {
	id: "oa2.mdx";
  slug: "oa2";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa2/covalente.mdx": {
	id: "oa2/covalente.mdx";
  slug: "oa2/covalente";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa2/evaluacion.mdx": {
	id: "oa2/evaluacion.mdx";
  slug: "oa2/evaluacion";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa2/introduccion.mdx": {
	id: "oa2/introduccion.mdx";
  slug: "oa2/introduccion";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa2/ionico.mdx": {
	id: "oa2/ionico.mdx";
  slug: "oa2/ionico";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa2/metalico.mdx": {
	id: "oa2/metalico.mdx";
  slug: "oa2/metalico";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa3.mdx": {
	id: "oa3.mdx";
  slug: "oa3";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa3/balanceo.mdx": {
	id: "oa3/balanceo.mdx";
  slug: "oa3/balanceo";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa3/energia.mdx": {
	id: "oa3/energia.mdx";
  slug: "oa3/energia";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa3/evaluacion.mdx": {
	id: "oa3/evaluacion.mdx";
  slug: "oa3/evaluacion";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa3/evidencias.mdx": {
	id: "oa3/evidencias.mdx";
  slug: "oa3/evidencias";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
"oa3/introduccion.mdx": {
	id: "oa3/introduccion.mdx";
  slug: "oa3/introduccion";
  body: string;
  collection: "objetos";
  data: InferEntrySchema<"objetos">
} & { render(): Render[".mdx"] };
};
"screens": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "screens";
  data: InferEntrySchema<"screens">;
  render(): Render[".md"];
}>;

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
