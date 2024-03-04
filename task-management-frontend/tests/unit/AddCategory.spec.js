import AddCategory from "../../src/views/AdminPage/AddCategory.vue";
import { mount, shallowMount } from "@vue/test-utils";

describe('AddCategory', () => {

test(" Component renders the correct text", () => {
    const wrapper = mount(AddCategory);
    const Msg = wrapper.get('[data-test="category"]');
    expect(Msg.text()).toBe("Category Management")


});
test('Check submit button in category page', async () => {
    const wrapper = shallowMount(AddCategory);
    expect(wrapper.find('[data-test="button"]').exists()).toBe(false);
});
});