// Registers jest-dom matchers (e.g. toBeInTheDocument, toBeDisabled) on Vitest's
// expect. Safe to load for Node tests too — matchers only touch the DOM when used.
import '@testing-library/jest-dom/vitest';
