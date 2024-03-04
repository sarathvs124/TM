import sideBar from "../../../src/views/AdminPage/Notification/sideBarr.vue"
import Vuex from 'vuex'
import {  shallowMount,createLocalVue } from "@vue/test-utils"


describe('sideBar', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
test("side bar Component renders the correct text", () => {
    const wrapper = shallowMount(sideBar,{ 
        propsData: {
            id:"",
            
                  },      mocks: {
                    $store: {
                      state: {
                        projectId: '',
                      }
                    }
                  },
                  localVue



    });
    const Msg2 = wrapper.get('[data-test="id1"]');
    expect(Msg2.text()).toBe("Home")


});

});