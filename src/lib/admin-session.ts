const ADMIN_LOCK_KEY = 'creativva_admin_unlocked';
const ADMIN_SESSION_KEY = 'creativva_admin_session';

export interface AdminSessionState {
  remembered: boolean;
  active: boolean;
}

export type AdminSessionResult<T> = { ok: true; value: T } | { ok: false; cause: unknown };

const failure = (cause: unknown): AdminSessionResult<never> => ({
  ok: false,
  cause,
});

const getStorage = (): AdminSessionResult<Storage> => {
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return failure(new Error('Admin session storage is unavailable outside this browser.'));
  }

  try {
    const storage = window.localStorage;
    if (!storage) {
      return failure(new Error('Admin session storage is unavailable in this browser.'));
    }
    return { ok: true, value: storage };
  } catch (cause) {
    return failure(cause);
  }
};

export const readAdminSession = (): AdminSessionResult<AdminSessionState> => {
  const storageResult = getStorage();
  if (!storageResult.ok) return storageResult;

  try {
    return {
      ok: true,
      value: {
        remembered: storageResult.value.getItem(ADMIN_LOCK_KEY) === 'true',
        active: storageResult.value.getItem(ADMIN_SESSION_KEY) === 'true',
      },
    };
  } catch (cause) {
    return failure(cause);
  }
};

export const persistAdminSession = (remember: boolean): AdminSessionResult<void> => {
  const storageResult = getStorage();
  if (!storageResult.ok) return storageResult;

  let firstCause: unknown;
  const recordFailure = (cause: unknown) => {
    if (firstCause === undefined) firstCause = cause;
  };

  try {
    if (remember) storageResult.value.setItem(ADMIN_LOCK_KEY, 'true');
    else storageResult.value.removeItem(ADMIN_LOCK_KEY);
  } catch (cause) {
    recordFailure(cause);
  }

  try {
    storageResult.value.setItem(ADMIN_SESSION_KEY, 'true');
  } catch (cause) {
    recordFailure(cause);
  }

  return firstCause === undefined ? { ok: true, value: undefined } : failure(firstCause);
};

export const clearAdminSession = (): AdminSessionResult<void> => {
  const storageResult = getStorage();
  if (!storageResult.ok) return storageResult;

  let firstCause: unknown;
  try {
    storageResult.value.removeItem(ADMIN_LOCK_KEY);
  } catch (cause) {
    firstCause = cause;
  }

  try {
    storageResult.value.removeItem(ADMIN_SESSION_KEY);
  } catch (cause) {
    if (firstCause === undefined) firstCause = cause;
  }

  return firstCause === undefined ? { ok: true, value: undefined } : failure(firstCause);
};
