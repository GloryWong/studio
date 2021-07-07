import {LocalStorage} from 'node-localstorage'

class Storage {
  #ls: any = null;

  init(storagePath: string) {
    this.#ls = new LocalStorage(storagePath)
  }

  add(key: string, value: any) {
    if (this.#ls.getItem(key)) {
      throw new Error(`${key} already exists`)
    } else {
      this.#ls.setItem(key, this.str(value))
    }
  }

  set(key: string, value: any) {
    this.#ls.setItem(key, this.str(value))
  }

  remove(key: string) {
    this.#ls.removeItem(key)
  }

  get(key: string, defaultValue: string) {
    return this.par(this.#ls.getItem(key) || defaultValue)
  }

  protected str(value: any): string {
    return JSON.stringify(value)
  }

  protected par(value: string): any {
    return JSON.parse(value)
  }
}

const storage = new Storage()
export default storage
