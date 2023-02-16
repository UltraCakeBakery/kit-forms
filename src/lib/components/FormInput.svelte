<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import type { ParsedFormConfiguration, ParsedFormConfigurationField } from '../types'

    export let form = {} as ParsedFormConfiguration
    export let field = {} as ParsedFormConfigurationField

    $: type = field.type as string
    $: name = field.name
    $: value = field.value
    $: placeholder = field.placeholder
    $: label = field.label
    $: options = field.options || []
    $: description = field.description
    $: min = type === 'number' ? field.validate?.minLength : undefined
    $: max = type === 'number' ? field.validate?.maxLength : undefined
    $: minlength = type === 'text' ? field.validate?.minLength : undefined
    $: maxlength = type === 'text' ? field.validate?.maxLength : undefined
    $: required = field.required
    $: id = field.id

    $: localErrors = field.localErrors
    $: serverErrors = field.serverErrors

    field.serverErrors.set(get(page).form?.[form.name]?.[field.name] ?? [])

    $: errors = [ 
        ...$localErrors, 
        ...$serverErrors
    ]
</script>

<div class="field {name}{type ? ` type-${type}` : ''}{errors?.length ? ' has-errors' : ''}">
    <div class="label-wrapper">
        { #if label !== null }<label for={id}>{label}</label>{/if}
        { #if type !== 'select'}
            <input {name} {id} {type} {min} {max} {minlength} {maxlength} value={$value} {placeholder} {required} on:blur={field.events.onBlur} on:input={field.events.onInput} />
        {:else}
            <select {name} {id} value={$value} {placeholder} {required} >
                { #each options as { label, value } }
                    <option value={value}>{label}</option>
                { /each }
            </select>
        {/if}
    </div>
    { #if errors?.length }
        <div class="errors">
            { #each errors as error}
                <div class="error">
                    {error}
                </div>
            { /each }
        </div>
    { :else if description }
        <div class="description">{description}</div>
    { /if }
</div>