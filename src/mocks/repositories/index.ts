import { previewData } from '../previewData';
import type { Repository } from '../../domain/types/repository';
import type { Ministry, MinistryMembership, Profile, Schedule, ScheduleMember, Song, FeedPost, SwapRequest } from '../../domain/types';

function repository<T extends { id: string }>(collection: string): Repository<T> {
  return {
    list: () => previewData(collection).data as T[],
    get: id => previewData(collection, 'read', undefined, row => row.id === id, { single: true }).data as T | null,
    create: value => previewData(collection, 'insert', value, undefined, { single: true }).data as T,
    update: (id, value) => previewData(collection, 'update', value, row => row.id === id, { single: true }).data as T | null,
    remove: id => previewData(collection, 'delete', undefined, row => row.id === id).count > 0,
  };
}
export const profilesRepository = repository<Profile>('profiles');
export const ministriesRepository = repository<Ministry>('ministries');
export const membershipsRepository = repository<MinistryMembership>('ministry_members');
export const schedulesRepository = repository<Schedule>('schedules');
export const scheduleMembersRepository = repository<ScheduleMember>('schedule_members');
export const songsRepository = repository<Song>('songs');
export const postsRepository = repository<FeedPost>('feed_posts');
export const swapRequestsRepository = repository<SwapRequest>('schedule_swap_requests');
