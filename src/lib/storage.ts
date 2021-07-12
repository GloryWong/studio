import { LocalStorage } from 'node-localstorage';

class Storage {
  #ls: any = null;

  init(storagePath: string) {
    this.#ls = new LocalStorage(storagePath);
  }

  add(key: string, value: any) {
    try {
      if (!this.#ls.getItem(key)) {
        this.#ls.setItem(key, Storage.str(value));
      } else {
        throw new Error(`${key} already exists`);
      }
    } catch (error) {
      throw new Error(`add failed: ${error}`);
    }
  }

  set(key: string, value: any) {
    try {
      this.#ls.setItem(key, Storage.str(value));
    } catch (error) {
      throw new Error(`set failed: ${error}`);
    }
  }

  remove(key: string) {
    try {
      this.#ls.removeItem(key);
    } catch (error) {
      throw new Error(`remove failed: ${error}`);
    }
  }

  get(key: string, defaultValue: string) {
    try {
      return Storage.par(this.#ls.getItem(key) || defaultValue);
    } catch (error) {
      throw new Error(`get failed: ${error}`);
    }
  }

  static str(value: any): string {
    try {
      return JSON.stringify(value);
    } catch (error) {
      throw new Error(`str failed: ${error}`);
    }
  }

  static par(value: string): any {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`par failed: ${error}`);
    }
  }
}

const storage = new Storage();
export default storage;
