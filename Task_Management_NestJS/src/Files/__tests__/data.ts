export const folder = {
  folder_id: 1,
  folder_name: 'Proj_101',
  directory: 'dirPath',
  status: 1,
  created_date: '2023-02-15T04:58:05.000Z',
  updated_date: '2023-02-15T04:58:05.000Z',
  folder_type: 1,
};
export const task = {
  task_id: 24,
  task_name: 'AdaqqcswaaaacsadaddqaskaacdafxaczaaaadaxazZAS',
  task_description: 'aaaaaassssssssssss',
  status: 1,
  task_status: 2,
  created_date: '2023-03-08T11:18:22.000Z',
  updated_date: '2023-03-10T12:39:00.000Z',
  priority: 2,
  actual_hours: null,
  estimated_hours: '0.01',
  start_date: '2023-04-07',
  end_date: '2023-04-11',
  task_relation: 1,
  attachment_status: null,
};
export const user = {
  user_id: 1,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
  password_token: null,
  notification_url: null,
  status: 1,
  updated_date: '2023-04-03T06:28:10.000Z',
  created_date: '2023-01-14T09:39:02.000Z',
  active_projects: 18,
  new_user: 1,
  login_status: null,
  last_login: '1681146961',
  first_name: 'gggtgtg',
  last_name: 'gtgtgtgt',
  middle_name: 'gttggt',
  phone_number: '4444444444',
  profile_photo:
    'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
  change_password_status: 1,
};
export const task2 = {
  task_id: 24,
  task_name: 'AdaqqcswaaaacsadaddqaskaacdafxaczaaaadaxazZAS',
  task_description: 'aaaaaassssssssssss',
  status: 1,
  task_status: 2,
  created_date: '2023-03-08T11:18:22.000Z',
  updated_date: '2023-03-10T12:39:00.000Z',
  priority: 2,
  actual_hours: null,
  estimated_hours: '0.01',
  start_date: '2023-04-07',
  end_date: '2023-04-11',
  task_relation: 1,
  attachment_status: null,
  created_by_file: user,
};
export const project = {
  project_id: 16,
  project_name: 'task management',
  project_code: 'Apa8rs9hvg000',
  project_description: 'task majnagement is like a backlogx',
  status: 1,
  project_status: null,
  end_date: '2023-04-20',
  start_date: '2023-03-24',
  created_date: '2023-03-07T17:24:27.000Z',
  updated_date: '2023-03-09T21:42:33.000Z',
  total_resource: 6,
  total_task: 19,
  task_id_file: task,
};
export const project1 = {
  project_id: 16,
  project_name: 'task management',
  project_code: 'Apa8rs9hvg000',
  project_description: 'task majnagement is like a backlogx',
  status: 1,
  project_status: null,
  end_date: '2023-04-20',
  start_date: '2023-03-24',
  created_date: '2023-03-07T17:24:27.000Z',
  updated_date: '2023-03-09T21:42:33.000Z',
  total_resource: 6,
  total_task: 19,
  task_id_file: task,
};

export const file = {
  file_id: 1,
  file_name: '上海+中國.',
  file_path:
    'https://dev-tm-taskfiles.innovaturelabs.com/04riaj2_1678274697314.jpg',
  status: 1,
  created_date: '2023-03-08T11:24:57.000Z',
  updated_date: '2023-03-08T11:24:57.000Z',
  file_type: 'image/jpeg',
  project_id_file: project,
};
export const file3 = {
  file_id: 3,
  file_name: 'sssd',
  file_path:
    'https://dev-tm-taskfiles.innovaturelabs.com/04riaj2_1678274697314.jpg',
  status: 1,
  created_date: '2023-03-08T11:24:57.000Z',
  updated_date: '2023-03-08T11:24:57.000Z',
  file_type: 'image/jpeg',
  project_id_file: project,
};

