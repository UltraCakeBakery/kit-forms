<script lang="ts">
	import forms from './forms';

	export const snapshot = forms.snapshot;
</script>

<svelte:component this={forms.login} />

<style>
	:global(html, body) {
		@apply font-sans;
	}

	:global(form .field) {
		@apply flex mb-1 flex-col;
	}

	:global(form .field .label-wrapper) {
		display: flex;
		flex-direction: column;
	}

	:global(form .field.type-checkbox .label-wrapper) {
		display: flex;
		flex-direction: row-reverse;
		justify-content: start;
		gap: 0.25rem;
	}

	:global(form label) {
		font-weight: bold;
	}

	:global(form input),
	:global(form select),
	:global(form textarea) {
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #f2f2f2;
		box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.25);
		margin-bottom: 0.25rem;
	}

	:global(form .description) {
		font-size: 0.85rem;
		opacity: 0.75;
	}

	:global(form[name='register']) {
		background: lightgray;
		border-radius: 3px;
		padding: 20px;
	}
</style>
