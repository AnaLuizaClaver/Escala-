export interface Repository<T extends { id: string }> {
  list(): T[];
  get(id: string): T | null;
  create(value: Omit<T, 'id'>): T;
  update(id: string, value: Partial<T>): T | null;
  remove(id: string): boolean;
}
