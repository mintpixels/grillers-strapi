# Calendar service identifiers and GraphQL startup — #362

Strapi 5.23.1 preserves the leading digits in `3_DAY_SELECT` and `2ND_DAY_AIR`
when constructing GraphQL enum members. With shadow CRUD enabled, either value
prevents application startup. The pre-fix application was reproduced with the
actual Strapi load path against disposable SQLite; TypeScript and admin builds
alone do not construct this schema.

The CMS component now uses `UPS_3_DAY_SELECT` and `UPS_2ND_DAY_AIR`. The paired
backend calendar adapter maps these to the existing carrier codes `3_DAY_SELECT`
and `2ND_DAY_AIR`. `GROUND` and `OVERNIGHT` are unchanged. Carrier integrations,
checkout shipping methods, approved transit days and customer promises do not
change. Unknown service values still fail validation.

Release the corrected CMS schema and backend adapter together with the existing
calendar release prerequisites. Carry the fix through Strapi PR10/PR11 and every
backend branch descended from PR34; do not deploy an older stacked schema. A
schema rename does not rewrite stored draft/published component values. Inventory
any existing old values during the protected content rehearsal and use the new
CMS identifiers before publication. No content or policy was changed by this fix.

`yarn test:graphql-boot` creates a temporary application copy, compiles its real
server code and calls `createStrapi().load()` with the actual GraphQL plugin and
shadow CRUD enabled. It uses a disposable SQLite database and synthetic secrets;
local `.env`, uploads and database files are excluded. Search/cloud integrations
are disabled and outbound connections are blocked in the test process. The
application/schema hooks remain real. A failed load or timeout fails the check,
and the temporary copy is removed. CI runs it after the normal build.

This check proves the isolated startup path, not production database migration,
Strapi Cloud availability, published operating policies or the four-mode checkout
rehearsal. Those launch gates remain open. The staff operations guide needs no
behavior change: staff shipping choices, cutoffs and service promises are unchanged.
