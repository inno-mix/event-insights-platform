/**
 * IBaseRepository — Generic repository interface for the canonical pattern.
 * Every domain repository must implement this contract.
 */
export interface IBaseRepository<T, CreateDto, UpdateDto> {
    findAll(orgId: string): Promise<T[]>;
    findById(id: string, orgId: string): Promise<T | null>;
    create(data: CreateDto, orgId: string): Promise<T>;
    update(id: string, data: UpdateDto, orgId: string): Promise<T>;
    delete(id: string, orgId: string): Promise<void>;
}
