<script>
    import { goto } from '$app/navigation';


    export let data;
    if (data.user) {
        goto("/",{replaceState:true})
    }
</script>