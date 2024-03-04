// import home from "../../src/views/AdminPage/homeView.vue";
// import {shallowMount} from "@vue/test-utils";


// it('should render the component', async () => {
//   const wrapper =  shallowMount(home,{ 
//     propsData: {
      
//       category:[]
//           },  
//      mocks: {
//                   $store: {
//                     state: {
//                       projectId: '',
//                       taskId:''
//                     }
// }}}
// );
// await wrapper.vm.$nextTick();
//   expect(wrapper.exists()).toBe(true);
// },5000);



// Import the required libraries
import home from "../../src/views/AdminPage/homeView.vue";
import { shallowMount } from "@vue/test-utils";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a new instance of the axios mock adapter
const mockAxios = new MockAdapter(axios);

it('should render the component', async () => {
  // Set up the mock response for the HTTP request
  mockAxios.onPost('/task/getTaskHistory/').reply(200, {
    data: [{
    
    }],
  });

  // Render the component and pass in any necessary props or mocks
  const wrapper = shallowMount(home, {
    propsData: {
      category: [],
    },
    mocks: {
      $store: {
        state: {
          projectId: '',
          taskId: '',
        },
      },
    },
  });

  // Wait for the next tick to ensure that the component has finished rendering
  await wrapper.vm.$nextTick();

  // Expect the component to exist
  expect(wrapper.exists()).toBe(true);
});