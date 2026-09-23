# Runtime media assets

TUHU v55 uses local travel photos, companion illustrations, thumbnails and 93 offline English audio clips under `www/assets/`.

The Git history is kept source-focused. Large generated/installable files are published through Actions/Releases rather than copied into `dist/` in commits.

A production build must contain the complete `www/assets/` set and pass `scripts/check-full.mjs`. The asset registry is tracked at `www/assets/image-registry.json` so scene bindings remain reviewable.

Do not place personal ticket screenshots, PDFs, QR codes, reservation confirmations, passports or other user-imported files in this directory. Those belong only to device-local storage.


## Repository bootstrap

The first source commit tracks the media registry and build wiring. The binary runtime media directory is added separately because GitHub's text-content API cannot safely transport the existing 16 MB binary asset set. Android/iOS build workflows deliberately fail early until the media bundle is present, rather than producing a visually incomplete app.