<template>
	<div>
		<h1>vee-validate cross-field Validation</h1>

		<Form @submit="onSubmit" :validation-schema="schema">
			<p>
				These inputs use `yup` to perform validation. The confirmation field
				makes use of <strong>`yup.string.oneOf`</strong> rule with
				<strong>`Yup.ref`</strong> to target another field's value.
			</p>

			<div>
				<label for="password">Password</label>
				<Field id="password" name="password" type="password" />
				<ErrorMessage name="password" />
			</div>

			<div>
				<label for="passwordConfirmation">Confirm Password </label>
				<Field
					id="passwordConfirmation"
					name="passwordConfirmation"
					type="password"
				/>
				<ErrorMessage name="passwordConfirmation" />
			</div>

			<button type="submit">Submit</button>
		</Form>

		<Form @submit="onSubmit">
			<p>
				These inputs use global validators to perform validation, the second
				argument can be defined as another field's value by prefixing that field
				name with `@`
			</p>

			<div>
				<label for="password">Password</label>
				<Field
					id="password"
					name="password"
					type="password"
					rules="required|min:5"
				/>
				<ErrorMessage name="password" />
			</div>

			<div>
				<label for="passwordConfirmation">Confirm Password </label>
				<Field
					id="passwordConfirmation"
					name="passwordConfirmation"
					type="password"
					rules="required|confirmed:@password"
				/>
				<ErrorMessage name="passwordConfirmation" />
			</div>

			<button type="submit">Submit</button>
		</Form>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { Field, Form, ErrorMessage, defineRule } from 'vee-validate'
	import * as yup from 'yup'

	defineRule('required', value => {
		if (!value) {
			return 'This is required'
		}

		return true
	})

	defineRule('min', (value, [min]) => {
		if (value && value.length < min) {
			return `Should be at least ${min} characters`
		}

		return true
	})

	defineRule('confirmed', (value, [other]) => {
		if (value !== other) {
			return `Passwords do not match`
		}

		return true
	})

	export default defineComponent({
		components: {
			Field,
			Form,
			ErrorMessage,
		},
		data: () => {
			const schema = yup.object().shape({
				password: yup
					.string()
					.min(5)
					.required(),
				passwordConfirmation: yup
					.string()
					.required()
					.oneOf([yup.ref('password')], 'Passwords do not match'),
			})

			return {
				schema,
			}
		},
		methods: {
			onSubmit(values) {
				alert(JSON.stringify(values, null, 2))
			},
		},
	})
</script>

<style scoped>
	#app {
		font-family: Arial, Helvetica, sans-serif;
		max-width: 500px;
	}

	input {
		display: block;
	}

	span {
		display: block;
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-top: 20px;
	}

	button {
		display: block;
	}

	form {
		padding: 20px;
		border: 1px solid black;
	}

	form + form {
		margin-top: 20px;
	}
</style>
