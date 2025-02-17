<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let type = 'text'
	export let value = ''
	export let disabled = false
	export let error = ''

	let el,
		focused = false,
		prefilled = false

	$: disabledVal = disabled ? 'disabled' : ''

	onMount(() => {
		setTimeout(() => {
			if(el) {
				const inputEl = el.querySelector('input')
				if(inputEl) {
					inputEl.addEventListener('animationstart', () => prefilled = true)
				}
			}
		})
	})

	function focus(e) {
		focused = true
		dispatch('focus')
	}

	function blur(e) {
		focused = false
		dispatch('blur')
	}

	function keydown(e) {
		prefilled = false
		error = ''
		dispatch('keydown', e.keyCode)
	}

</script>

<div 
	bind:this={el}
	class="wrapper
		{focused ? 'focused' : ''}
		{disabled ? 'disabled' : ''}
		{value.length > 0 || prefilled ? 'filled' : ''}"
		on:keydown={e => keydown(e)}>
	<label>
		{label}
	</label>
	{#if type === 'email'}
		<input
			type="email"
			bind:value={value}
			on:focus={e => focus(e)}
			on:blur={e => blur(e)}
			{disabled}
			data-disable="true">
	{:else if type === 'password'}
		<input
			type="password"
			bind:value={value}
			on:focus={e => focus(e)}
			on:blur={e => blur(e)}
			{disabled}
			data-disable="true">
	{:else}
		<input
			type="text"
			bind:value={value}
			on:focus={e => focus(e)}
			on:blur={e => blur(e)}
			{disabled}
			data-disable="true">
	{/if}

	{#if error && error.length > 0}
		<div class="error" transition:fade="{{delay: 0, duration: 100}}">
			{error}
		</div>
	{/if}

</div>

<style>
.wrapper {
	position:relative;
	margin:0;
	width:100%;
	max-width:560px;
}

.wrapper label {
	line-height:12px;
	position:absolute;
	top:50%;
	left:18px;
	font-size:12px;
	transform-origin:0 0;
	transform:translateY(-50%);
	padding:0;
	transition:top 100ms ease;
	color:#999;
	pointer-events:none;
}

.wrapper.focussed label,
.wrapper.filled label {
	top:15px;
	color:#26231E;
}

.wrapper.focussed input,
.wrapper.filled input {
	padding:22px 17px 6px 17px;
}

.wrapper.disabled input {
	border-color:#F7F5F2;
}

.wrapper.disabled:hover input, .wrapper.disabled:focus input {
	border-color:#F7F5F2;
}

.wrapper input {
	-webkit-appearance:none;
	width:100%;
	max-width:100%;
	margin:0;
	border:#CCC9C4 1px solid;
	padding:14px 17px 14px 17px;
	line-height:24px;
	font-size:16px;
	background:#FFF;
	border-radius:6px;
	box-shadow:none;
	caret-color:#26231E;
	box-shadow:0 0 0 100px #FFF inset;
	outline-style:solid;
	outline-color:rgba(0, 0, 255, .25);
	outline-width:0;
	outline-offset:2px;
	color:#26231E;
	transition: border-color 100ms ease;
}

.wrapper:hover input, .wrapper:focus input {
	border-color:#26231E;
}

.wrapper input:-webkit-autofill {
	animation-duration: 50000s;
	animation-name: onautofillstart;
}

.error {
	position: absolute;
	top:100%;
	left:18px;
	background:#26231E;
	font-size:14px;
	line-height: 24px;
	margin:-3px 0 0 0;
	padding:0 12px;
	border-radius: 6px;
	color:#FFF;
	box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
}

.error:after {
	content:'';
	display: block;
	width:6px;
	height:6px;
	position: absolute;
	top:0;
	left:50%;
	background:#26231E;
	transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
}

@keyframes onautofillstart { from {} }
</style>