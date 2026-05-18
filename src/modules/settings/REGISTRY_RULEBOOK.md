# Registry Governance Rules

- Allowed field types: text, email, phone, number, toggle, select, readonly, action, repeatable_group, password_change
- Section order is enforced by clientRegistry / workerRegistry files.
- Fields are purely presentational; business logic stays in contexts.
- Danger actions must remain in DangerZoneSection only.
- New sections must be added to shared/client/worker registries AND backend DEFAULT_SETTINGS.
- Accessibility: every interactive field must have role, label, keyboard support.
- Save behaviour: debounced 800 ms, dirty detection, per-section status.