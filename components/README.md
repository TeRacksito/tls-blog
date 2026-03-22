# Components

This directory contains all the components of the application.

Mainly, we follow a layered architecture for our components, where each layer is responsible for a specific aspect. The sole exception to this is the `featured` directory.

We implement two main layers of components:

1. `ui`: Low level, generic components.
2. `blocks`: High level, reusable components that are composed of ui components and/or other blocks.
