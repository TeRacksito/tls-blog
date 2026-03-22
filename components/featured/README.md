# Featured components

This directory contains non-generic, domain-driven groups of components.

These components differs conceptually from the layer-based components in `components/` because they are not reusable across different domains. They are instead focused on a specific domain, and are not meant to be reused across different domains.

There are two main reasons for existence of this directory:

1. Speed up development by allowing components that are tightly coupled to the domain, without worrying about reusability.
2. Backwards compatibility with existing codebase or well-known patterns that we want to keep using without having to refactor them to fit into the new architecture.
