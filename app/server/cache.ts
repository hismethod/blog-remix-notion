import LRUCache from "lru-cache";
const cache = new LRUCache({ ttl: 1000 * 60, max: 500, });
// export namesapce Cache {
//   private static instance: Cache
//   cache: LRUCache<unknown, unknown>;
//   private constructor() {
//     this.cache = new LRUCache({ttl: 1000 * 60, max: 500, });
//     console.log('생성자호출');
//   }
//   public static getInstance() {
//     return this.instance || (this.instance = new this());
//   }
// }

export default cache;
