# Website Management Guide

This guide is intended for administrators who manage and update the Jexactyl panel installation hosted from this repo.
Use it alongside the main project docs such as [README.md](../README.md) and the asset build instructions in
[BUILDING.md](../BUILDING.md).

## 1. Where to log in

- **Admin panel URL:** the admin panel is mounted at `/admin` (see `routes/admin.php`).
  - Example: `https://panel.example.com/admin`
- **Roles/permissions:** only users marked as administrators can access the admin panel. Ensure that the account you
  use has admin privileges before attempting to log in.
- **Accounts:** user management lives within the application. If you need to reset access, use the admin user tools or
  update user records directly in the database per your operational policy.

## 2. Updating content

Common content-related areas to update:

- **Pages and navigation:** look for server-rendered views in `resources/views/` and React assets in `resources/scripts/`.
  Navigation and layout components are typically defined alongside these views/components.
- **Branding:** static assets (logos, icons) live under `public/` (e.g., `public/assets/`). Update assets and re-build if
  they are bundled.
- **Footer and legal text:** search in `resources/views/` for footer or legal templates. If the text is managed in code,
  update the relevant view or language strings under `resources/lang/`.
- **Admin-managed settings:** the admin panel includes appearance and other configuration sections (see
  `routes/admin.php` for available sections such as `/appearance`). Use the UI for updates that are intended to be
  stored in the database or configuration values rather than hard-coded files.

## 3. Environment updates

- **Config files:** environment-specific configuration defaults are stored in `config/`. Update these only if you intend
  to change the default behavior across environments.
- **`.env` values:** runtime overrides should be done via `.env` in your deployment environment (not committed). Keep
  credentials and secrets out of version control.
- **Safe update flow:**
  1. Take a backup (see section 5).
  2. Apply changes to `.env` or `config/` as needed.
  3. Clear caches after changes (see section 4) to ensure config is reloaded.

## 4. Deploying changes

- **Build artifacts:** compiled frontend assets are output to `public/assets/`. For production builds, follow the steps
  in [BUILDING.md](../BUILDING.md) (e.g., `yarn run build:production`) and deploy the updated `public/assets/` files.
- **Cache clearing:** after deploying code or config changes, clear caches using the provided tooling (for example,
  Laravel cache commands via `php artisan`). Typical commands include:
  - `php artisan config:clear`
  - `php artisan route:clear`
  - `php artisan view:clear`
  - `php artisan cache:clear`
- **Migrations:** if updates include database changes, run migrations with `php artisan migrate` in a maintenance
  window.
- **Restart services:** restart PHP-FPM/web server or queue workers if your deployment model requires it.

## 5. Backups & rollback

- **Database backups:** back up the database before updates. Keep a timestamped SQL dump or snapshot that can be
  restored quickly.
- **Storage backups:** back up file storage (for example `storage/` and user-uploaded assets under `public/` or
  `storage/app/` if applicable).
- **Rollback procedure:**
  1. Restore the last known-good database backup.
  2. Restore the prior release code and `public/assets/` build artifacts.
  3. Clear caches after rollback to ensure old config/views are loaded.

## 6. Troubleshooting

- **Application logs:** check `storage/logs/` for errors and stack traces.
- **Missing assets/manifest:** if the UI loads incorrectly or you see missing asset errors, verify that
  `public/assets/` contains the latest build output and re-run the build steps from [BUILDING.md](../BUILDING.md).
- **Configuration not updating:** ensure caches are cleared (see deployment steps above) and that `.env` values are
  applied by your process manager.
- **Permission errors:** verify that `storage/` and `bootstrap/cache/` are writable by the web server user.
