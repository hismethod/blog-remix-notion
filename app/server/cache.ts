import LRUCache from "lru-cache";
let cache: LRUCache<unknown, unknown>;
declare global {
  var __cache: LRUCache<unknown, unknown> | undefined;
}

const seconds = 1000;
const minutes = seconds * 60;

if(process.env.NODE_ENV === "production") {
  cache = new LRUCache({ ttl: 10 * minutes, max: 500, });
} else {
  if(!global.__cache) {
    global.__cache = new LRUCache({ ttl: 30 * minutes, max: 500, });
  }
  cache = global.__cache;
}

export default cache;
