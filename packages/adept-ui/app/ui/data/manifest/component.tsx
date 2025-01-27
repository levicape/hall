export const MANIFEST_COMPONENT = `CdnComponent` as const;
export const MANIFEST_RESPONSE_DATA = `data` as const;
export const MANIFEST_ASSET_PATH =
	`/.${MANIFEST_COMPONENT}/manifest.json` as const;
export const MANIFEST_URL = `/~/v1/Worlds/Manifests/-i/manifest` as const;
export const MANIFEST_METHOD = `POST` as const;
