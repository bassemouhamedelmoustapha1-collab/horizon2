import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

/**
 * Abstraction de stockage des fichiers uploadés (logos, CV).
 *
 * - En production (variable `BLOB_READ_WRITE_TOKEN` présente) : Vercel Blob,
 *   un stockage objet persistant. Renvoie une URL absolue (https://...).
 * - En local (pas de token) : écriture dans `public/` comme avant. Renvoie
 *   un chemin relatif (/uploads/...).
 *
 * Les deux formats fonctionnent tels quels dans une balise <img> ou un lien.
 */
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function saveUpload(opts: {
  /** Chemin logique, ex: "uploads/logos/abc-123.png" (sans slash initial). */
  key: string;
  buffer: Buffer;
  contentType: string;
}): Promise<string> {
  if (useBlob) {
    const { url } = await put(opts.key, opts.buffer, {
      access: "public",
      contentType: opts.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return url;
  }

  const full = path.join(process.cwd(), "public", opts.key);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, opts.buffer);
  return "/" + opts.key.replace(/\\/g, "/");
}

export async function deleteUpload(stored: string | null | undefined) {
  if (!stored) return;
  try {
    if (stored.startsWith("http")) {
      // URL Vercel Blob
      await del(stored);
    } else if (stored.startsWith("/uploads/")) {
      // Fichier local
      await unlink(path.join(process.cwd(), "public", stored));
    }
  } catch {
    // Fichier déjà absent : on ignore.
  }
}
