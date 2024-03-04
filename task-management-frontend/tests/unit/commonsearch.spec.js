import CommonSearch from "../../src/views/AdminPage/CommonSearch.vue";
import { mount, shallowMount } from "@vue/test-utils";

test('Check weather search field login page', async () => {
    const wrapper = shallowMount(CommonSearch);
    expect(wrapper.find('[type="search"]')).toBeDefined();
    
});