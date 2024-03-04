

import Verifivcation from "../../src/views/Login/EmailVerification.vue";
import { mount, shallowMount } from "@vue/test-utils";




test("HelloWorld Component renders the correct text", () => {
    const wrapper = mount(Verifivcation);
    // const forgotten = wrapper.get('[data-test="forgotten"');
    const Msg2 = wrapper.get('[data-test="emailHeading1"]');
    expect(Msg2.text()).toBe("Reset Your Password")


});



test('Check weather email and password field appears on login page', async () => {
    const wrapper = shallowMount(Verifivcation);
    expect(wrapper.find('[type="email"]')).toBeDefined();
    expect(wrapper.find('[type="password"]')).toBeDefined();
});


test('Check submit button in login page', async () => {
    const wrapper = shallowMount(Verifivcation);
    expect(wrapper.find('[data-test="btn1"]').exists()).toBe(true);
});





// test("renders the mocked image", () => {
//     const wrapper = shallowMount(LoginPage);
//     expect(wrapper.find("img").props("src")).toBe(mocked-image);
// });