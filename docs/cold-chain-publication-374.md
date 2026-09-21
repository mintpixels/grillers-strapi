# Cold-chain publication and withdrawal — #374

Cold-chain settings must retain a published record. The document middleware rejects
unpublish and delete, including a disabled singleton. To withdraw carrier quotes,
save `Enabled=false` as a draft and publish it. This preserves the explicit state
for consumers and accepted orders; removing the record can cause older consumers
to use defaults. Other content types keep their normal operations. Draft edits,
valid reviewed publication and the published-version transaction check remain.

The guard is always active, with no flag or bypass default. Deploying this CMS
candidate alone does not publish or approve any value. Backend main's existing
disabled/default behavior still differs from the reviewed backend packing
candidate, which withdraws carrier quotes after its cache refresh. Do not use
CMS publication alone as proof of storefront behavior. #372 and #374 retain the
coordinated-release hold and approved same-day entry/republish requirement.

The new component's database collection is
`components_checkout_seasonal_packing_policies`, correcting the draft branch's
`..._policys` spelling. Its API UID remains `checkout.seasonal-packing-policy`.
[Strapi's model contract](https://docs.strapi.io/cms/backend-customization/models#model-settings)
uses `collectionName` as the database table name, so this is not a cosmetic live
rename. Before any schema deployment:

1. Take a fresh protected database backup and full draft/published singleton and
   nested-component export. Record the current release, restore procedure and
   operator; verify recovery on an isolated copy.
2. Inventory actual table/relationship names and row counts on that copy. Inspect
   both spellings, generated/shortened names and nested exposure-rule links.
3. If an earlier candidate created the misspelled table, stop before schema sync.
   Prepare and review a data-preserving rename/relationship migration against
   that exact database, then prove populated draft and published readback. This
   PR does not silently drop, migrate or repopulate existing data.
4. If the component was never deployed and no prior rows/links exist, retain that
   inventory receipt, rehearse the fresh schema, then enter the approved policy
   and republish with the prepared operator the same day. Verify the backend
   policy revision and short, long/hot and pie-heavy quotes under #332.

CI's real `createStrapi().load()` fixture now creates and publishes a disabled
synthetic singleton with nested components, reads it back, attempts unpublish and
delete through the actual Document Service, and verifies the published version
is unchanged after each rejection. It uses disposable SQLite, synthetic secrets
and no outbound connections. This proves native fresh-schema document behavior;
it does not prove a production database upgrade, concurrent edit/rollback,
operating-data approval or external quote acceptance. The unit tests also cover
enabled and disabled removal, unrelated content types and prior publication
checks. Peter's #357/#358 answers and all three editable cost-input/rule-mapping
requirements remain separate work.
