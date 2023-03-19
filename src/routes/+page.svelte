<script lang="ts">
	import forms from './forms'
	import { page } from '$app/stores'

	export const snapshot = forms.snapshot;
</script>

<svelte:component this={!$page.url.searchParams.has('password-reset') ? forms.login : forms.passwordReset} />

<style>
	:global(html, body) {
		@apply font-sans;
	}

	:global(form)
	{
		@apply w-full m-12;
	}

	:global(form .fields)
	{
		@apply space-y-4;
	}
	
	:global(form .errors)
	{
		@apply text-red-500;
	}
	
	:global(form .error)
	{
		@apply text-sm;
	}
	
	:global(form .field) {
		@apply flex mb-1 flex-col w-full;
	}

	:global(form .field .label-wrapper) {
		@apply flex flex-col;
	}

	:global(form .field.type-checkbox .label-wrapper) {
		@apply flex flex-row-reverse justify-end items-center gap-1;
	}

	:global(form label) {
		@apply font-bold mb-1;
	}

	:global(form .description) {
		@apply text-sm text-gray-800;
	}

	:global(form input),
	:global(form select),
	:global(form textarea) {
		@apply p-1 rounded border border-gray-200 bg-gray-50 p-2 shadow-md mb-1;
	}

	:global(form .has-errors input),
	:global(form .has-errors select),
	:global(form .has-errors textarea)
	{
		@apply \!border-red-600 shadow-red-600 shadow-opacity-10 text-red-600;
	}
</style>
