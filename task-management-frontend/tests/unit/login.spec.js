import LoginPage from "../../src/views/Login/LoginPage.vue";
import { mount, shallowMount } from "@vue/test-utils";

// jest.mock(
//     "/home/sarathvs/Videos/Unit Testing/task-management-tool/task-management-frontend/src/assets/Images/login.jpg",
//     () => "mocked-image"
// );


describe('LoginPage', () => {


test("HelloWorld Component renders the correct text", () => {
    const wrapper = mount(LoginPage);
    // const forgotten = wrapper.get('[data-test="forgotten"');
    const Msg2 = wrapper.get('[data-test="forgotten"]');
    expect(Msg2.text()).toBe("Forgot Password?")


});



test('Check weather email and password field appears on login page', async () => {
    const wrapper = shallowMount(LoginPage);
    expect(wrapper.find('[type="email"]')).toBeDefined();
    expect(wrapper.find('[type="password"]')).toBeDefined();
});


test('Check submit button in login page', async () => {
    const wrapper = shallowMount(LoginPage);
    expect(wrapper.find('[data-test="forgotten"]').exists()).toBe(true);
});





// test("renders the mocked image", () => {
//     const wrapper = shallowMount(LoginPage);
//     expect(wrapper.find("img").props("src")).toBe(mocked-image);
// });

});
