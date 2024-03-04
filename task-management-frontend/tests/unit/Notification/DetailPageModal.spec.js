import { shallowMount,createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'

import DetailPage from '../../../src/views/AdminPage/Notification/DetailPageModal.vue';
// it('should render the component', () => {
//     const wrapper = shallowMount(DetailPage,{ 
//         propsData: {
            
//             user: [],
//             projectId: "",
//             userInfoModal: true,        
//                 },  mocks: {
//                     $store: {
//                       state: {
//                         projectId: '',
//                         taskId:''
//                       }
// }}}
// );

//     expect(wrapper.exists()).toBe(true);
//   });


  
  describe('preview', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
test("HelloWorld Component renders the correct text", () => {
    const wrapper = shallowMount(DetailPage,{ 
        propsData: {
            user: [],
            projectId:"",
            userInfoModal:true
                  },      mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
                    }
                  },
                  localVue



    });
    const Msg2 = wrapper.get('[data-test="hai"]');
    expect(Msg2.text()).toBe("Go to issue")


});
  });