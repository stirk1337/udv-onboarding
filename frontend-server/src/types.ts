export type Login = {
    username : string,
    password: string
}

export enum UserRoles {
    employee = "employee",
    curator = "curator"
}

export type UserData = {
    id: number,
    name: string,
    email: string,
    role: UserRoles,
}

export enum EmployeeStatus {
    active = 'active',
    disabled = 'disabled',
}

export type UserOnPlanetData = {
    id: string,
    name: string,
    email: string,
    product: string,
    product_role: string,
    employee_status: EmployeeStatus,
    created_at: string,
    updated_at: string,
}

export type Planet = {
    id: number,
    name: string,
    curator_id: number,
    created_at: string,
    updated_at: string,
}

export type Id = number;

export enum TaskStatus {
    inProgress = 'in_progress',
    beingChecked = 'being_checked',
    completed = 'completed',
}

export type PlanetTasks = {
    id: number,
    name: string,
    description: string,
    file_link: string,
    planet_id: number,
    employee_answer: null | string,
    task_status: TaskStatus,
    created_at: string,
    updated_at: string,
}

export type UpdateAnswer = {
    task_id: number,
    planet_id: number
    answer: string,
}