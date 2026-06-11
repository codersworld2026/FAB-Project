/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authz from "../authz.js";
import type * as curriculum from "../curriculum.js";
import type * as curriculumAdmin from "../curriculumAdmin.js";
import type * as packs from "../packs.js";
import type * as profiles from "../profiles.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as usageEvents from "../usageEvents.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  authz: typeof authz;
  curriculum: typeof curriculum;
  curriculumAdmin: typeof curriculumAdmin;
  packs: typeof packs;
  profiles: typeof profiles;
  resources: typeof resources;
  seed: typeof seed;
  seedData: typeof seedData;
  usageEvents: typeof usageEvents;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
