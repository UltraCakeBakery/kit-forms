<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import type { ParsedFormConfiguration, ParsedFormConfigurationField } from '../types';

	export let form = {} as ParsedFormConfiguration;
	export let field = {} as ParsedFormConfigurationField;

	$: type = field.type as string;
	$: name = field.name;
	$: value = field.value;
	$: id = field.id;
	$: label = field.label;
	$: placeholder = field.placeholder;
	$: options = field.options || [];
	$: min = field.validate?.min ?? field.validate?.minLength;
	$: max = field.validate?.max ?? field.validate?.maxLength;
	$: minlength = field.validate?.minLength;
	$: maxlength = field.validate?.maxLength;
	$: required = field.required;
	$: readonly = field.readonly;
	$: rows = field.rows;
	$: step = field.step;
	$: spellcheck = field.spellcheck;
	$: disabled = field.disabled;
	$: hidden = field.hidden;
	$: pattern = field.pattern ? field.pattern.toString() : null;
	$: autocomplete = field.autocomplete;
	$: description = field.description;
	$: errorElement = field.errorElement ?? 'div';

	$: localErrors = field.localErrors;
	$: serverErrors = field.serverErrors;

	$: registerEvents = !disabled && !readonly;

	field.serverErrors.set(get(page).form?.__KIT_FORMS__?.[form.name]?.[field.name] ?? []);

	$: errors = [...$localErrors, ...$serverErrors];
</script>

<div class="field {name}{type ? ` type-${type}` : ''}{errors?.length ? ' has-errors' : ''}">
	<div class="label-wrapper">
		{#if typeof label === 'string'}
			<label for={id}>
				{label}
			</label>
		{:else}
			<svelte:component this={label} {id} />
		{/if}
		{#if type === 'select'}
			<select
				{name}
				{id}
				value={$value}
				{placeholder}
				{required}
				{disabled}
				{hidden}
				on:input={registerEvents ? field.events.onInput : null}
				on:blur={registerEvents ? field.events.onBlur : null}
				on:focus={registerEvents ? field.events.onFocus : null}
			>
				{#each options as { label, value }}
					<option {value}>{label}</option>
				{/each}
			</select>
		{:else if type === 'textarea'}
			<textarea
				{name}
				{id}
				{rows}
				{readonly}
				{placeholder}
				{disabled}
				{hidden}
				{spellcheck}
				value={$value}
				on:input={registerEvents ? field.events.onInput : null}
				on:blur={registerEvents ? field.events.onBlur : null}
				on:focus={registerEvents ? field.events.onFocus : null}
			/>
		{:else}
			<input
				{name}
				{id}
				{type}
				{min}
				{max}
				{minlength}
				{maxlength}
				value={$value}
				{placeholder}
				{required}
				{pattern}
				{autocomplete}
				{readonly}
				{spellcheck}
				{step}
				{disabled}
				{hidden}
				on:input={registerEvents ? field.events.onInput : null}
				on:blur={registerEvents ? field.events.onBlur : null}
				on:focus={registerEvents ? field.events.onFocus : null}
			/>
		{/if}
	</div>
	{#if errors?.length}
		<svelte:element this={errorElement} class="errors">
			{#each errors as error}
				<svelte:element this={errorElement === 'div' ? 'div' : 'li'} class="error">
					{error}
				</svelte:element>
			{/each}
		</svelte:element>
	{:else if description}
		<div class="description">{description}</div>
	{/if}
</div>
