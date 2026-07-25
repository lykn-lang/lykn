# Annex D (informative) Host Layering Points

See [4.2](#sec-hosts-and-implementations) for the definition of [host](#host).

## D.1 Host Hooks

**[HostCallJobCallback](#sec-hostcalljobcallback)(...)**

**[HostEnqueueFinalizationRegistryCleanupJob](#sec-host-cleanup-finalization-registry)(...)**

**[HostEnqueueGenericJob](#sec-hostenqueuegenericjob)(...)**

**[HostEnqueuePromiseJob](#sec-hostenqueuepromisejob)(...)**

**[HostEnqueueTimeoutJob](#sec-hostenqueuetimeoutjob)(...)**

**[HostEnsureCanCompileStrings](#sec-hostensurecancompilestrings)(...)**

**[HostFinalizeImportMeta](#sec-hostfinalizeimportmeta)(...)**

**[HostGetImportMetaProperties](#sec-hostgetimportmetaproperties)(...)**

**[HostGrowSharedArrayBuffer](#sec-hostgrowsharedarraybuffer)(...)**

**[HostHasSourceTextAvailable](#sec-hosthassourcetextavailable)(...)**

**[HostLoadImportedModule](#sec-HostLoadImportedModule)(...)**

**[HostGetSupportedImportAttributes](#sec-hostgetsupportedimportattributes)(...)**

**[HostMakeJobCallback](#sec-hostmakejobcallback)(...)**

**[HostPromiseRejectionTracker](#sec-host-promise-rejection-tracker)(...)**

**[HostResizeArrayBuffer](#sec-hostresizearraybuffer)(...)**

**[InitializeHostDefinedRealm](#sec-initializehostdefinedrealm)(...)**

## D.2 Host-defined Fields

`[[HostDefined]]` on [Realm Records](#realm-record): See [Table 24](#table-realm-record-fields).

`[[HostDefined]]` on [Script Records](#script-record): See [Table 39](#table-script-records).

`[[HostDefined]]` on [Module Records](#sec-abstract-module-records): See [Table 43](#table-module-record-fields).

`[[HostDefined]]` on [JobCallback Records](#sec-jobcallback-records): See [Table 28](#table-jobcallback-records).

`[[HostSynchronizesWith]]` on Candidate Executions: See [Table 99](#table-candidate-execution-records).

`[[IsHTMLDDA]]`: See [B.3.6](#sec-IsHTMLDDA-internal-slot).

## D.3 Host-defined Objects

The [global object](#sec-global-object): See clause [19](#sec-global-object).

## D.4 Running Jobs

Preparation steps before, and cleanup steps after, invocation of [Job](#job) [Abstract Closures](#sec-abstract-closure). See [9.5](#sec-jobs).

## D.5 Internal Methods of Exotic Objects

Any of the essential internal methods in [Table 4](#table-essential-internal-methods) for any [exotic object](#exotic-object) not specified within this specification.

## D.6 Built-in Objects and Methods

Any built-in objects and methods not defined within this specification, except as restricted in [17.1](#sec-forbidden-extensions).
