export interface Profile { id: string; full_name: string; email?: string; phone?: string; role: 'admin' | 'volunteer'; availability?: Record<string, string[]> }
export interface Ministry { id: string; name: string; description?: string | null; active: boolean; color?: string }
export interface MinistryMembership { id: string; user_id: string; ministry_id: string; role: 'leader' | 'volunteer'; status: 'approved' | 'pending' | 'rejected' }
export interface Schedule { id: string; ministry_id: string; title: string; date: string; status: 'draft' | 'published' | 'completed' }
export interface ScheduleMember { id: string; schedule_id: string; ministry_member_id: string | null; response: 'pending' | 'confirmed' | 'declined' }
export interface SwapRequest { id: string; schedule_member_id: string; requester_id: string; status: 'pending' | 'approved' | 'rejected' }
export interface Song { id: string; title: string; artist?: string; musical_key?: string }
export interface FeedPost { id: string; author_id: string; title?: string; content: string }
export interface Notification { id: string; title: string; read: boolean }
export interface MinistryRequest { id: string; user_id: string; ministry_id: string; status: 'pending' | 'approved' | 'rejected' }
export interface Achievement { id: string; title: string; progress: number; max: number }
