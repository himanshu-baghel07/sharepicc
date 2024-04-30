import { BASE_URL } from "./Constant";

export const TEST_DEV = BASE_URL;

export const URI_PREFIX = TEST_DEV;
export function getHost() {
  return URI_PREFIX;
}
export var URI = getURI();
export function getURI() {
  return {
    upload_media: `${getHost()}/upload`,
    my_feeds: `${getHost()}/getCid`,
    my_uploads: `${getHost()}/metadata`,
    add_like_to_post: `${getHost()}/add-likes-to-posts`,
    add_share: `${getHost()}/get-post-from-id`,
  };
}
