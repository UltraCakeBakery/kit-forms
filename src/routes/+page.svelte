<script lang="ts">
    import forms from './forms'

    export const snapshot = forms.snapshot
</script>

<main style="display: flex; justify-content: space-between; flex-direction: row;">
    <svelte:component this={forms.login} />
    <svelte:component this={forms.register} />
</main>

<style>

    :global(html, body){
        font-family: 'Roboto', sans-serif;
    }

    :global(form .field)
    {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }
    
    :global(form .field .label-wrapper)
    {
        display: flex;
        flex-direction: column;
    }

    :global(form .field.type-checkbox .label-wrapper)
    {
        display: flex;
        flex-direction: row-reverse;
        justify-content: start;
        gap: 0.25rem;
    }

    :global(form label)
    {
        font-weight: bold;
    }

    :global(form input), :global(form select), :global(form textarea)
    {
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #F2F2F2;
        box-shadow: 0px 1px 3px 0px rgba( 0, 0, 0, 0.25);
        margin-bottom: 0.25rem;
    }

    :global(form .description)
    {
        font-size: 0.85rem;
        opacity:0.75;
    }

    :global(form[name="register"])
    {
        background: lightgray;
        border-radius: 3px;
        padding: 20px;
    }
</style>