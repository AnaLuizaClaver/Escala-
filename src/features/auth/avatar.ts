import type { SupabaseClient } from '@supabase/supabase-js';

export const maxAvatarBytes = 1_572_864;
export const avatarTypes = 'image/jpeg,image/png,image/webp';
const bucket = 'volunteer-avatars';
const draftKey = (userId: string) => `escalae:pending-avatar:${userId}`;
const objectPath = (userId: string) => `${userId}/profile`;

export function readPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function saveAvatar(client: SupabaseClient, userId: string, file: Blob) {
  const path = objectPath(userId);
  const uploaded = await client.storage.from(bucket).upload(path, file, { upsert: true });
  if (uploaded.error) throw uploaded.error;
  const updated = await client.from('profiles').update({ avatar_url: path }).eq('id', userId).select('id').single();
  if (updated.error) throw updated.error;
}

export function rememberAvatar(userId: string, photo: string) {
  localStorage.setItem(draftKey(userId), JSON.stringify({ photo, expires: Date.now() + 86_400_000 }));
}

export async function finishAvatar(client: SupabaseClient, userId: string) {
  const key = draftKey(userId);
  const cached = localStorage.getItem(key);
  if (!cached) return;
  const { photo, expires } = JSON.parse(cached) as { photo: string; expires: number };
  if (expires > Date.now()) {
    await saveAvatar(client, userId, await (await fetch(photo)).blob());
  }
  localStorage.removeItem(key);
}

export async function avatarUrl(client: SupabaseClient, userId: string) {
  const { data } = await client.storage.from(bucket).createSignedUrl(objectPath(userId), 3600);
  return data?.signedUrl;
}
