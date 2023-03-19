<script>
	import 'uno.css'
    import '@unocss/reset/tailwind.css'
	import { page } from '$app/stores'
</script>

<main class="flex justify-between flex-row h-screen">
	<div class="flex-1 bg-gray-50 flex items-center justify-center p-48">
        { #if !$page.url.searchParams.has('password-reset') }
            <img class="relative w-full aspect-5/4" src="/login.svg" alt="" />
        { :else }
            <img class="relative w-full aspect-5/4" src="/password.svg" alt="" />
        { /if}
    </div>
	<div class="w-md shadow-xl bg-white flex-shrink-0 flex items-center justify-center">
        <slot></slot>
    </div>
</main>