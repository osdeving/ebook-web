import { historyPublicKeyTwoTracks } from "./history-public-key-two-tracks";
import { historyPortraitGallery } from "./history-portrait-gallery";
import type { EnrichmentItem } from "../shared/types";

export { historyPublicKeyTwoTracks, historyPortraitGallery };

export const historyItems: readonly EnrichmentItem[] = [
  historyPublicKeyTwoTracks,
  historyPortraitGallery,
];
