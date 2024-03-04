

import Reset from "../../src/views/Login/ResetView.vue";
import { mount, shallowMount } from "@vue/test-utils";





test("HelloWorld Component renders the correct text", () => {
    const wrapper = mount(Reset);
    // const forgotten = wrapper.get('[data-test="forgotten"');
    const Msg2 = wrapper.get('[data-test="Heading1"]');
    expect(Msg2.text()).toBe("Reset Password")


});



test('Check weather email and password field appears on login page', async () => {
    const wrapper = shallowMount(Reset);
    expect(wrapper.find('[type="email"]')).toBeDefined();
    expect(wrapper.find('[type="password"]')).toBeDefined();
});


test('Check submit button in login page', async () => {
    const wrapper = shallowMount(Reset);
    expect(wrapper.find('[data-test="btn1"]').exists()).toBe(true);
});




