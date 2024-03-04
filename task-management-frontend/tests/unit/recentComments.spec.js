import recentComments from "../../src/views/AdminPage/RecentComments.vue"
import Vuex from 'vuex'
import {  shallowMount,createLocalVue } from "@vue/test-utils"


describe('preview', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
test("HelloWorld Component renders the correct text", () => {
    const wrapper = shallowMount(recentComments,{ 
        propsData: {
            Update_tid:"",
            cmtDetails:[],
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
    const Msg2 = wrapper.get('[data-test="id1"]');
    expect(Msg2.text()).toBe("Be the first to comment.........")


});


test("HelloWorld Component renders the correct text", () => {
  const wrapper = shallowMount(recentComments,{ 
      propsData: {
          Update_tid:"",
          cmtDetails:[{
            "update_type": 1,
            "task_history_id": 16981,
            "task_id": 518,
            "task_name": "New task abc",
            "task_description": "<p>demo paeragraph</p>",
            "action": 10,
            "created_date": "2023-04-12T04:08:34.000Z",
            "sort_date": "2023-04-12T04:08:34.000Z",
            "group_date": "2023-04-12",
            "action_by": "Hemandh",
            "profile_photo": "https://dev-tm-images.innovaturelabs.com/FiREr2xHxm_1681131869338.jpg",
            "project_id": 96,
            "project_name": "new project",
            "comment": "<p>;kl</p>"
          }],
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
  const Msg2 = wrapper.get('[data-test="id2"]');
  expect(Msg2.text()).toBe("Comment :")


});


test("HelloWorld Component renders the correct text", () => {
  const wrapper = shallowMount(recentComments,{ 
    data() {
      return {
        lengthTask: 2
      }
    },
      propsData: {
          Update_tid:"",
          cmtDetails:[		{
            "update_type": 1,
            "task_history_id": 16981,
            "task_id": 518,
            "task_name": "New task abc",
            "task_description": "<p>demo paeragraph</p>",
            "action": 2,
            "created_date": "2023-04-12T04:08:34.000Z",
            "sort_date": "2023-04-12T04:08:34.000Z",
            "group_date": "2023-04-12",
            "action_by": "Hemandh",
            "profile_photo": "https://dev-tm-images.innovaturelabs.com/FiREr2xHxm_1681131869338.jpg",
            "project_id": 96,
            "project_name": "new project",
            "comment": "<p>;kl</p>"
          },
          
          ],
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
  // const Msg2 = wrapper.get('[data-test="id3"]');
  // expect(Msg2.text()).toBe("Load more")
  expect(wrapper.find('[data-test="id3"]').exists()).toBe(false);

});

});