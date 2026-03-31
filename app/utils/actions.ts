import useQuickToasts from '~/composables/useQuickToasts'

interface ActionParameters<T = unknown> {
	action(): Promise<T>,
	successTitle?: string,
	successDescription?: string,
	errorTitle?: string,
	errorDescription?: string,
	showToast?: boolean,
	pending?: Ref<boolean>,
	success?: Ref<boolean>,
	onSuccess?(payload: T): Promise<unknown> | void,
	onError?(e: any): Promise<unknown> | void,
	onFinally?(): Promise<unknown> | void,
	/**
	 * When true, errors thrown inside onSuccess/onError/onFinally are
	 * caught so they never escape runAction.
	 * When false, callback errors propagate to the caller of runAction.
	 * @default true
	 */
	catchCallbackErrors?: boolean,
}

/**
 * Executes a given action with integrated state management for pending and success flags,
 * automatic success or error toast notifications, and configurable lifecycle callbacks.
 * Provides an option to safely catch errors thrown within callbacks or allow them to propagate.
 * @param {ActionParameters<T>} params Configuration object defining the action to execute,
 *        reactive state references, toast messaging, and success, error, or finally callbacks.
 * @return {Promise<void>} A promise that resolves when the action and all relevant
 *         lifecycle callbacks have completed.
 */
export async function runAction<T = unknown>(params: ActionParameters<T>): Promise<void> {

	/**
	 * Safely executes a callback, catching or propagating errors
	 * based on the catchCallbackErrors flag.
	 */
	async function executeCallback(
		fn: (() => Promise<unknown> | void) | undefined,
		catchErrors: boolean,
	): Promise<void> {
		if (fn) {
			if (catchErrors) {
				try {
					await fn()
				} catch (callbackError: any) {
					console.warn('[runAction] Callback threw:', callbackError)
				}
			} else {
				await fn()
			}
		}
	}

	const $qt = useQuickToasts()
	const catchCallbacks = params.catchCallbackErrors !== false

	if (params.pending) {
		params.pending.value = true
	}

	if (params.success) {
		params.success.value = false
	}

	try {
		const result = await params.action()

		if (params.showToast !== false) {
			$qt.success(params.successTitle || 'Action success', params.successDescription)
		}

		await executeCallback(() => params.onSuccess?.(result), catchCallbacks)

		if (params.success) {
			params.success.value = true
		}
	} catch (e: any) {
		if (params.showToast !== false) {
			$qt.error(
				params.errorTitle || 'Action failed',
				params.errorDescription || e.statusText || e.statusMessage || e.message || String(e),
			)
		}

		await executeCallback(() => params.onError?.(e), catchCallbacks)
	} finally {
		if (params.pending) {
			params.pending.value = false
		}

		await executeCallback(() => params.onFinally?.(), catchCallbacks)
	}
}
