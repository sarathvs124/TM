import { shallowMount } from '@vue/test-utils';

import updatetask from '../../src/views/AdminPage/TaskUpdates.vue';



it('should render the component', async () => {
  const wrapper = await shallowMount(updatetask, {
    propsData: {
      Update_tid:Number,
      project_Id: "",
    },
    mocks: {
      $store: {
        state: {
          projectId: '',
          taskId:''
        }
      }
    }
  });
  wrapper.setData({
    taskData: []
  });
  expect(wrapper.exists()).toBe(true);
});
