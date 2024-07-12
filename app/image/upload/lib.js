const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function getDerivedKey(key, salt) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return await crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 1000,
            hash: "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", length: 256},
        true,
        [ "encrypt", "decrypt" ]
    );
}

export async function decrypt(derivedKey, ciphertextAndIv) {
    const [ciphertext, ivString] = ciphertextAndIv.split('.');
    const ciphertextBuffer = new Uint8Array(atob(ciphertext).split("").map(char => char.charCodeAt(0))).buffer;
    const iv = new Uint8Array(atob(ivString).split("").map(char => char.charCodeAt(0)));
    const plaintextBuffer = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        derivedKey,
        ciphertextBuffer
    );
    return decoder.decode(plaintextBuffer);
}

export async function encrypt(derivedKey, text) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertextBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        derivedKey,
        encoder.encode(text)
    );
    const ciphertext = btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertextBuffer)));
    const ivString = btoa(String.fromCharCode.apply(null, iv));
    return `${ciphertext}.${ivString}`;
}