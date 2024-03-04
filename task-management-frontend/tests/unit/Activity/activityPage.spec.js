import ActivityPage from "../../../src/views/AdminPage/UserActivity/ActivityPage.vue"
import Vuex from 'vuex'
import {  shallowMount,createLocalVue } from "@vue/test-utils"


describe('preview', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)



    it('should render the component', () => {
        const wrapper = shallowMount(ActivityPage);
    
        expect(wrapper.exists()).toBe(true);
      });
    
    

test('Check submit button in login page', async () => {
    const wrapper = shallowMount(ActivityPage);
    expect(wrapper.find('[data-test="id1"]').exists()).toBe(true);
});

test("HelloWorld Component renders the correct text", () => {
    const wrapper = shallowMount(ActivityPage,{ 
            activity:[{
                "update_type": 1,
                "task_history_id": 16988,
                "task_id": 517,
                "task_name": "wertghjk",
                "task_description": "<p>asdfghjk</p>",
                "action": 10,
                "created_date": "2023-04-14T05:14:27.000Z",
                "sort_date": "2023-04-14T05:14:27.000Z",
                "group_date": "2023-04-14",
                "status": 1,
                "action_by": "Hemandh",
                "profile_photo": "https://dev-tm-images.innovaturelabs.com/FiREr2xHxm_1681131869338.jpg",
                "project_id": 93,
                "project_name": "英語から日本語への最も人気のあるフレーズ英語から日本語への最",
                "comment": "@test@gmail.com @pluto123@gmail.com dxs"
            }
        ],
           
                  



    });
    expect(wrapper.find('[data-test="id3"]').exists()).toBe(false);

    // const Msg2 = wrapper.get('[data-test="id3"]');
    // expect(Msg2.text()).toBe("Be the first to comment.........")


});

});