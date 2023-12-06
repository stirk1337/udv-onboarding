export type Login = {
    username : string,
    password: string
}

export enum UserRoles {
    undefined = "undefined",
    employee = "employee",
    curator = "curator"
}

export type UserData = {
    id: number,
    name: string,
    email: string,
    role: UserRoles,
    image_url: string
}

export enum EmployeeStatus {
    active = 'active',
    disabled = 'disabled',
}

export type UserOnPlanetData = {
    id: number,
    name: string,
    email: string,
    product: string,
    product_role: string,
    employee_status: EmployeeStatus,
    created_at: string,
    updated_at: string,
    image_url: string
}

export type Planet = {
    id: number,
    name: string,
    curator_id: number,
    created_at: string,
    updated_at: string,
}

export type CuratorPlanetData = Planet & {
    employees: UserOnPlanetData[]
    task_count: number
}

export type Id = number;

export enum TaskStatus {
    inProgress = 'in_progress',
    beingChecked = 'being_checked',
    completed = 'completed',
}

export type PlanetTask = {
    id: number,
    name: string,
    description: string,
    planet_id: number,
    employee_answer: null | string,
    task_status: TaskStatus,
    created_at: string,
    updated_at: string,
}

export type PlanetTaskForVerification = PlanetTask & {
    employee: UserOnPlanetData
}

export type UpdateAnswer = {
    task_id: number,
    planet_id: number
    answer: string,
}

export type NotificationCuratorData = Planet & {
    curator: UserData
}

export type NotificationType = {
    id: number,
    created_at: string,
    employee: UserOnPlanetData,
    is_read: boolean,
    notification_type: NotificationTypes
    planet: NotificationCuratorData
    task: PlanetTask
}

export enum Products {
    datapkIndustrialKit = 'datapk industrial kit',
    industrialFirewall = 'industrial firewall',
    industrialHoneypot = 'industrial honeypot',
    dataDiode = 'data diode',
    itm = 'itm',
    eplat4mPass = 'eplat4m pass',
    eplat4mSoar = 'eplat4m soar',
    eplat4mSgrc = 'eplat4m sgrc',
    eplat4mKii = 'eplat4m kii',
    eplat4m = 'eplat4m',
    siem = 'siem',
}

export enum ProductRoles {
    frontend = 'frontend',
    backend = 'backend',
    analyst = 'analyst',
    test = 'test',
    devops = 'devops',
}

export enum SortTypes {
    created_at = 'created_at',
    name = 'name',
    email = 'email',
    product = 'product',
    product_role = 'product_role',
}

export enum NotificationTypes {
    answer = 'answer',
    new = 'new',
    invited = 'invited',
    decline = 'decline',
}