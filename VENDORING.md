# Framer Module Vendoring

## Overview

This document explains how the Framer modules were vendored to display Signal branding instead of Mahadeva after JavaScript hydration.

## Problem

The original implementation had Signal copy in the HTML (`app/route.ts`), but when the Framer JavaScript loaded from the CDN, it would hydrate the page with Mahadeva branding, overwriting the Signal content.

## Solution

1. **Downloaded** all 38 Framer `.mjs` modules from `framerusercontent.com` CDN
2. **Patched** the modules to replace marketing strings:
   - Brand: Mahadeva → Signal
   - Copy: "Custom AI Solutions" → "Know why they cancel — before they disappear"
   - Pricing: $199/$299 → $99/$249
   - Removed: contra.com/polar.sh checkout links
3. **Saved** to `public/assets/framer/`
4. **Updated** `app/route.ts` to load modules from `/assets/framer/` instead of CDN
5. **Preserved** all Framer Motion animations and runtime functionality

## Files Modified

- `app/route.ts` - Updated script_main and modulepreload URLs
- `public/assets/framer/*.mjs` - 38 vendored and patched modules

## Key Modules Patched

These files contained marketing copy that was updated:

- `Kteb2CtG5oIoLpZtSLB4AKqsFRyjI7BwftqVN1OpQh4.Dkzh5xr8.mjs`
- `voMG_PD4L.tztPPyez.mjs`
- `gq5acQOsT.CTw-HQso.mjs`
- `k5x3sP8HX.Cx1jKKRx.mjs`
- `fBGWSa7cv.B8UHzPDl.mjs`
- `tbiEnvXFC.CeYGglAH.mjs`
- `shared-lib.DUtvQ7JU.mjs`
- `script_main.BfjZzZhT.mjs`

## Import Resolution

The vendored modules use relative imports (`./filename.mjs`). When loaded from `/assets/framer/`, these resolve correctly to other files in the same directory.

## Size

Total vendored modules: **1.9 MB**

## Verification

After deployment, verify:
- ✅ Framer Motion animations work
- ✅ Page displays "Signal" branding
- ✅ Pricing shows $99 / $249
- ✅ No "Mahadeva" or "Custom AI Solutions" visible
- ✅ CTAs link to `/scan` not contra.com

## Maintenance

If the Framer template is updated:
1. Download new modules from CDN
2. Re-apply patches using similar string replacements
3. Test hydration shows Signal content
