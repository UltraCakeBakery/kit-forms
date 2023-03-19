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
	$: description = field.description;
	$: min = type === 'number' ? field.validate?.minLength : undefined;
	$: max = type === 'number' ? field.validate?.maxLength : undefined;
	$: minlength = type === 'text' ? field.validate?.minLength : undefined;
	$: maxlength = type === 'text' ? field.validate?.maxLength : undefined;
	$: required = field.required;
	$: rows = field.rows;
	$: pattern = field.pattern ? field.pattern.toString() : null;
	$: autocomplete = field.autocomplete;
	$: errorElement = field.errorElement ?? 'div';

	$: localErrors = field.localErrors;
	$: serverErrors = field.serverErrors;

	field.serverErrors.set(get(page).form?.[form.name]?.[field.name] ?? []);

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
				on:input={field.events.onInput}
				on:blur={field.events.onBlur}
				on:focus={field.events.onFocus}
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
				value={$value}
				on:input={field.events.onInput}
				on:blur={field.events.onBlur}
				on:focus={field.events.onFocus}
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
				on:input={field.events.onInput}
				on:blur={field.events.onBlur}
				on:focus={field.events.onFocus}
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
