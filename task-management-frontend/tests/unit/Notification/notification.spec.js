

import { shallowMount } from '@vue/test-utils';
import IssueType from '../../../src/views/AdminPage/Notification/NotificationList.vue';




it('should render the component', () => {
    const wrapper = shallowMount(IssueType,{ 
        propsData: {
            notificationList: [ { 
              "notification_id": 159211,
            "content": "A task is reassigned to you by Hemandh",
            "status": 1,
            "view_status": 2,
            "created_date": "2023-05-03T04:18:23.000Z",
            "updated_date": "2023-05-03T04:18:23.000Z",
            "notification_type": 1,
            "action": 1,
            "project_id": 13,
            "project_name": "JoyalsProject",
            "project_code": "Joyal007",
            "task_id": 1148,
            "task_name": "srgth",
            "profile_photo": "https://dev-tm-images.innovaturelabs.com/SlBzqX4nVK_1683028350708.jpg"
        }],
            totalNotification: "",          
                },  mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
}}}
);

const Msg2 = wrapper.get('[data-test="hai"]');
  expect(Msg2.text()).toBe("Load More")  });
  

  it('should render the component', () => {
    const wrapper = shallowMount(IssueType,{ 
        propsData: {
            notificationList: [
            ],
            totalNotification: "",          
                },  mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
}}}
);

    expect(wrapper.exists()).toBe(true);
  });





 