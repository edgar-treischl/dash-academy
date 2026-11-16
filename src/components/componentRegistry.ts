import { lazy } from "react";

/**
 * Component registry for dynamically loading lesson components.
 * Add new components here as they are created.
 * 
 * Usage in markdown:
 * ::: component SalesChart
 * {"title": "Example sales"}
 * :::
 */

type ComponentType = React.ComponentType<Record<string, unknown>>;

const componentRegistry: Record<string, ComponentType> = {
  SalesChart: lazy(() => import("./SalesChart")),
};

/**
 * Get a component by name. Returns lazy-loaded component or null if not found.
 */
export function getComponent(name: string): ComponentType | null {
  return Object.hasOwn(componentRegistry, name) ? componentRegistry[name] : null;
}
