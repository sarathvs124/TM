import { shallowMount } from '@vue/test-utils';

import IssueType from '../../src/views/AdminPage/adminTopNav.vue';




it('should render the component', () => {
    const wrapper = shallowMount(IssueType,{ 
       mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
}}}
);

const mockElement = { /* mock properties and methods */ 
style:{
    display : "",

}

};


// const mockElement1 = { style: {} };

    // Create a mock function for document.getElementById
    // const mockGetElementById1 = jest.fn().mockReturnValue(mockElement1);

    // Replace the original function with the mock function
    // jest.spyOn(document, 'getElementById').mockImplementation(mockGetElementById1);


// Create a mock function for document.getElementById
const mockGetElementById = jest.fn().mockReturnValue(mockElement);

// Replace the original function with the mock function
jest.spyOn(document, 'getElementById').mockImplementation(mockGetElementById);


    expect(wrapper.exists()).toBe(true);
  });

