import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase, { LocalAuthStore, isTokenExpired } from 'pocketbase';
import { get, writable } from 'svelte/store';
import {
	createRecord,
	listRootsRecords,
	listTablesRecords,
	updateRecord
} from './logic';
import { setErrors } from '$lib/stores/errors';
import { addErrorToast } from '$lib/stores/toasts';
import CommonHelper from '$lib/utils/CommonHelper';
import { goto } from '$app/navigation';
import { protectedFilesCollectionsCache } from '$lib/stores/collections';
import { setAdmin } from '$lib/stores/admin';

PocketBase.prototype.error = function(err, notify = true, defaultMsg = "") {
    if (!err || !(err instanceof Error) || err.isAbort) {
        return;
    }

    const statusCode = (err?.status << 0) || 400;
    const responseData = err?.data || {};
    const msg = responseData.message || err.message || defaultMsg;

    // add toast error notification
    if (notify && msg) {
        addErrorToast(msg);
    }

    // populate form field errors
    if (!CommonHelper.isEmpty(responseData.data)) {
        setErrors(responseData.data);
    }

    // unauthorized
    if (statusCode === 401) {
        this.cancelAllRequests();
        // return this.logout();
		// return new Response('not allowed')
    }

    // forbidden
    if (statusCode === 403) {
        this.cancelAllRequests();
        // return goto("/");
    }
};

const adminFileTokenKey = "pocketbase_auth";
PocketBase.prototype.getAdminFileToken = async function(collectionId = "") {
    let needToken = true;

    if (collectionId) {
        const protectedCollections:any = get(protectedFilesCollectionsCache);
        needToken = typeof protectedCollections[collectionId] !== "undefined"
            ? protectedCollections[collectionId]
            : true;
    }

    if (!needToken) {
        return "";
    }

    let token = localStorage.getItem(adminFileTokenKey);
    token = token ? (JSON.parse(token))?.token : ''

    // request a new token only if the previous one is missing or will expire soon
    if (!token || isTokenExpired(token, 10)) {
        // remove previously stored token (if any)
        token && localStorage.removeItem(adminFileTokenKey);

        if (!this._adminFileTokenRequest) {
            this._adminFileTokenRequest = this.files.getToken();
        }

        token = await this._adminFileTokenRequest;
        localStorage.setItem(adminFileTokenKey, token);
        this._adminFileTokenRequest = null;
    }

    return token;
}


const isDev = import.meta.env.MODE === 'development';
let url = ('http://127.0.0.1:8090');
if (!isDev) {
    url = PUBLIC_POCKETBASE_URL //import.meta.env.PUBLIC_POCKETBASE_URL
}
const pb = new PocketBase(url)
const currentUser = writable(pb.authStore.model);
pb.authStore.onChange((auth) => {
	// console.log('authStore changed', auth);
	currentUser.set(pb.authStore.model);
});

export {
	pb,
	currentUser,
	createRecord,
	updateRecord,
	listTablesRecords,
	listRootsRecords
};
