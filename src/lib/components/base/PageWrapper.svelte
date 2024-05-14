<script>
    export let center = false;

    let classes = "";
    export { classes as class }; // export reserved keyword
</script>

<div class="page-wrapper {classes}" class:center-content={center}>
    <main class="page-content">
        <slot />
    </main>

    <footer class="page-footer">
        <slot name="footer" />

        <a href={import.meta.env.PB_DOCS_URL ?? "https://github.com/deniskipeles/clientPB"} target="_blank" rel="noopener noreferrer">
            <i class="ri-book-open-line txt-sm" />
            <span class="txt">Version</span>
        </a>
        <span class="delimiter">|</span>
        <a href={import.meta.env.PB_RELEASES ?? "https://github.com/deniskipeles/clientPB"} target="_blank" rel="noopener noreferrer" title="Releases">
            <span class="txt">{import.meta.env.PB_VERSION ?? "0.0.1"}</span>
        </a>
    </footer>
</div>
