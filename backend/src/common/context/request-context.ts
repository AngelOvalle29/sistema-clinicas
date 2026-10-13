import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  usuarioId: number | null;
  ip: string | null;
}

const storage = new AsyncLocalStorage<RequestContextStore>();

export const RequestContext = {
  run<T>(store: RequestContextStore, callback: () => T): T {
    return storage.run(store, callback);
  },
  current(): RequestContextStore | undefined {
    return storage.getStore();
  },
  usuarioId(): number | null {
    return storage.getStore()?.usuarioId ?? null;
  },
  ip(): string | null {
    return storage.getStore()?.ip ?? null;
  },
};
