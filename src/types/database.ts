export type UserRole = 'volunteer' | 'leader' | 'admin';
export type MemberRole = 'volunteer' | 'leader';
export type MemberStatus = 'pending' | 'approved' | 'rejected';
export type ScheduleStatus = 'draft' | 'published' | 'canceled';
export type ResponseStatus = 'pending' | 'confirmed' | 'declined';
export type SwapStatus = 'pending' | 'approved' | 'rejected' | 'canceled';

export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  role: UserRole;
  avatar_url: string | null;
  availability: Record<string, string[]>;
  created_at: string;
  updated_at: string;
}

export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  active: boolean;
  auto_schedule_enabled: boolean;
  created_at: string;
}

export interface MinistryRole {
  id: string;
  ministry_id: string;
  name: string;
  max_volunteers: number;
  created_at: string;
}

export interface MinistryMember {
  id: string;
  user_id: string;
  ministry_id: string;
  role: MemberRole;
  status: MemberStatus;
  created_at: string;
  ministries?: Ministry;
  profiles?: Profile;
}

export interface Schedule {
  id: string;
  ministry_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  status: ScheduleStatus;
  created_at: string;
  ministries?: Ministry;
  schedule_members?: ScheduleMember[];
  schedule_songs?: ScheduleSong[];
}

export interface ScheduleMember {
  id: string;
  schedule_id: string;
  role_id: string | null;
  ministry_member_id: string | null;
  response: ResponseStatus;
  decline_reason: string | null;
  created_at: string;
  ministry_roles?: MinistryRole;
  ministry_members?: MinistryMember;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number | null;
  musical_key: string | null;
  notes: string | null;
  cifra_url: string | null;
  youtube_url: string | null;
  created_at: string;
}

export interface ScheduleSong {
  id: string;
  schedule_id: string;
  song_id: string;
  position: number;
  created_at: string;
  songs?: Song;
}

export interface ScheduleSwapRequest {
  id: string;
  schedule_member_id: string;
  requester_id: string;
  target_member_id: string | null;
  reason: string | null;
  status: SwapStatus;
  created_at: string;
  schedule_members?: ScheduleMember;
  requester?: MinistryMember;
  target?: MinistryMember;
}

export interface FeedPost {
  id: string;
  author_id: string;
  ministry_id: string | null;
  type: string;
  title: string;
  content: string;
  created_at: string;
  profiles?: Profile;
  ministries?: Ministry;
}