export const file1 = {
  file_id: 2,
  file_name: '上海+中國.',
  file_path:
    'https://dev-tm-taskfiles.innovaturelabs.com/04riaj2_1678274697314.zip',
  status: 1,
  created_date: '2023-03-08T11:24:57.000Z',
  updated_date: '2023-03-08T11:24:57.000Z',
  file_type: 'image/zip',
  project_id_file: project,
};
export const file2 = {
  file_id: 2,
  file_name: '上海+中國.',
  file_path: 'dirPath/m8ik0k2_1678274729439.jpg',
  status: 1,
  created_date: '2023-03-08T11:25:29.000Z',
  updated_date: '2023-03-13T14:53:46.000Z',
  file_type: 'image/jpeg',
  project_id_file: project1,
};
export const roles = {
  role_id: 3,
  role_name: 'Project_Admin',
  status: 1,
  created_date: '2023-01-02T18:30:00.000Z',
  updated_date: '2023-01-02T18:30:00.000Z',
  authority: 2,
};
export const projectResourceAllocation = {
  project_resource_allocation_id: 31,
  allocation_status: 1,
  status: 1,
  from_date: '2023-03-10',
  to_date: '2023-03-26',
  pin_status: 0,
  pin_order: 0,
  created_date: '2023-03-07T17:24:27.000Z',
  updated_date: '2023-03-07T17:24:27.000Z',
  role: roles,
};
export const role1 = {
  role_id: 5,
  role_name: 'Developer',
  status: 1,
  created_date: '2023-01-02T18:30:00.000Z',
  updated_date: '2023-01-02T18:30:00.000Z',
  authority: 2,
};
export const projectResourceAllocation1 = {
  project_resource_allocation_id: 72,
  allocation_status: 1,
  status: 1,
  from_date: '2023-04-10',
  to_date: '2023-04-30',
  pin_status: 0,
  pin_order: 0,
  created_date: '2023-04-10T10:08:57.000Z',
  updated_date: '2023-04-10T10:08:57.000Z',
  role: role1,
};
export const folder1 = {
  folder_id: 1,
  folder_name: 'Proj_101',
  directory: 'dirPath',
  status: 1,
  created_date: '2023-02-15T04:58:05.000',
  updated_date: '2023-02-15T04:58:05.000Z',
  folder_type: 1,
};
export const project2 = {
  project_id: 2,
  project_name: 'Project 1',
  project_code: 'Proj_101',
  project_description: 'dummy project is live 1',
  status: 1,
  project_status: null,
  end_date: '2023-03-15',
  start_date: '2023-02-15',
  created_date: '2023-02-15T04:58:04.000Z',
  updated_date: '2023-02-15T04:58:04.000Z',
  total_resource: 4,
  total_task: 1,
  project_folder: folder1,
};
export const project3 = {
  project_id: 2,
  project_name: 'Project 1',
  project_code: 'Proj_101',
  project_description: 'dummy project is live 1',
  status: 1,
  project_status: null,
  end_date: '2023-03-15',
  start_date: '2023-02-15',
  created_date: '2023-02-15T04:58:04.000Z',
  updated_date: '2023-02-15T04:58:04.000Z',
  total_resource: 4,
  total_task: 1,
  project_folder: null,
};

