import crypto from "crypto";
const algorithm = "aes-256-ctr";
const iv = "11fdf16d605f9ebaf376a6a24678caec";
export default class EncryptionUtils {
  static encrypt(text: string, key: string) {
    console.log("Encrypting text:", text, "with key:", key);
    if (!text) return "";
    const cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, "hex"));

    const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);

    return encryptedData.toString("hex");
  }

  static decrypt(text: string, key: string) {
    if (!text) return "";
    const originalData = Buffer.from(iv, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, originalData);

    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(text, "hex")),
      decipher.final(),
    ]);

    return decryptedData.toString();
  }
}