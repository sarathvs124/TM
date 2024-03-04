import fournotfour from "../../src/views/Login/fournotFour.vue";
import { mount } from "@vue/test-utils";




describe('HelloWorld', () => {

test("HelloWorld Component renders the correct text", () => {
    const wrapper = mount(fournotfour);
    const Msg2 = wrapper.get('[data-test="pageerror"]');
    expect(Msg2.text()).toBe("Go Back")


});
});