export const fileList = [
  {
    file_id: 6,
    file_name: 'Screenshot from 2023-03-07 11-54-15.png',
    file_path:
      'https://dev-tm-taskfiles.innovaturelabs.com/pxw9t00_1678185948225.png',
    status: 1,
    created_date: new Date('2023-03-07T05:15:48.000Z'),
    updated_date: new Date('2023-03-07T05:15:48.000Z'),
    file_type: 'image/png',
    updated_by_file: {
      user_id: 1,
      user_name: 'Hemandh',
      email: 'hemandh.hemandh@gmail.com',
      password: '$2b$10$pBKJT0TMEL3xfqmg01UWmuHULwjXvEn79A2VmkCwsvR39G3VSuK0a',
      password_token: null,
      notification_url: null,
      status: 1,
      updated_date: new Date('2023-03-15T02:37:52.000Z'),
      created_date: new Date('2023-01-14T09:39:02.000Z'),
      active_projects: 52,
      new_user: 1,
      login_status: null,
      last_login: '1679645920',
      first_name: 'hemandh pm__😎__tt',
      last_name: 'mahilal 😊h',
      middle_name: 'nnn p m 😊',
      phone_number: '9446571712',
      profile_photo:
        'https://dev-tm-images.innovaturelabs.com/x4MbCCepia_1678867672393.jpg',
      change_password_status: 1,
    },
    created_by_file: {
      user_id: 1,
      user_name: 'Hemandh',
      email: 'hemandh.hemandh@gmail.com',
      password: '$2b$10$pBKJT0TMEL3xfqmg01UWmuHULwjXvEn79A2VmkCwsvR39G3VSuK0a',
      password_token: null,
      notification_url: null,
      status: 1,
      updated_date: new Date('2023-03-15T02:37:52.000Z'),
      created_date: new Date('2023-01-14T09:39:02.000Z'),
      active_projects: 52,
      new_user: 1,
      login_status: null,
      last_login: '1679645920',
      first_name: 'hemandh pm__😎__tt',
      last_name: 'mahilal 😊h',
      middle_name: 'nnn p m 😊',
      phone_number: '9446571712',
      profile_photo:
        'https://dev-tm-images.innovaturelabs.com/x4MbCCepia_1678867672393.jpg',
      change_password_status: 1,
    },
  },
  {
    file_id: 7,
    file_name: 'Screenshot from 2023-03-06 09-49-30.png',
    file_path:
      'https://dev-tm-taskfiles.innovaturelabs.com/hictwne_1678186266783.png',
    status: 1,
    created_date: new Date('2023-03-07T05:21:07.000Z'),
    updated_date: new Date('2023-03-07T05:21:07.000Z'),
    file_type: 'image/png',
    updated_by_file: {
      user_id: 1,
      user_name: 'Hemandh',
      email: 'hemandh.hemandh@gmail.com',
      password: '$2b$10$pBKJT0TMEL3xfqmg01UWmuHULwjXvEn79A2VmkCwsvR39G3VSuK0a',
      password_token: null,
      notification_url: null,
      status: 1,
      updated_date: new Date('2023-03-15T02:37:52.000Z'),
      created_date: new Date('2023-01-14T09:39:02.000Z'),
      active_projects: 52,
      new_user: 1,
      login_status: null,
      last_login: '1679645920',
      first_name: 'hemandh pm__😎__tt',
      last_name: 'mahilal 😊h',
      middle_name: 'nnn p m 😊',
      phone_number: '9446571712',
      profile_photo:
        'https://dev-tm-images.innovaturelabs.com/x4MbCCepia_1678867672393.jpg',
      change_password_status: 1,
    },
    created_by_file: {
      user_id: 1,
      user_name: 'Hemandh',
      email: 'hemandh.hemandh@gmail.com',
      password: '$2b$10$pBKJT0TMEL3xfqmg01UWmuHULwjXvEn79A2VmkCwsvR39G3VSuK0a',
      password_token: null,
      notification_url: null,
      status: 1,
      updated_date: new Date('2023-03-15T02:37:52.000Z'),
      created_date: new Date('2023-01-14T09:39:02.000Z'),
      active_projects: 52,
      new_user: 1,
      login_status: null,
      last_login: '1679645920',
      first_name: 'hemandh pm__😎__tt',
      last_name: 'mahilal 😊h',
      middle_name: 'nnn p m 😊',
      phone_number: '9446571712',
      profile_photo:
        'https://dev-tm-images.innovaturelabs.com/x4MbCCepia_1678867672393.jpg',
      change_password_status: 1,
    },
  },
];
