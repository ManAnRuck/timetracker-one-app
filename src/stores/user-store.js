import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore, authStoreControlUserToken } from '../stores/auth-store.js'
import { timesStoreChangeDuration } from '../stores/times-store.js'

export const userStore = writable({
	firstTeam: 0,
	language: 'EN',
	termsAccepted: 0,
	stopwatchEntryId: null,
	stopwatchStartTime: 0,
})

export const userStopwatchStore = writable({
	duration: 0
})

let listener,
	interval

export function userStoreInit() {
	setListener()
}

function setListener() {
	authStore.subscribe(authData => {
		if(listener) {
			listener()
		}

		if(authData.hasAuth) {
			listener = firebase.db.collection('users').doc(authData.user.id).onSnapshot(snapshot => {
		
				if(snapshot.data()) {
					const { firstTeam } = get(userStore)

					// TODO: Don't call two times
					if(firstTeam != snapshot.data().firstTeam) {
						authStoreControlUserToken()
					}

					if(JSON.stringify(snapshot.data()) != JSON.stringify(get(userStore))) {
						userStore.update(data => snapshot.data())
					}

				} else {
					updateUser()
				}
			})
		}
	})
}

// TODO: Let's do everythin async
// TODO: Invitation
export function updateUser(cb) {
	const authData = get(authStore)

	if(authData.hasAuth) {

		const userData = get(userStore)

		firebase.db.collection('users').doc(authData.user.id).set(userData).then(res => {
			if(cb) {
				cb(true)
			}
		}).catch(err => {
			if(cb) {
				cb(false)
			}
		})

	}
}


export function userSetStopwatch(id, startTime) {

	userStore.update(data => {
		if(data.stopwatchEntryId) {
			timesStoreChangeDuration(data.stopwatchEntryId, (Math.floor((Date.now()  - data.stopwatchStartTime) / 1000)))
		}
		
		if(data.stopwatchEntryId != id || !data.stopwatchEntryId) {
			data.stopwatchEntryId = id
			data.stopwatchStartTime = startTime
		} else {
			data.stopwatchEntryId = null
			data.stopwatchStartTime = 0
		}


		return data
	})

	updateUser()
}


export function userStoreSetUsername(username, cb) {
	userStore.update(data => {
		data.username = username
		return data
	})

	updateUser(cb)
}


userStore.subscribe(userStoreData => {
	if(userStoreData.stopwatchEntryId) {
		interval = setInterval(() => {
			userStopwatchStore.update(data => {
				return {
					duration: Math.floor((Date.now() - userStoreData.stopwatchStartTime) / 1000)
				}
			})
		}, 1000)
		
		userStopwatchStore.update(data => {
			return {
				duration: Math.floor((Date.now() - userStoreData.stopwatchStartTime) / 1000)
			}
		})
	} else {
		clearInterval(interval)
			userStopwatchStore.update(data => {
				return {
					duration: 0
				}
			})
	}
})
