export class AddProjectDto {
  project_name: string;
  project_code: string;
  start_date: string;
  end_date: string;
  project_description: string;
}
export class UpdateProjectDto {
  project_name: string;
  start_date: string;
  end_date: string;
  project_description: string;
}

export class AllocateUserDto {
  users: any;
  from_date: string;
  to_date: string;
  role: number;
}

export class PinProjectDto {
  project_id: number;
}
export class SortPinProject {
  project_id: [];
}
export class EditAllocateUserDto {
  user_id: number;
  role: number;
  end_date: string;
}
