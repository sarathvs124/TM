import { shallowMount } from '@vue/test-utils';

import IssueType from '../../src/views/AdminPage/updateDialog.vue';


// import axios from 'axios';
// jest.mock('axios');


it('should render the component', () => {
    const wrapper = shallowMount(IssueType,{ 
     
        propsData: {
            Update_tid: "",
            project_Id: "",
                },  mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
}}}
);
wrapper.setData({
    taskData: []
  })

// const mockResponse = { taskData: [],user_list:[],ProjectData:[], };

// // Create a mock function for axios.get
// axios.get.mockResolvedValue(mockResponse);

    expect(wrapper.exists()).toBe(true);
  });

