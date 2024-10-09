// KeyManager.ts
import * as fs from 'fs';
import * as path from 'path';

export class KeyManager {
    private keys: string[];
    private currentIndex: number;

    constructor(keysFilePath: string) {
        const absolutePath = path.isAbsolute(keysFilePath)
        ? keysFilePath
        : path.resolve(__dirname, keysFilePath);
        console.log(absolutePath)
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`API keys file not found at ${absolutePath}`);
        }
        const data = fs.readFileSync(absolutePath, 'utf-8');
        this.keys = JSON.parse(data);
        if (!Array.isArray(this.keys) || this.keys.length === 0) {
            throw new Error('API keys file must contain a non-empty array of keys.');
        }
        this.currentIndex = 0;
    }

    getNextKey(): string {
        const key = this.keys[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        return key;
    }
}
