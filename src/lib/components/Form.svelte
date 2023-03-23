<script lang="ts">
	import { getFormElementAttributes } from '../index';
	import type { ParsedFormConfiguration } from '../types';

	export let form = {} as ParsedFormConfiguration;
</script>

<form {...getFormElementAttributes($$props, form)}>
	<slot name="above-fields" />
	<div class="fields">
		{#each form.fields as fieldOrFieldSet (fieldOrFieldSet.name)}
			{#if fieldOrFieldSet.fields}
				<fieldset>
					{#each fieldOrFieldSet as field (field.name)}
						<svelte:component this={field.component} bind:form bind:field />
					{/each}
				</fieldset>
			{:else}
				<svelte:component this={fieldOrFieldSet.component} bind:form bind:field={fieldOrFieldSet} />
			{/if}
		{/each}
	</div>
	<slot name="below-fields" />
	<slot name="above-buttons" />
	<div class="buttons">
		{#each form.buttons as { name, type, value, label } (name)}
			<button {name} {type} {value}>{label}</button>
		{/each}
	</div>
	<slot name="below-buttons" />
</form>
