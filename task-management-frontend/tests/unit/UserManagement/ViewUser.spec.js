import { shallowMount } from '@vue/test-utils';

import MyComponent from '../../../src/views/AdminPage/ViewUser.vue';




it('should render the component', () => {
    const wrapper = shallowMount(MyComponent
);
wrapper.setData({
    taskData: []
  })

// const mockResponse = { taskData: [],user_list:[],ProjectData:[], };

// // Create a mock function for axios.get
// axios.get.mockResolvedValue(mockResponse);

    expect(wrapper.exists()).toBe(true);
  });

